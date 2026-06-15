// ==========================================
// RentCar - BMW-Inspired Premium JavaScript
// ==========================================

document.addEventListener('DOMContentLoaded', () => {

  // ---- Navbar Scroll Effect ----
  const navbar = document.getElementById('navbar');

  function handleNavbarScroll() {
    if (window.scrollY > 100) {
      navbar.classList.add('navbar-scrolled');
    } else {
      navbar.classList.remove('navbar-scrolled');
    }
  }

  window.addEventListener('scroll', handleNavbarScroll);

  // ---- Mobile Menu Toggle ----
  const menuToggle = document.getElementById('menuToggle');
  const mobileMenu = document.getElementById('mobileMenu');
  let menuOpen = false;

  menuToggle.addEventListener('click', () => {
    menuOpen = !menuOpen;
    if (menuOpen) {
      mobileMenu.classList.remove('hidden');
      setTimeout(() => mobileMenu.classList.add('open'), 10);
      menuToggle.innerHTML = '<i class="fa-solid fa-xmark"></i>';
    } else {
      closeMobileMenu();
    }
  });

  function closeMobileMenu() {
    mobileMenu.classList.remove('open');
    setTimeout(() => mobileMenu.classList.add('hidden'), 300);
    menuToggle.innerHTML = '<i class="fa-solid fa-bars"></i>';
    menuOpen = false;
  }

  // Close mobile menu on link click
  document.querySelectorAll('.mobile-link').forEach(link => {
    link.addEventListener('click', closeMobileMenu);
  });

  // ---- Smooth Scroll for Anchor Links ----
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        const offset = 80;
        const top = target.getBoundingClientRect().top + window.pageYOffset - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  // ---- Counter Animation (Stats) ----
  const stats = [
    { el: document.getElementById('stat1'), target: 50, suffix: '' },
    { el: document.getElementById('stat2'), target: 2500, suffix: '' },
    { el: document.getElementById('stat3'), target: 6, suffix: '' },
  ];

  let statsAnimated = false;

  function animateCounters() {
    if (statsAnimated) return;
    statsAnimated = true;

    stats.forEach(({ el, target, suffix }) => {
      let current = 0;
      const increment = target / 60;
      const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
          current = target;
          clearInterval(timer);
        }
        el.textContent = Math.floor(current).toLocaleString('id-ID') + suffix;
      }, 25);
    });
  }

  // Trigger counter when hero section is visible
  const heroObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        setTimeout(animateCounters, 500);
      }
    });
  }, { threshold: 0.3 });

  if (document.getElementById('beranda')) {
    heroObserver.observe(document.getElementById('beranda'));
  }

  // ---- Car Filter ----
  const filterBtns = document.querySelectorAll('.filter-btn');
  const carCards = document.querySelectorAll('.car-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Update active button
      filterBtns.forEach(b => {
        b.classList.remove('active');
      });
      btn.classList.add('active');

      const filter = btn.dataset.filter;

      carCards.forEach(card => {
        if (filter === 'all' || card.dataset.category === filter) {
          card.classList.remove('hidden-card');
          card.classList.add('show-card');
          card.style.display = '';
        } else {
          card.classList.add('hidden-card');
          card.classList.remove('show-card');
          setTimeout(() => {
            if (card.classList.contains('hidden-card')) {
              card.style.display = 'none';
            }
          }, 500);
        }
      });
    });
  });

  // ---- FAQ Accordion ----
  const faqToggles = document.querySelectorAll('.faq-toggle');

  faqToggles.forEach(toggle => {
    toggle.addEventListener('click', () => {
      const item = toggle.parentElement;
      const content = toggle.nextElementSibling;
      const isActive = item.classList.contains('active');

      // Close all
      document.querySelectorAll('.faq-item').forEach(faq => {
        faq.classList.remove('active');
        faq.querySelector('.faq-content').classList.remove('show');
        faq.querySelector('.faq-content').classList.add('hidden');
        const icon = faq.querySelector('.faq-toggle i');
        icon.classList.remove('fa-minus');
        icon.classList.add('fa-plus');
      });

      // Open clicked if it wasn't active
      if (!isActive) {
        item.classList.add('active');
        content.classList.remove('hidden');
        content.classList.add('show');
        const icon = toggle.querySelector('i');
        icon.classList.remove('fa-plus');
        icon.classList.add('fa-minus');
      } else {
        item.classList.remove('active');
        content.classList.add('hidden');
        content.classList.remove('show');
        const icon = toggle.querySelector('i');
        icon.classList.add('fa-plus');
        icon.classList.remove('fa-minus');
      }
    });
  });

  // ---- Booking Form ----
  const bookingForm = document.getElementById('bookingForm');

  bookingForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const formData = new FormData(bookingForm);
    const lokasi = formData.get('lokasi');
    const tanggalSewa = formData.get('tanggalSewa');
    const tanggalKembali = formData.get('tanggalKembali');

    // Validation
    if (!lokasi || !tanggalSewa || !tanggalKembali) {
      Swal.fire({
        icon: 'warning',
        title: 'Data Belum Lengkap',
        text: 'Silakan lengkapi semua field pencarian terlebih dahulu.',
        confirmButtonColor: '#1c69d4',
        confirmButtonText: 'Oke',
        customClass: {
          popup: 'swal-dark',
          title: 'swal-title',
          content: 'swal-content',
        }
      });
      return;
    }

    // Check date logic
    const start = new Date(tanggalSewa);
    const end = new Date(tanggalKembali);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (start < today) {
      Swal.fire({
        icon: 'error',
        title: 'Tanggal Tidak Valid',
        text: 'Tanggal sewa tidak boleh kurang dari hari ini.',
        confirmButtonColor: '#1c69d4',
      });
      return;
    }

    if (end <= start) {
      Swal.fire({
        icon: 'error',
        title: 'Tanggal Tidak Valid',
        text: 'Tanggal kembali harus setelah tanggal sewa.',
        confirmButtonColor: '#1c69d4',
      });
      return;
    }

    const diffDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    const lokasiText = lokasi.charAt(0).toUpperCase() + lokasi.slice(1);

    Swal.fire({
      icon: 'success',
      title: 'Pencarian Berhasil!',
      html: `
        <div style="text-align: left; padding: 10px 0;">
          <p><strong>Lokasi:</strong> ${lokasiText}</p>
          <p><strong>Tanggal Sewa:</strong> ${formatDate(tanggalSewa)}</p>
          <p><strong>Tanggal Kembali:</strong> ${formatDate(tanggalKembali)}</p>
          <p><strong>Durasi:</strong> ${diffDays} hari</p>
        </div>
        <p style="color: rgba(255,255,255,0.4); font-size: 13px; margin-top: 10px;">Silakan pilih mobil dari koleksi kami di bawah.</p>
      `,
      confirmButtonColor: '#1c69d4',
      confirmButtonText: 'Lihat Armada',
    }).then((result) => {
      if (result.isConfirmed) {
        document.getElementById('armada').scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // ---- Back to Top Button ----
  const backToTop = document.getElementById('backToTop');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 500) {
      backToTop.classList.add('show');
    } else {
      backToTop.classList.remove('show');
    }
  });

  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // ---- Scroll Reveal Animation ----
  const revealElements = document.querySelectorAll(
    '#layanan .flex.gap-5, #testimoni .bg-bmw-gray'
  );

  revealElements.forEach(el => el.classList.add('reveal'));

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

  revealElements.forEach(el => revealObserver.observe(el));

  // ---- Set min date for booking inputs ----
  const today = new Date().toISOString().split('T')[0];
  const tanggalSewaInput = document.querySelector('input[name="tanggalSewa"]');
  const tanggalKembaliInput = document.querySelector('input[name="tanggalKembali"]');

  if (tanggalSewaInput) tanggalSewaInput.setAttribute('min', today);
  if (tanggalKembaliInput) tanggalKembaliInput.setAttribute('min', today);

  tanggalSewaInput.addEventListener('change', () => {
    tanggalKembaliInput.setAttribute('min', tanggalSewaInput.value);
    if (tanggalKembaliInput.value && tanggalKembaliInput.value <= tanggalSewaInput.value) {
      tanggalKembaliInput.value = '';
    }
  });

});

// ---- Sewa Mobil Function (Global) ----
function sewaMobil(namaMobil, harga) {
  Swal.fire({
    title: namaMobil,
    html: `
      <div style="text-align: left; margin-bottom: 15px;">
        <p style="color: rgba(255, 255, 255, 0.5); margin-bottom: 15px;">Harga: <strong style="color: #1c69d4; font-size: 1.2em;">${harga}</strong><span style="color: rgba(255, 255, 255, 0.3);">/hari</span></p>
      </div>
      <p style="color: rgba(255, 255, 255, 0.4); font-size: 13px;">Untuk melanjutkan pemesanan, silakan hubungi kami via WhatsApp atau telepon.</p>
    `,
    icon: 'info',
    showCancelButton: true,
    confirmButtonColor: '#25d366',
    cancelButtonColor: '#333333',
    confirmButtonText: 'Chat WhatsApp',
    cancelButtonText: 'Batal',
    reverseButtons: true,
    customClass: {
      popup: 'swal-dark',
      title: 'swal-title',
      content: 'swal-content',
    }
  }).then((result) => {
    if (result.isConfirmed) {
      const pesan = encodeURIComponent(
        `Halo RentCar! Saya tertarik untuk menyewa ${namaMobil} dengan harga ${harga}/hari. Mohon informasi lebih lanjut. Terima kasih!`
      );
      window.open(`https://wa.me/6281234567890?text=${pesan}`, '_blank');
    }
  });
}

// ---- Helper: Format Date ----
function formatDate(dateStr) {
  const months = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];
  const date = new Date(dateStr);
  return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
}
