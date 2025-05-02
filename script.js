// Initialize AOS
AOS.init({ duration: 1000, once: true });

// Set Recipient Name from URL
function setRecipientName() {
  const params = new URLSearchParams(window.location.search);
  const recipient = params.get("to") || "Tamu Undangan";
  document.getElementById("recipient-name").textContent = decodeURIComponent(recipient.replace(/\+/g, " "));
}

// Open Invitation
function openInvitation() {
  document.getElementById("landing").style.display = "none";
  document.getElementById("invitation").style.display = "block";
  window.scrollTo(0, 0);
  playMusic();
}

// Background Music
const bgMusic = document.getElementById("bg-music");
let isPlaying = false;

function toggleMusic() {
  if (isPlaying) {
    bgMusic.pause();
    isPlaying = false;
  } else {
    bgMusic.play();
    isPlaying = true;
  }
}

function playMusic() {
  bgMusic.play();
  isPlaying = true;
}

// Copy Rekening
function copyRek(nomor) {
  navigator.clipboard.writeText(nomor).then(() => {
    alert("Nomor rekening berhasil disalin: " + nomor);
  });
}

// Countdown Timer
function countdown() {
  const weddingDate = new Date("August 14, 2025 09:00:00").getTime();
  const now = new Date().getTime();
  const distance = weddingDate - now;

  const days = Math.floor(distance / (1000 * 60 * 60 * 24));
  const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((distance % (1000 * 60)) / 1000);

  document.getElementById("days").textContent = days.toString().padStart(2, "0");
  document.getElementById("hours").textContent = hours.toString().padStart(2, "0");
  document.getElementById("minutes").textContent = minutes.toString().padStart(2, "0");
  document.getElementById("seconds").textContent = seconds.toString().padStart(2, "0");

  if (distance < 0) {
    document.getElementById("countdown").innerHTML = "<p>Hari bahagia telah tiba!</p>";
  }
}

setInterval(countdown, 1000);

// Guestbook Functions
function loadGuestbook() {
  const guestbookList = document.getElementById("guestbook-list");
  const greetings = JSON.parse(localStorage.getItem("greetings") || "[]");
  guestbookList.innerHTML = "";
  greetings.forEach((greeting) => {
    const item = document.createElement("div");
    item.className = "guestbook-item";
    item.innerHTML = `<h4>${greeting.name}</h4><p>${greeting.message}</p>`;
    guestbookList.appendChild(item);
  });
}

function addGreeting(name, message) {
  const greetings = JSON.parse(localStorage.getItem("greetings") || "[]");
  greetings.unshift({ name, message, date: new Date().toISOString() });
  localStorage.setItem("greetings", JSON.stringify(greetings));
  loadGuestbook();
}

// RSVP Form Submission
document.getElementById("rsvp-form").addEventListener("submit", function (e) {
  e.preventDefault();
  const form = e.target;
  const result = document.getElementById("rsvp-result");
  const name = form.name.value;
  const message = form.message.value;

  // Add to guestbook (localStorage for demo)
  if (message) {
    addGreeting(name, message);
  }

  // Submit to Formspree
  fetch(form.action, {
    method: "POST",
    body: new FormData(form),
    headers: { Accept: "application/json" },
  })
    .then((response) => {
      if (response.ok) {
        result.innerHTML = `<p>Terima kasih, ${name}! Konfirmasi Anda telah kami terima.</p>`;
        form.reset();
      } else {
        result.innerHTML = `<p>Maaf, terjadi kesalahan. Silakan coba lagi.</p>`;
      }
    })
    .catch(() => {
      result.innerHTML = `<p>Maaf, terjadi kesalahan. Silakan coba lagi.</p>`;
    });
});

// Initialize
setRecipientName();
loadGuestbook();