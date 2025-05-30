window.addEventListener("DOMContentLoaded", () => {
  if (localStorage.getItem("restoreState") === "true") {
    const mode = localStorage.getItem("savedMode") || "single";
    document.getElementById("modeSelect").value = mode;
    document.getElementById("modeSelect").dispatchEvent(new Event("change"));

    if (mode === "batch") {
      const assetList = localStorage.getItem("savedAssetList");
      const baseUrl = localStorage.getItem("savedBaseUrl");
      const index = parseInt(localStorage.getItem("savedIndex"), 10);
      if (assetList) document.getElementById("assetList").value = assetList;
      if (baseUrl) document.getElementById("baseUrlBatch").value = baseUrl;
      window.batchAssets = assetList.split("\n").map(x => x.trim().toUpperCase()).filter(Boolean);
      window.batchIndex = isNaN(index) ? 0 : index;
      document.getElementById("batchControls").style.display = "block";
      updateCurrentAssetDisplay();
    } else {
      const baseUrl = localStorage.getItem("savedBaseUrl");
      const assetId = localStorage.getItem("savedSingleId");
      if (baseUrl) document.getElementById("baseUrlSingle").value = baseUrl;
      if (assetId) document.getElementById("assetIdSingle").value = assetId;
    }

    localStorage.clear();
    document.getElementById("status").textContent = "✅ NFC session reset. Ready to scan again.";
  }
});

document.getElementById("cancelScanSingle").onclick = () => {
  localStorage.setItem("restoreState", "true");
  localStorage.setItem("savedMode", "single");
  localStorage.setItem("savedBaseUrl", document.getElementById("baseUrlSingle").value);
  localStorage.setItem("savedSingleId", document.getElementById("assetIdSingle").value);
  location.reload();
};

document.getElementById("cancelScanBatch").onclick = () => {
  localStorage.setItem("restoreState", "true");
  localStorage.setItem("savedMode", "batch");
  localStorage.setItem("savedAssetList", document.getElementById("assetList").value);
  localStorage.setItem("savedBaseUrl", document.getElementById("baseUrlBatch").value);
  localStorage.setItem("savedIndex", window.batchIndex.toString());
  location.reload();
};
