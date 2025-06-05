async function safeWrite(url, scanBtn, mode) {
  const status = document.getElementById("status");
  const successSound = document.getElementById("successSound");
  const nextAssetBtn = document.getElementById("nextAsset");
  const prevAssetBtn = document.getElementById("prevAsset");

  const cancelScanSingle = document.getElementById("cancelScanSingle");
  const cancelScanBatch = document.getElementById("cancelScanBatch");

  const batchNav = document.getElementById("batchNavControls");

  scanBtn.disabled = true;

  if (mode === "batch") {
    nextAssetBtn.disabled = true;
    prevAssetBtn.disabled = true;
    cancelScanBatch.style.display = "inline-block";
    if (batchNav) batchNav.style.display = "none";
  } else {
    cancelScanSingle.style.display = "inline-block";
  }

  scanBtn.textContent = "Scanning...";
  await new Promise(resolve => setTimeout(resolve, 250));

  try {
    const ndef = new NDEFReader();
    await ndef.write({ records: [{ recordType: "url", data: url }] });
    await new Promise(r => setTimeout(r, 500));
    successSound.play();
    window.failCount = 0;
    status.scrollIntoView({ behavior: "smooth", block: "end" });
    return true;
  } catch (err) {
    console.error("Write failed:", err);
    window.failCount = (window.failCount || 0) + 1;
    status.textContent = `❌ ${err.message}`;
    if (window.failCount >= 2) {
      status.textContent += " ⚠️ Try toggling NFC or restarting Chrome.";
    }
    return false;
  } finally {
    scanBtn.disabled = false;
    scanBtn.textContent = scanBtn.dataset.originalText;
    cancelScanSingle.style.display = "none";
    cancelScanBatch.style.display = "none";
    nextAssetBtn.disabled = false;
    prevAssetBtn.disabled = false;

    if (mode === "batch" && batchNav) {
      batchNav.style.display = "flex"; // ✅ SHOW nav buttons again
    }
  }
}
