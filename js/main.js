// ===================================================================
// KODE JAVASCRIPT FINAL - VERSI YANG SUDAH DIPERBAIKI
// ===================================================================

// URL Script Google Anda
// Ganti dengan URL Web App hasil deploy Google Apps Script milik pengantin baru.
// Lihat panduan lengkap di RSVP_SETUP.md.
const scriptURL = "PASTE_URL_APPS_SCRIPT_DI_SINI";

// Menjalankan semua kode setelah halaman HTML selesai dimuat
document.addEventListener("DOMContentLoaded", function () {
  // --- LOGIKA NAMA TAMU DARI URL (MENGGUNAKAN HASH '#') ---
  const guestName = decodeURIComponent(window.location.hash.substring(1)).replace(/\+/g, ' ').trim();
  const guestContainer = document.getElementById("guest-container");
  const guestNameElement = document.getElementById("guest-name");

  if (guestName && guestNameElement && guestContainer) {
    const formattedGuestName = guestName.replace(/\+/g, " ").trim();
    guestNameElement.textContent = formattedGuestName;
    guestContainer.style.display = "block";
  }

  // --- BAGIAN 1: DEKLARASI SEMUA ELEMEN ---
  const cover = document.getElementById("cover");
  const content = document.getElementById("content");
  const openButton = document.getElementById("open-invitation");
  const music = document.getElementById("gamelan-music");
  const musicController = document.getElementById("music-controller");
  const musicIcon = musicController ? musicController.querySelector("i") : null;
  let isMusicPlaying = false;
  const rsvpModalElement = document.getElementById("rsvpModal");
  const rsvpModal = rsvpModalElement
    ? new bootstrap.Modal(rsvpModalElement)
    : null;
  const form = document.getElementById("rsvp-form-modal");
  const submitButton = document.getElementById("submit-button");
  const buttonText = document.getElementById("button-text");
  const buttonSpinner = document.getElementById("button-spinner");
  const konfirmasiSelect = document.getElementById("konfirmasi");
  const jumlahTamuWrapper = document.getElementById("jumlah-tamu-wrapper");
  const wishWall = document.getElementById("wish-wall");
  const loadingWishes = document.getElementById("loading-wishes");
  const copyButtons = document.querySelectorAll(".btn-copy");
  const countdownContainer = document.getElementById("timer-container");
  const countdownExpired = document.getElementById("countdown-expired");
  const footer = document.getElementById("main-footer");
  // Sembunyikan saat cover tampil
  if (musicController) musicController.style.display = "none";
  if (footer) footer.style.display = "none";

  // --- BAGIAN 2: FUNGSI PEMBANTU (HELPER FUNCTIONS) ---
  function addWishToWall(nama, ucapan, konfirmasi, rowNumber) {
    if (!wishWall) return;
    let statusBadge = "";
    if (konfirmasi === "Akan Hadir") {
      statusBadge = `<span class=\"card-status badge-hadir\">Akan Hadir</span>`;
    } else if (konfirmasi === "Tidak Dapat Hadir") {
      statusBadge = `<span class=\"card-status badge-tidak-hadir\">Tidak Dapat Hadir</span>`;
    }
    const newWishHTML = `
            <div class=\"wish-card\" id=\"row-${rowNumber}\">
                <button class="btn-delete" data-row="${rowNumber}" title="Hapus ucapan ini" >&times;</button>
                <div class=\"card-name\">${nama} ${statusBadge}</div>
                <p class=\"card-text\">\"${ucapan}\"</p>
            </div>`;
    wishWall.insertAdjacentHTML("afterbegin", newWishHTML);
  }

  function updateMusicControllerVisuals() {
    if (!musicController || !musicIcon) return;
    if (isMusicPlaying) {
      musicController.classList.add("playing");
      musicIcon.className = "bi bi-pause-circle-fill";
    } else {
      musicController.classList.remove("playing");
      musicIcon.className = "bi bi-play-circle-fill";
    }
  }

  // --- BAGIAN 3: INISIALISASI & LOGIKA UTAMA ---
  // Logika untuk membuka sampul (cover)
  if (openButton) {
    openButton.addEventListener("click", () => {
      // 1. Mainkan musik & update ikon
      if (music) {
        music.play().catch((e) => console.error("Gagal memutar musik:", e));
        isMusicPlaying = true;
        updateMusicControllerVisuals();
      }

      // 2. Animasi fade out untuk cover
      cover.style.transition = "opacity 1s ease-out, transform 1s ease-out";
      cover.style.opacity = "0";
      cover.style.transform = "scale(1.2)";

      // 3. Setelah animasi selesai, tampilkan konten utama
      setTimeout(() => {
        cover.classList.add("d-none");
        if (content) content.classList.remove("d-none");

        // 4. Tambahkan class ke body untuk padding navbar
        document.body.classList.add("content-visible");

        // 5. Tampilkan music controller & footer
        if (musicController) musicController.style.display = "flex";
        if (footer) footer.style.display = "block";

        // 6. Jalankan animasi GSAP
        setupGsapAnimations();

        // 7. Animasi Bunga Masuk (muncul halus dari samping)
        gsap.from(".corner-flower.top-left", { left: -150, opacity: 0, duration: 2.5, ease: "power2.out" });
        gsap.from(".corner-flower.top-right", { right: -150, opacity: 0, duration: 2.5, ease: "power2.out" });
        gsap.from(".corner-flower.bottom-right", { right: -150, opacity: 0, duration: 2.5, ease: "power2.out" });
      }, 1500); // Samakan dengan durasi transisi
    });
  }

  // Logika untuk tombol kontroler musik
  if (musicController) {
    musicController.addEventListener("click", () => {
      if (isMusicPlaying) {
        music.pause();
      } else {
        music.play();
      }
      isMusicPlaying = !isMusicPlaying;
      updateMusicControllerVisuals();
    });
  }

  // Logika auto-pause/play saat pindah tab
  document.addEventListener("visibilitychange", () => {
    if (!music) return;
    if (document.visibilityState === "hidden") {
      music.pause();
    } else if (document.visibilityState === "visible" && isMusicPlaying) {
      music.play();
    }
  });

  // Memuat ucapan awal dari Google Sheets
  if (wishWall) {
    fetch(scriptURL)
      .then((response) => response.json())
      .then((data) => {
        if (loadingWishes) loadingWishes.style.display = "none";
        data.reverse().forEach((wish) => {
          addWishToWall(
            wish.Nama,
            wish.Ucapan,
            wish.Konfirmasi,
            wish.rowNumber
          );
        });
      })
      .catch((error) => {
        if (loadingWishes) loadingWishes.textContent = "Gagal memuat ucapan.";
        console.error("Error loading wishes!", error);
      });
  }

  // Logika untuk tombol Salin (Copy)
  copyButtons.forEach((button) => {
    button.addEventListener("click", (e) => {
      const textToCopy = e.currentTarget.dataset.copy;
      navigator.clipboard
        .writeText(textToCopy)
        .then(() => {
          const originalText = e.currentTarget.innerHTML;
          e.currentTarget.innerHTML = "Berhasil Disalin!";
          e.currentTarget.disabled = true;
          setTimeout(() => {
            e.currentTarget.innerHTML = originalText;
            e.currentTarget.disabled = false;
          }, 2000);
        })
        .catch((err) => {
          console.error("Gagal menyalin: ", err);
        });
    });
  });

  // Logika untuk form RSVP
  if (form) {
    konfirmasiSelect.addEventListener("change", function () {
      if (jumlahTamuWrapper)
        jumlahTamuWrapper.style.display =
          this.value === "Akan Hadir" ? "block" : "none";
    });
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      buttonText.classList.add("d-none");
      buttonSpinner.classList.remove("d-none");
      submitButton.disabled = true;
      const formData = new FormData(form);
      const nama = formData.get("Nama");
      const ucapan = formData.get("Ucapan");
      const konfirmasi = formData.get("Konfirmasi");
      fetch(scriptURL, { method: "POST", body: formData })
        .then((res) => res.json())
        .then((data) => {
          addWishToWall(nama, ucapan, konfirmasi, data.row);
          if (rsvpModal) rsvpModal.hide();
          form.reset();
          if (jumlahTamuWrapper) jumlahTamuWrapper.style.display = "none";
        })
        .catch((error) => {
          console.error("Error!", error.message);
        })
        .finally(() => {
          buttonText.classList.remove("d-none");
          buttonSpinner.classList.add("d-none");
          submitButton.disabled = false;
        });
    });
  }

  // Logika untuk menghapus ucapan
  if (wishWall) {
    wishWall.addEventListener("click", function (e) {
      if (e.target && e.target.classList.contains("btn-delete")) {
        const rowNumber = e.target.dataset.row;
        if (!confirm("Anda yakin ingin menghapus ucapan ini?")) return;
        const password = prompt("Untuk keamanan, masukkan password admin:");
        if (password === null) return;
        const cardToDelete = document.getElementById(`row-${rowNumber}`);
        e.target.disabled = true;
        e.target.innerHTML = "...";
        const deleteFormData = new FormData();
        deleteFormData.append("action", "delete");
        deleteFormData.append("row", rowNumber);
        deleteFormData.append("password", password);
        fetch(scriptURL, { method: "POST", body: deleteFormData })
          .then((res) => res.json())
          .then((data) => {
            if (data.result === "success") {
              cardToDelete.style.transition = "opacity 0.5s";
              cardToDelete.style.opacity = "0";
              setTimeout(() => cardToDelete.remove(), 500);
            } else {
              alert(data.message || "Gagal menghapus. Cek password Anda.");
              e.target.disabled = false;
              e.target.innerHTML = "&times;";
            }
          })
          .catch((error) => {
            alert("Terjadi kesalahan. Gagal menghapus.");
            console.error("Error!", error.message);
            e.target.disabled = false;
            e.target.innerHTML = "&times;";
          });
      }
    });
  }

  // Logika untuk countdown timer
  if (countdownContainer) {
    // Format: "Mmm DD, YYYY HH:MM:SS"
    const weddingDate = new Date("Oct 11, 2026 09:00:00").getTime();
    const countdownFunction = setInterval(function () {
      const now = new Date().getTime();
      const distance = weddingDate - now;
      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);
      const daysEl = document.getElementById("days");
      const hoursEl = document.getElementById("hours");
      const minutesEl = document.getElementById("minutes");
      const secondsEl = document.getElementById("seconds");
      if (daysEl) daysEl.innerHTML = String(days).padStart(2, "0");
      if (hoursEl) hoursEl.innerHTML = String(hours).padStart(2, "0");
      if (minutesEl) minutesEl.innerHTML = String(minutes).padStart(2, "0");
      if (secondsEl) secondsEl.innerHTML = String(seconds).padStart(2, "0");
      if (distance < 0) {
        clearInterval(countdownFunction);
        countdownContainer.classList.add("d-none");
        if (countdownExpired) countdownExpired.classList.remove("d-none");
      }
    }, 1000);
  }

  // --- BAGIAN 4: LOGIKA UNTUK NAVBAR ACTIVE LINK HIGHLIGHTING ---
  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll(".navbar .nav-link");

  if (sections.length > 0 && navLinks.length > 0) {
    sections.forEach((section) => {
      ScrollTrigger.create({
        trigger: section,
        start: "top center",
        end: "bottom center",
        onToggle: (self) => {
          if (self.isActive) {
            const sectionId = section.getAttribute("id");
            navLinks.forEach((link) => {
              link.classList.remove("active");
              if (link.getAttribute("href") === `#${sectionId}`)
                link.classList.add("active");
            });
          }
        },
      });
    });
  }

  // --- BAGIAN 5: ANIMASI GSAP & SCROLLTRIGGER ---
  // Gaya: SMOOTH & ELEGAN — fade + blur reveal halus, drift vertikal pendek,
  // ease "power2.out" / "expo.out". Tidak ada bounce, tidak ada rotasi ekstrem,
  // sesuai nuansa tradisional minimalis.
  function setupGsapAnimations() {
    gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

    // Default ease & start untuk semua tween (konsisten di seluruh halaman)
    const EASE = "power2.out";
    const START = "top 88%";

    // Smooth scroll navbar — durasi lebih pendek supaya tidak terasa "molor"
    document.querySelectorAll('.navbar a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener("click", function (e) {
        e.preventDefault();
        gsap.to(window, {
          duration: 1.4,
          scrollTo: { y: this.getAttribute("href"), offsetY: 50 },
          ease: "power2.inOut",
        });
      });
    });

    // Helper: reveal teks per-kata (bukan per-char — lebih kalem untuk heading)
    function revealText(selector, trigger) {
      const element = document.querySelector(selector);
      if (!element) return;
      const split = new SplitType(element, { types: "words" });
      gsap.from(split.words, {
        opacity: 0,
        y: 14,
        filter: "blur(8px)",
        duration: 1.1,
        stagger: 0.06,
        ease: EASE,
        scrollTrigger: {
          trigger: trigger || selector,
          start: START,
          toggleActions: "play none none none",
        },
      });
    }

    // Helper: fade-up halus untuk elemen umum
    function fadeUp(selector, options = {}) {
      gsap.from(selector, {
        opacity: 0,
        y: options.y ?? 24,
        filter: options.blur === false ? "none" : "blur(6px)",
        duration: options.duration ?? 1.0,
        ease: options.ease ?? EASE,
        stagger: options.stagger ?? 0,
        delay: options.delay ?? 0,
        scrollTrigger: {
          trigger: options.trigger || selector,
          start: options.start || START,
          toggleActions: "play none none none",
        },
      });
    }

    // 1. Section #quote
    const quoteCard = document.querySelector("#quote .card-section");
    if (quoteCard) {
      const quoteTl = gsap.timeline({
        scrollTrigger: { trigger: quoteCard, start: START, toggleActions: "play none none none" },
      });
      quoteTl
        .from(quoteCard, { opacity: 0, y: 30, filter: "blur(6px)", duration: 1.2, ease: EASE })
        .add(() => quoteCard.classList.add("is-visible"))
        .from(
          "#quote .card-section > *",
          { opacity: 0, y: 16, duration: 0.9, stagger: 0.12, ease: EASE },
          "-=0.9"
        );
    }

    // 2. Section #mempelai
    revealText("#mempelai h2", "#mempelai");
    fadeUp("#mempelai > .container > p", { trigger: "#mempelai", start: "top 82%" });

    // Foto & teks mempelai: drift halus dari arah berlawanan, tanpa terbang jauh
    const coupleTl = gsap.timeline({
      scrollTrigger: { trigger: ".mempelai-wanita", start: "top 82%", toggleActions: "play none none none" },
    });
    coupleTl
      .from(".mempelai-wanita .wayang-photo", {
        x: -40, opacity: 0, filter: "blur(6px)", duration: 1.3, ease: EASE,
      })
      .from(
        ".mempelai-wanita .col-7",
        { x: -20, opacity: 0, duration: 1.0, ease: EASE },
        "-=0.9"
      );

    const coupleTl2 = gsap.timeline({
      scrollTrigger: { trigger: ".mempelai-pria", start: "top 82%", toggleActions: "play none none none" },
    });
    coupleTl2
      .from(".mempelai-pria .wayang-photo", {
        x: 40, opacity: 0, filter: "blur(6px)", duration: 1.3, ease: EASE,
      })
      .from(
        ".mempelai-pria .col-7",
        { x: 20, opacity: 0, duration: 1.0, ease: EASE },
        "-=0.9"
      );

    // Simbol "&" — fade-in + scale-up halus, tidak berputar
    gsap.from("#mempelai .d-none.d-md-block span", {
      scale: 0.85, opacity: 0, duration: 1.4, ease: "expo.out",
      scrollTrigger: { trigger: "#mempelai .d-none.d-md-block span", start: "top 82%" },
    });

    // 3. Section #acara
    revealText("#acara h2", "#acara");
    fadeUp("#acara .lead", { trigger: "#acara", start: "top 80%" });
    gsap.from("#acara .card", {
      opacity: 0, y: 40, filter: "blur(6px)", duration: 1.3, ease: "expo.out",
      scrollTrigger: { trigger: "#acara .card", start: "top 85%" },
    });

    // 4. Section #countdown — timer-box muncul berurut, drift vertikal pendek
    revealText("#countdown h2", "#countdown");
    gsap.from(".timer-box", {
      opacity: 0, y: 30, filter: "blur(4px)", duration: 0.9,
      stagger: 0.12, // dari kiri ke kanan, lebih natural untuk countdown
      ease: EASE,
      scrollTrigger: { trigger: ".timer-box", start: "top 92%" },
    });

    // 5. Section #rsvp
    revealText("#rsvp h2", "#rsvp");
    fadeUp("#rsvp .lead", { trigger: "#rsvp", start: "top 80%" });
    fadeUp("#rsvp .btn-jawa", { trigger: "#rsvp .btn-jawa", start: "top 88%", y: 18 });
    fadeUp("#wish-wall", { trigger: "#wish-wall", start: "top 88%", y: 40 });

    // 6. Section #gift
    revealText("#gift h2", "#gift");
    fadeUp("#gift .lead", { trigger: "#gift", start: "top 80%" });
    gsap.from("#gift .gift-card", {
      opacity: 0, y: 30, filter: "blur(6px)", duration: 1.1, stagger: 0.18, ease: EASE,
      scrollTrigger: { trigger: "#gift .gift-card", start: "top 88%", toggleActions: "play none none none" },
    });

    // 7. Section #closing — heading reveal per kata (bukan flip 3D)
    revealText("#closing h2", "#closing h2");
    fadeUp("#closing .lead", { trigger: "#closing .lead", start: "top 92%" });
    fadeUp("#closing .mt-5", { trigger: "#closing .mt-5", start: "top 92%", y: 24 });
    // Garis pemisah: lebar dari 0 ke penuh, lebih elegan daripada scale dari 0
    gsap.from("#closing hr", {
      scaleX: 0, transformOrigin: "center", opacity: 0, duration: 1.4, ease: "expo.out",
      scrollTrigger: { trigger: "#closing hr", start: "top 92%" },
    });
    fadeUp("#closing .col-md-5", {
      trigger: "#closing .col-md-5", start: "top 95%", stagger: 0.2,
    });
  }
  // --- LOGIKA UNTUK SIMPAN KE KALENDER (VERSI DROPDOWN) ---
  const googleCalendarLink = document.getElementById('google-calendar-link');
  const icsDownloadLink = document.getElementById('ics-download-link');

  // --- Detail Acara (didefinisikan sekali) ---
  // CATATAN: WIB = UTC+7. Untuk konversi: <jam WIB> dikurangi 7 jam = UTC.
  const eventDetails = {
      name: "Pernikahan Bagus & Ayu",
      details: "Acara Akad Nikah & Walimatul Ursy Raden Bagus Pratama, S.T. & Ayu Permata Sari, S.E. Kehadiran Anda adalah kebahagiaan bagi kami.",
      location: "Pendopo Among Tani, Jl. Kaliurang KM 9, Sleman, Daerah Istimewa Yogyakarta",

      // Waktu dalam format untuk Google Calendar (UTC/Zulu Time)
      startUTC: '20261011T020000Z', // 09:00 WIB
      endUTC:   '20261011T070000Z', // 14:00 WIB

      // Waktu dalam format untuk file ICS (dengan Timezone)
      startTimezone: '20261011T090000',
      endTimezone:   '20261011T140000',
      timezone: 'Asia/Jakarta'
  };

  // 1. Logika untuk Google Calendar
  if (googleCalendarLink) {
    googleCalendarLink.addEventListener('click', function(event) {
      event.preventDefault();

      const googleUrl = new URL('https://www.google.com/calendar/render');
      googleUrl.searchParams.append('action', 'TEMPLATE');
      googleUrl.searchParams.append('text', eventDetails.name);
      googleUrl.searchParams.append('dates', `${eventDetails.startUTC}/${eventDetails.endUTC}`);
      googleUrl.searchParams.append('details', eventDetails.details);
      googleUrl.searchParams.append('location', eventDetails.location);

      window.open(googleUrl.toString(), '_blank');
    });
  }

  // 2. Logika untuk unduh file .ics
  if (icsDownloadLink) {
    icsDownloadLink.addEventListener('click', function(event) {
      event.preventDefault();

      const icsContent = [
        "BEGIN:VCALENDAR",
        "VERSION:2.0",
        "BEGIN:VEVENT",
        "SUMMARY:" + eventDetails.name,
        "DTSTART;TZID=" + eventDetails.timezone + ":" + eventDetails.startTimezone,
        "DTEND;TZID=" + eventDetails.timezone + ":" + eventDetails.endTimezone,
        "LOCATION:" + eventDetails.location,
        "DESCRIPTION:" + eventDetails.details,
        "END:VEVENT",
        "END:VCALENDAR"
      ].join("\r\n");

      const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = 'pernikahan-bagus-ayu.ics';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    });
  }
}); // --- AKHIR DARI DOMContentLoaded ---
