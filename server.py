#!/usr/bin/env python3
"""
StoreSignal — simple static + API server
Serves the frontend and provides a mock /api/analyze endpoint.
"""

import json
import re
from http.server import HTTPServer, SimpleHTTPRequestHandler
from pathlib import Path
from urllib.parse import urlparse

PUBLIC = Path(__file__).parent / "public"
PORT = 8080

SAMPLES = [
    {
        "keywords": ["freezer", "cooling", "melt", "ice cream"],
        "result": {
            "issue": "Broken / non-cooling freezer",
            "category": "Equipment / Food Safety",
            "severity": "critical",
            "sentiment": "Negative",
            "store": "Store #42",
            "department": "Facilities / Operations",
            "owner": "Store Manager + Facilities Lead",
            "action": "Dispatch technician immediately; pull melting product; verify temperature logs",
            "confidence": 0.94,
            "safety_risk": True,
            "evidence": "Exact quote from feedback",
            "language": "English",
        },
    },
    {
        "keywords": ["allergen", "label", "peanut", "allergy"],
        "result": {
            "issue": "Missing allergen label",
            "category": "Food Safety / Labelling",
            "severity": "critical",
            "sentiment": "Negative",
            "store": "Store #18",
            "department": "Quality / Compliance",
            "owner": "Quality Manager + Store Manager",
            "action": "Quarantine batch; relabel or remove; audit all allergen packaging",
            "confidence": 0.96,
            "safety_risk": True,
            "evidence": "Exact quote from feedback",
            "language": "English",
        },
    },
    {
        "keywords": ["rude", "staff", "billing", "pos", "scanner", "queue"],
        "result": {
            "issue": "Rude staff / POS lag",
            "category": "Customer Experience / Operations",
            "severity": "high",
            "sentiment": "Negative",
            "store": "Store #7",
            "department": "Store Ops + HR",
            "owner": "Store Manager + HR",
            "action": "Coach staff; check POS hardware and network; reduce queue time",
            "confidence": 0.88,
            "safety_risk": False,
            "evidence": "Exact quote from feedback",
            "language": "English",
        },
    },
]

DEFAULT = {
    "issue": "General operational issue",
    "category": "Operations",
    "severity": "medium",
    "sentiment": "Neutral",
    "store": "Unknown",
    "department": "Store Operations",
    "owner": "Store Manager",
    "action": "Investigate and follow standard SOP",
    "confidence": 0.75,
    "safety_risk": False,
    "evidence": "",
    "language": "English",
}


def analyze(text: str) -> dict:
    t = text.lower()
    for sample in SAMPLES:
        if any(k in t for k in sample["keywords"]):
            result = dict(sample["result"])
            result["evidence"] = text[:140]
            return result
    result = dict(DEFAULT)
    result["evidence"] = text[:140]
    return result


class Handler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(PUBLIC), **kwargs)

    def do_POST(self):
        if self.path == "/api/analyze":
            length = int(self.headers.get("Content-Length", 0))
            body = self.rfile.read(length)
            try:
                data = json.loads(body.decode("utf-8"))
                text = data.get("text", "")
            except Exception:
                text = ""
            result = analyze(text)
            payload = json.dumps(result).encode("utf-8")
            self.send_response(200)
            self.send_header("Content-Type", "application/json")
            self.send_header("Content-Length", str(len(payload)))
            self.send_header("Access-Control-Allow-Origin", "*")
            self.end_headers()
            self.wfile.write(payload)
        else:
            self.send_error(404)

    def do_OPTIONS(self):
        self.send_response(204)
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.end_headers()

    def log_message(self, format, *args):
        print("[%s] %s" % (self.log_date_time_string(), format % args))


def main():
    server = HTTPServer(("0.0.0.0", PORT), Handler)
    print(f"StoreSignal running at http://localhost:{PORT}")
    print("Press Ctrl+C to stop")
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\nStopped.")


if __name__ == "__main__":
    main()
