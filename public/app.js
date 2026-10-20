/* StoreSignal — interactive demo */
const samples = [
  "Freezer in the dairy section is not cooling at all. Ice cream is melting and milk is warm.",
  "Peanut traces found but the label says nothing about allergens. This is dangerous for my child.",
  "Billing staff was very rude and the POS scanner kept lagging. Waited 15 minutes in queue.",
  "Fridge temperature is high, items look spoiled. Also AC is not working in the store.",
  "Product barcode scanning is slow. Staff struggling with the machine. Customer waiting time high.",
];

let sampleIndex = 0;

const feedbackEl = document.getElementById("feedback");
const analyzeBtn = document.getElementById("analyzeBtn");
const sampleBtn = document.getElementById("sampleBtn");
const resultEl = document.getElementById("result");

const severityBadge = document.getElementById("severityBadge");
const confidenceEl = document.getElementById("confidence");
const issueTitle = document.getElementById("issueTitle");
const categoryEl = document.getElementById("category");
const ownerEl = document.getElementById("owner");
const actionEl = document.getElementById("action");
const safetyEl = document.getElementById("safety");
const evidenceEl = document.getElementById("evidence");

function analyzeLocal(text) {
  const t = text.toLowerCase();
  if (t.includes("freezer") || t.includes("cooling") || t.includes("melt") || t.includes("ice cream")) {
    return {
      issue: "Broken / non-cooling freezer",
      category: "Equipment / Food Safety",
      severity: "critical",
      owner: "Store Manager + Facilities Lead",
      action: "Dispatch technician immediately; pull melting product; verify temperature logs",
      confidence: 0.94,
      safety_risk: true,
      evidence: text.slice(0, 120),
    };
  }
  if (t.includes("allergen") || t.includes("peanut") || t.includes("allergy") || t.includes("label")) {
    return {
      issue: "Missing allergen label",
      category: "Food Safety / Labelling",
      severity: "critical",
      owner: "Quality Manager + Store Manager",
      action: "Quarantine batch; relabel or remove; audit all allergen packaging",
      confidence: 0.96,
      safety_risk: true,
      evidence: text.slice(0, 120),
    };
  }
  if (t.includes("rude") || t.includes("staff") || t.includes("billing") || t.includes("pos") || t.includes("scanner")) {
    return {
      issue: "Rude staff / POS lag",
      category: "Customer Experience / Operations",
      severity: "high",
      owner: "Store Manager + HR",
      action: "Coach staff; check POS hardware and network; reduce queue time",
      confidence: 0.88,
      safety_risk: false,
      evidence: text.slice(0, 120),
    };
  }
  if (t.includes("ac") || t.includes("temperature") || t.includes("spoiled")) {
    return {
      issue: "High temperature / AC failure",
      category: "Facilities / Food Safety",
      severity: "critical",
      owner: "Facilities Lead + Store Manager",
      action: "Check AC unit; move sensitive stock; log temperature",
      confidence: 0.91,
      safety_risk: true,
      evidence: text.slice(0, 120),
    };
  }
  return {
    issue: "General operational issue",
    category: "Operations",
    severity: "medium",
    owner: "Store Manager",
    action: "Investigate and follow standard SOP",
    confidence: 0.75,
    safety_risk: false,
    evidence: text.slice(0, 120),
  };
}

function showResult(data) {
  severityBadge.textContent = data.severity;
  severityBadge.className = "badge " + data.severity;
  confidenceEl.textContent = Math.round(data.confidence * 100) + "% confidence";
  issueTitle.textContent = data.issue;
  categoryEl.textContent = data.category;
  ownerEl.textContent = data.owner;
  actionEl.textContent = data.action;
  safetyEl.textContent = data.safety_risk ? "Yes — safety critical" : "No";
  evidenceEl.textContent = '"' + data.evidence + '"';
  resultEl.classList.remove("hidden");
}

analyzeBtn.addEventListener("click", async () => {
  const text = feedbackEl.value.trim();
  if (!text) {
    feedbackEl.focus();
    return;
  }
  analyzeBtn.disabled = true;
  analyzeBtn.textContent = "Analyzing…";

  // Try backend first, fall back to local mock
  try {
    const res = await fetch("/api/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    });
    if (res.ok) {
      const data = await res.json();
      showResult(data);
    } else {
      showResult(analyzeLocal(text));
    }
  } catch {
    showResult(analyzeLocal(text));
  }

  analyzeBtn.disabled = false;
  analyzeBtn.textContent = "Analyze";
});

sampleBtn.addEventListener("click", () => {
  feedbackEl.value = samples[sampleIndex % samples.length];
  sampleIndex++;
  resultEl.classList.add("hidden");
});

// Scroll animations
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) e.target.classList.add("visible");
    });
  },
  { threshold: 0.12 }
);
document.querySelectorAll(".animate-on-scroll").forEach((el) => observer.observe(el));

// Mobile nav
const toggle = document.querySelector(".nav-toggle");
const links = document.querySelector(".nav-links");
if (toggle && links) {
  toggle.addEventListener("click", () => links.classList.toggle("open"));
}
