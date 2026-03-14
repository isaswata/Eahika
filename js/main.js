/* ===========================
   EAHIKA – Main JavaScript
=========================== */

document.addEventListener('DOMContentLoaded', () => {

  /* ── Navbar scroll effect ── */
  const navbar = document.querySelector('.navbar');
  if (navbar) {
    window.addEventListener('scroll', () => {
      navbar.classList.toggle('scrolled', window.scrollY > 30);
    });
  }

  /* ── Mobile nav toggle ── */
  const hamburger = document.querySelector('.hamburger');
  const navLinks  = document.querySelector('.nav-links');
  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      navLinks.classList.toggle('open');
      hamburger.classList.toggle('open');
      const s = hamburger.querySelectorAll('span');
      if (hamburger.classList.contains('open')) {
        s[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
        s[1].style.opacity   = '0';
        s[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
      } else {
        s.forEach(x => (x.style.transform = '', x.style.opacity = ''));
      }
    });
  }

  /* ── Active nav link ── */
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  /* ── Hero Slideshow ── */
  const slides   = document.querySelectorAll('.slide');
  const dots     = document.querySelectorAll('.slide-dot');
  const prevBtn  = document.querySelector('.slide-prev');
  const nextBtn  = document.querySelector('.slide-next');
  let current    = 0;
  let timer;

  function goSlide(n) {
    if (!slides.length) return;
    slides[current].classList.remove('active');
    dots[current]?.classList.remove('active');
    current = (n + slides.length) % slides.length;
    slides[current].classList.add('active');
    dots[current]?.classList.add('active');
  }

  function startTimer() { timer = setInterval(() => goSlide(current + 1), 5000); }
  function resetTimer()  { clearInterval(timer); startTimer(); }

  if (slides.length) {
    startTimer();
    prevBtn?.addEventListener('click', () => { goSlide(current - 1); resetTimer(); });
    nextBtn?.addEventListener('click', () => { goSlide(current + 1); resetTimer(); });
    dots.forEach((d, i) => d.addEventListener('click', () => { goSlide(i); resetTimer(); }));
  }

  /* ── Fade-up on scroll ── */
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        observer.unobserve(e.target);
      }
    });
  }, { threshold: 0.12 });

  document.querySelectorAll('.fade-up').forEach(el => observer.observe(el));

  /* ── Popups ── */
  document.querySelectorAll('[data-popup]').forEach(btn => {
    btn.addEventListener('click', () => {
      const overlay = document.getElementById(btn.dataset.popup);
      overlay?.classList.add('open');
      document.body.style.overflow = 'hidden';
    });
  });

  document.querySelectorAll('.popup-overlay').forEach(overlay => {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay || e.target.closest('.popup-close')) {
        overlay.classList.remove('open');
        document.body.style.overflow = '';
      }
    });
  });

  /* ── Tabs ── */
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const container = btn.closest('[data-tabs]') || btn.closest('.section') || document;
      const group = btn.dataset.group || 'default';
      container.querySelectorAll(`.tab-btn[data-group="${group}"]`).forEach(b => b.classList.remove('active'));
      container.querySelectorAll(`.tab-panel[data-group="${group}"]`).forEach(p => p.classList.remove('active'));
      btn.classList.add('active');
      const panel = container.querySelector(`#${btn.dataset.tab}`);
      panel?.classList.add('active');
    });
  });

  /* ── Chat widget ── */
  const chatBtn   = document.querySelector('.chat-btn');
  const chatPanel = document.querySelector('.chat-panel');
  const chatClose = document.querySelector('.chat-close');
  const chatInput = document.querySelector('.chat-input input');
  const chatSend  = document.querySelector('.chat-input button');
  const chatBody  = document.querySelector('.chat-body');

  const botReplies = [
    "Thank you for reaching out to Eahika! How can we help you today?",
    "For more information about our research programs, please visit our Research page.",
    "Our upcoming courses are now open for registration. Check the Learning section!",
    "We'd love to collaborate with you. Please fill out the contact form or email us directly.",
    "You can subscribe to our newsletter to stay updated on all Eahika events and publications.",
  ];

  if (chatBtn) {
    chatBtn.addEventListener('click', () => chatPanel?.classList.toggle('open'));
    chatClose?.addEventListener('click', () => chatPanel?.classList.remove('open'));

    function sendMessage() {
      const text = chatInput?.value.trim();
      if (!text) return;
      const userMsg = document.createElement('div');
      userMsg.className = 'chat-msg user';
      userMsg.textContent = text;
      chatBody?.appendChild(userMsg);
      chatInput.value = '';
      chatBody.scrollTop = chatBody.scrollHeight;

      setTimeout(() => {
        const botMsg = document.createElement('div');
        botMsg.className = 'chat-msg bot';
        botMsg.textContent = botReplies[Math.floor(Math.random() * botReplies.length)];
        chatBody?.appendChild(botMsg);
        chatBody.scrollTop = chatBody.scrollHeight;
      }, 1000);
    }

    chatSend?.addEventListener('click', sendMessage);
    chatInput?.addEventListener('keydown', e => e.key === 'Enter' && sendMessage());
  }

  /* ── Newsletter form ── */
  document.querySelectorAll('.newsletter-form').forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = form.querySelector('input[type="email"]');
      if (input?.value) {
        input.value = '';
        const btn = form.querySelector('button');
        const orig = btn.textContent;
        btn.textContent = '✓ Subscribed!';
        btn.style.background = '#2A7F78';
        setTimeout(() => { btn.textContent = orig; btn.style.background = ''; }, 3000);
      }
    });
  });

  /* ── Counter animation ── */
  function animateCounter(el) {
    const target = parseInt(el.dataset.target, 10);
    const dur    = 1800;
    const step   = 16;
    const inc    = target / (dur / step);
    let current  = 0;
    const timer  = setInterval(() => {
      current += inc;
      if (current >= target) { el.textContent = target; clearInterval(timer); }
      else el.textContent = Math.floor(current);
    }, step);
  }

  const counterObs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        animateCounter(e.target);
        counterObs.unobserve(e.target);
      }
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('[data-target]').forEach(el => counterObs.observe(el));

  /* ── Contact form ── */
  const contactForm = document.querySelector('.contact-form form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = contactForm.querySelector('button[type="submit"]');
      const orig = btn.textContent;
      btn.textContent = '✓ Message Sent!';
      btn.disabled = true;
      setTimeout(() => { btn.textContent = orig; btn.disabled = false; contactForm.reset(); }, 3500);
    });
  }

  /* ── Smooth scroll for anchor links ── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const id = anchor.getAttribute('href').slice(1);
      const target = document.getElementById(id);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

});
