const modeSelect = document.getElementById("modeSelect");
const singleMode = document.getElementById("singleMode");
const batchMode = document.getElementById("batchMode");
const status = document.getElementById("status");

const nextAssetBtn = document.getElementById("nextAsset");
const prevAssetBtn = document.getElementById("prevAsset");

const companySelectSingle = document.getElementById("companySelectSingle");
const companySelectBatch = document.getElementById("companySelectBatch");

window.failCount = 0;
window.batchAssets = [];
window.batchIndex = 0;

modeSelect.addEventListener("change", () => {
  singleMode.style.display = modeSelect.value === "single" ? "block" : "none";
  batchMode.style.display = modeSelect.value === "batch" ? "block" : "none";
  status.textContent = "";
});

companySelectSingle.addEventListener("change", () => {
  const val = companySelectSingle.value;
  if (val) document.getElementById("baseUrlSingle").value = val;
});
companySelectBatch.addEventListener("change", () => {
  const val = companySelectBatch.value;
  if (val) document.getElementById("baseUrlBatch").value = val;
});

document.getElementById("resetBtn").addEventListener("click", () => location.reload());

document.getElementById("writeSingle").addEventListener("click", async () => {
  const base = document.getElementById("baseUrlSingle").value.trim();
  const id = document.getElementById("assetIdSingle").value.trim().toUpperCase();
  if (!base || !id) return status.textContent = "❗ Missing base URL or asset ID.";
  
  const fullUrl = `${base}${id}`;
  const scanBtn = document.getElementById("writeSingle");
  scanBtn.dataset.originalText = "Write to NFC Tag";

  const success = await safeWrite(fullUrl, scanBtn, "single");
  if (success) {
    status.innerHTML = `✅ Tag written: <a href="${fullUrl}" target="_blank">${fullUrl}</a>`;
    status.scrollIntoView({ behavior: "smooth", block: "end" });
  }
});

document.getElementById("startBatch").addEventListener("click", () => {
  const list = document.getElementById("assetList").value.trim().split("\n").filter(l => l);
  if (list.length === 0) return status.textContent = "❗ Enter at least one asset ID.";
  window.batchAssets = list.map(id => id.trim().toUpperCase());
  window.batchIndex = 0;
  document.getElementById("batchControls").style.display = "block";
  updateCurrentAssetDisplay();
  status.scrollIntoView({ behavior: "smooth", block: "end" });
});

document.getElementById("writeBatch").addEventListener("click", async () => {
  const base = document.getElementById("baseUrlBatch").value.trim();
  const id = window.batchAssets[window.batchIndex];
  if (!base || !id) {
    status.textContent = "❗ Missing base URL or asset ID.";
    return;
  }

  const fullUrl = `${base}${id}`;
  const scanBtn = document.getElementById("writeBatch");
  scanBtn.dataset.originalText = "Write Tag for Current Asset";

  const success = await safeWrite(fullUrl, scanBtn, "batch");
  if (success) {
    status.innerHTML = `✅ Tag written for asset ${id}: <a href="${fullUrl}" target="_blank">${fullUrl}</a>`;
    status.scrollIntoView({ behavior: "smooth", block: "end" });
  }
});

document.getElementById("nextAsset").addEventListener("click", () => {
  if (window.batchIndex + 1 < window.batchAssets.length) {
    window.batchIndex++;
    updateCurrentAssetDisplay();
    status.textContent = "";
  } else {
    status.textContent = "✅ All assets written.";
  }
});

document.getElementById("prevAsset").addEventListener("click", () => {
  if (window.batchIndex > 0) {
    window.batchIndex--;
    updateCurrentAssetDisplay();
    status.textContent = "";
  } else {
    status.textContent = "⚠️ At the beginning of the list.";
  }
});

function updateCurrentAssetDisplay() {
  const currentId = window.batchAssets[window.batchIndex];
  document.getElementById("currentAsset").textContent = currentId;
  document.getElementById("assetCountDisplay").textContent =
    `Asset ${window.batchIndex + 1} of ${window.batchAssets.length}`;
}

document.addEventListener("click", () => {
  const successSound = document.getElementById("successSound");
  if (successSound.paused) {
    successSound.play().then(() => successSound.pause()).catch(() => {});
  }
}, { once: true });

modeSelect.dispatchEvent(new Event("change"));

function getQueryParam(key) {
  return new URLSearchParams(window.location.search).get(key);
}

window.addEventListener("DOMContentLoaded", () => {
  const assetId = getQueryParam("assetId");
  const tracker = getQueryParam("tracker");

  if (assetId) {
    document.getElementById("assetIdSingle").value = assetId.toUpperCase();
  }

  if (tracker) {
    const select = document.getElementById("companySelectSingle");
    const match = Array.from(select.options).find(opt =>
      opt.textContent.trim().toLowerCase().includes(tracker.toLowerCase())
    );
    if (match) {
      match.selected = true;
      select.dispatchEvent(new Event("change")); // sets base URL
    }
  }

  if (assetId || tracker) {
    // Switch to single mode automatically
    document.getElementById("modeSelect").value = "single";
    modeSelect.dispatchEvent(new Event("change"));
  }
});