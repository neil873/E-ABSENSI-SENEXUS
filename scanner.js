const API_URL = "https://script.google.com/macros/s/AKfycbzUNayLthLLRwfms4CQHTqTKj3lKhyrhWwb7mOIbMHEIM4HkC0jbwVgy-MYJaV1WxNXcQ/exec";
let isScanning = false;

function onScanSuccess(decodedText) {
  if (isScanning) return;
  isScanning = true;

  showStatus("⏳ Mengirim data absensi...", "bg-blue-600/20 text-blue-400 border border-blue-500/30");

  fetch(API_URL, {
    method: "POST",
    mode: "no-cors",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action: "scanQR", qrData: decodedText })
  })
  .then(() => {
    showStatus(`✓ Absen Berhasil! (Data: ${decodedText})`, "bg-emerald-600/20 text-emerald-400 border border-emerald-500/30");
    setTimeout(() => { hideStatus(); isScanning = false; }, 3000);
  })
  .catch(err => {
    showStatus("❌ Gagal Terhubung ke Server", "bg-red-600/20 text-red-400 border border-red-500/30");
    setTimeout(() => { isScanning = false; }, 3000);
  });
}

function showStatus(text, bgClass) {
  const box = document.getElementById("status-box");
  document.getElementById("status-text").innerText = text;
  box.className = `p-4 rounded-xl text-center font-medium ${bgClass}`;
  box.classList.remove("hidden");
}

function hideStatus() {
  document.getElementById("status-box").classList.add("hidden");
}

document.addEventListener("DOMContentLoaded", function() {
  const scanner = new Html5QrcodeScanner("reader", { fps: 10, qrbox: { width: 220, height: 220 } }, false);
  scanner.render(onScanSuccess);
});