// ─── Particle Background ───
const canvas = document.getElementById('particles-canvas');
const ctx = canvas.getContext('2d');
let particles = [];
let mouse = { x: null, y: null };

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);
window.addEventListener('mousemove', e => { mouse.x = e.x; mouse.y = e.y; });

class Particle {
  constructor() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.size = Math.random() * 2 + 0.5;
    this.speedX = (Math.random() - 0.5) * 0.5;
    this.speedY = (Math.random() - 0.5) * 0.5;
    this.opacity = Math.random() * 0.5 + 0.1;
  }
  update() {
    this.x += this.speedX;
    this.y += this.speedY;
    if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
    if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
  }
  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(59, 130, 246, ${this.opacity})`;
    ctx.fill();
  }
}

function initParticles() {
  particles = [];
  const count = Math.min(80, Math.floor((canvas.width * canvas.height) / 15000));
  for (let i = 0; i < count; i++) particles.push(new Particle());
}
initParticles();

function connectParticles() {
  for (let a = 0; a < particles.length; a++) {
    for (let b = a + 1; b < particles.length; b++) {
      const dx = particles[a].x - particles[b].x;
      const dy = particles[a].y - particles[b].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 120) {
        ctx.beginPath();
        ctx.strokeStyle = `rgba(99, 102, 241, ${0.08 * (1 - dist / 120)})`;
        ctx.lineWidth = 0.5;
        ctx.moveTo(particles[a].x, particles[a].y);
        ctx.lineTo(particles[b].x, particles[b].y);
        ctx.stroke();
      }
    }
  }
}

function animateParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach(p => { p.update(); p.draw(); });
  connectParticles();
  requestAnimationFrame(animateParticles);
}
animateParticles();

// ─── Navbar Scroll Effect ───
const navbar = document.querySelector('.navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 50);
});

// ─── Mobile Menu ───
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');
hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('active');
  navLinks.classList.toggle('open');
});
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('active');
    navLinks.classList.remove('open');
  });
});

// ─── Active Nav Link on Scroll ───
const sections = document.querySelectorAll('.section, .hero');
const navItems = document.querySelectorAll('.nav-links a');
window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(section => {
    const top = section.offsetTop - 150;
    if (scrollY >= top) current = section.getAttribute('id');
  });
  navItems.forEach(item => {
    item.classList.remove('active');
    if (item.getAttribute('href') === '#' + current) item.classList.add('active');
  });
});

// ─── Scroll Reveal ───
const revealElements = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('active');
    }
  });
}, { threshold: 0.1 });
revealElements.forEach(el => revealObserver.observe(el));

// ─── Animated Counter ───
function animateCounters() {
  document.querySelectorAll('[data-count]').forEach(el => {
    const target = parseInt(el.getAttribute('data-count'));
    const suffix = el.getAttribute('data-suffix') || '';
    let current = 0;
    const increment = target / 60;
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }
      el.textContent = Math.floor(current) + suffix;
    }, 25);
  });
}

const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCounters();
      statsObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

const statsSection = document.querySelector('.hero-stats');
if (statsSection) statsObserver.observe(statsSection);

// ─── Typing Effect for Code Block ───
function typeCode() {
  const codeLines = document.querySelectorAll('.code-line[data-text]');
  let delay = 0;
  codeLines.forEach((line, i) => {
    const text = line.getAttribute('data-text');
    line.innerHTML = '';
    const chars = text.split('');
    chars.forEach((char, j) => {
      setTimeout(() => {
        line.innerHTML += char;
        // Add cursor to last char of last line
        if (i === codeLines.length - 1 && j === chars.length - 1) {
          const cursor = document.createElement('span');
          cursor.className = 'typing-cursor';
          line.appendChild(cursor);
        }
      }, delay + j * 30);
    });
    delay += chars.length * 30 + 200;
  });
}

const codeObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      typeCode();
      codeObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });

const codeBlock = document.querySelector('.about-code-block');
if (codeBlock) codeObserver.observe(codeBlock);

// ─── Smooth Scroll for Anchor Links ───
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) target.scrollIntoView({ behavior: 'smooth' });
  });
});

// ─── EmailJS Setup ───
// Steps to enable real email delivery:
// 1. Go to https://www.emailjs.com and create a free account
// 2. Add an Email Service (e.g. Gmail) → note your SERVICE_ID
// 3. Create an Email Template using these variables:
//      {{from_name}}, {{from_email}}, {{subject}}, {{message}}
//    → note your TEMPLATE_ID
// 4. Go to Account → API Keys → copy your PUBLIC_KEY
// 5. Replace the three placeholders below:
const EMAILJS_SERVICE_ID = 'service_qi5jk2m';   // e.g. 'service_abc123'
const EMAILJS_TEMPLATE_ID = 'template_k9iiet8';  // e.g. 'template_xyz789'
const EMAILJS_PUBLIC_KEY = 's21_mlNeIaN77TMRs';   // e.g. 'abcDEF123456'

emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY });

// ─── Form Handling ───
const contactForm = document.getElementById('contact-form');
if (contactForm) {
  contactForm.addEventListener('submit', function (e) {
    e.preventDefault();
    const btn = this.querySelector('.btn-submit');
    const originalText = btn.textContent;

    // Disable button and show loading state
    btn.disabled = true;
    btn.textContent = '⏳ Sending…';
    btn.style.opacity = '0.8';

    const templateParams = {
      from_name: document.getElementById('form-name').value.trim(),
      from_email: document.getElementById('form-email').value.trim(),
      subject: document.getElementById('form-subject').value.trim() || 'Portfolio Contact',
      message: document.getElementById('form-message').value.trim(),
    };

    emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams)
      .then(() => {
        btn.textContent = '✓ Message Sent!';
        btn.style.background = 'linear-gradient(135deg, #22c55e, #16a34a)';
        btn.style.opacity = '1';
        this.reset();
        setTimeout(() => {
          btn.textContent = originalText;
          btn.style.background = '';
          btn.disabled = false;
        }, 4000);
      })
      .catch((err) => {
        console.error('EmailJS error:', err);
        btn.textContent = '❌ Failed — Try Again';
        btn.style.background = 'linear-gradient(135deg, #ef4444, #dc2626)';
        btn.style.opacity = '1';
        setTimeout(() => {
          btn.textContent = originalText;
          btn.style.background = '';
          btn.disabled = false;
        }, 4000);
      });
  });
}

// ─── Tilt Effect on Project Cards ───
document.querySelectorAll('.project-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = (y - centerY) / 20;
    const rotateY = (centerX - x) / 20;
    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});
