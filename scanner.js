const API_URL = "https://script.google.com/macros/s/AKfycbzUNayLthLLRwfms4CQHTqTKj3lKhyrhWwb7mOIbMHEIM4HkC0jbwVgy-MYJaV1WxNXcQ/exec";
let isProcessing = false;

function onScanSuccess(decodedText) {
  if (isProcessing) return; // Mencegah scan ganda secara tidak sengaja
  isProcessing = true;

  const statusBox = document.getElementById("status-box");
  const statusText = document.getElementById("status-text");

  statusBox.classList.remove("hidden", "bg-emerald-500/20", "text-emerald-400", "bg-rose-500/20", "text-rose-400");
  statusBox.classList.add("bg-amber-500/20", "text-amber-400");
  statusText.innerText = "⏳ Memproses data absensi...";

  fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "text/plain;charset=utf-8" },
    body: JSON.stringify({ action: "scanQR", qrData: decodedText })
  })
  .then(res => res.json())
  .then(data => {
    statusBox.classList.remove("bg-amber-500/20", "text-amber-400");

    if (data.status === "success") {
      statusBox.classList.add("bg-emerald-500/20", "text-emerald-400");
      statusText.innerText = `✅ ${data.message}`;
    } else {
      statusBox.classList.add("bg-rose-500/20", "text-rose-400");
      statusText.innerText = `❌ ${data.message || "Gagal mencatat absensi"}`;
    }

    // Beri jeda 3 detik sebelum siap scan siswa berikutnya
    setTimeout(() => {
      statusBox.classList.add("hidden");
      isProcessing = false;
    }, 3000);
  })
  .catch(err => {
    statusBox.classList.remove("bg-amber-500/20", "text-amber-400");
    statusBox.classList.add("bg-rose-500/20", "text-rose-400");
    statusText.innerText = "❌ Terjadi kesalahan jaringan!";
    
    setTimeout(() => {
      statusBox.classList.add("hidden");
      isProcessing = false;
    }, 3000);
  });
}

// Inisialisasi Kamera HTML5 QR Code
const html5QrCode = new Html5QrcodeScanner("reader", { 
  fps: 10, 
  qrbox: { width: 220, height: 220 } 
});

html5QrCode.render(onScanSuccess);