// ═══════════════════════════════════════════════════════════════
// THEME SWITCHER
// ═══════════════════════════════════════════════════════════════

const themeToggle = document.getElementById('theme-toggle');
const html = document.documentElement;

// Check for saved theme preference or default to light mode
const currentTheme = localStorage.getItem('theme') || 'light';
html.setAttribute('data-theme', currentTheme);

themeToggle.addEventListener('click', () => {
  const theme = html.getAttribute('data-theme');
  const newTheme = theme === 'light' ? 'dark' : 'light';
  
  html.setAttribute('data-theme', newTheme);
  localStorage.setItem('theme', newTheme);
  
  // Reinitialize neural network with new theme
  initNeuralNetwork();
});

// ═══════════════════════════════════════════════════════════════
// NEURAL NETWORK CANVAS BACKGROUND
// ═══════════════════════════════════════════════════════════════

const canvas = document.getElementById('neural-canvas');
const ctx = canvas.getContext('2d');
let nodes = [];
let connections = [];
let animationId;

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

resizeCanvas();
window.addEventListener('resize', () => {
  resizeCanvas();
  initNeuralNetwork();
});

class Node {
  constructor(x, y, layer) {
    this.x = x;
    this.y = y;
    this.layer = layer;
    this.radius = 4;
    this.targetRadius = 4;
    this.pulse = Math.random() * Math.PI * 2;
  }

  update() {
    this.pulse += 0.02;
    this.targetRadius = 4 + Math.sin(this.pulse) * 2;
    this.radius += (this.targetRadius - this.radius) * 0.1;
  }

  draw() {
    const theme = html.getAttribute('data-theme');
    const nodeColor = theme === 'dark' 
      ? 'rgba(59, 130, 246, 0.8)' 
      : 'rgba(37, 99, 235, 0.8)';
    
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = nodeColor;
    ctx.fill();
    
    // Glow effect
    const gradient = ctx.createRadialGradient(
      this.x, this.y, 0,
      this.x, this.y, this.radius * 3
    );
    gradient.addColorStop(0, theme === 'dark' 
      ? 'rgba(59, 130, 246, 0.3)' 
      : 'rgba(37, 99, 235, 0.2)');
    gradient.addColorStop(1, 'transparent');
    
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius * 3, 0, Math.PI * 2);
    ctx.fillStyle = gradient;
    ctx.fill();
  }
}

class Connection {
  constructor(fromNode, toNode) {
    this.from = fromNode;
    this.to = toNode;
    this.weight = Math.random();
    this.pulse = 0;
  }

  update() {
    this.pulse += 0.02;
    if (this.pulse > 1) this.pulse = 0;
  }

  draw() {
    const theme = html.getAttribute('data-theme');
    const opacity = 0.1 + Math.sin(this.pulse * Math.PI) * 0.05;
    
    ctx.beginPath();
    ctx.moveTo(this.from.x, this.from.y);
    ctx.lineTo(this.to.x, this.to.y);
    ctx.strokeStyle = theme === 'dark'
      ? `rgba(59, 130, 246, ${opacity})`
      : `rgba(37, 99, 235, ${opacity})`;
    ctx.lineWidth = 1;
    ctx.stroke();

    // Animated data flow
    const dx = this.to.x - this.from.x;
    const dy = this.to.y - this.from.y;
    const dotX = this.from.x + dx * this.pulse;
    const dotY = this.from.y + dy * this.pulse;
    
    ctx.beginPath();
    ctx.arc(dotX, dotY, 2, 0, Math.PI * 2);
    ctx.fillStyle = theme === 'dark'
      ? `rgba(139, 92, 246, ${0.5 + Math.sin(this.pulse * Math.PI) * 0.3})`
      : `rgba(124, 58, 237, ${0.5 + Math.sin(this.pulse * Math.PI) * 0.3})`;
    ctx.fill();
  }
}

function initNeuralNetwork() {
  nodes = [];
  connections = [];
  
  // Create layers
  const layers = [8, 12, 16, 12, 8]; // Neural network structure
  const layerSpacing = canvas.width / (layers.length + 1);
  
  layers.forEach((nodeCount, layerIndex) => {
    const nodeSpacing = canvas.height / (nodeCount + 1);
    for (let i = 0; i < nodeCount; i++) {
      const x = layerSpacing * (layerIndex + 1);
      const y = nodeSpacing * (i + 1);
      nodes.push(new Node(x, y, layerIndex));
    }
  });

  // Create connections between adjacent layers
  let nodeIndex = 0;
  for (let layerIndex = 0; layerIndex < layers.length - 1; layerIndex++) {
    const currentLayerSize = layers[layerIndex];
    const nextLayerSize = layers[layerIndex + 1];
    
    for (let i = 0; i < currentLayerSize; i++) {
      for (let j = 0; j < nextLayerSize; j++) {
        const fromNode = nodes[nodeIndex + i];
        const toNode = nodes[nodeIndex + currentLayerSize + j];
        if (Math.random() > 0.3) { // Not all connections
          connections.push(new Connection(fromNode, toNode));
        }
      }
    }
    nodeIndex += currentLayerSize;
  }
}

function animateNeuralNetwork() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  // Update and draw connections
  connections.forEach(connection => {
    connection.update();
    connection.draw();
  });
  
  // Update and draw nodes
  nodes.forEach(node => {
    node.update();
    node.draw();
  });
  
  animationId = requestAnimationFrame(animateNeuralNetwork);
}

initNeuralNetwork();
animateNeuralNetwork();

// ═══════════════════════════════════════════════════════════════
// NAVIGATION
// ═══════════════════════════════════════════════════════════════

const navbar = document.querySelector('.navbar');
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('nav-links');
const navItems = document.querySelectorAll('.nav-links a');

// Scroll effect
window.addEventListener('scroll', () => {
  if (window.scrollY > 50) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }

  // Active section highlighting
  const sections = document.querySelectorAll('.section, .hero');
  let current = '';
  
  sections.forEach(section => {
    const sectionTop = section.offsetTop - 150;
    if (window.scrollY >= sectionTop) {
      current = section.getAttribute('id');
    }
  });

  navItems.forEach(item => {
    item.classList.remove('active');
    if (item.getAttribute('href') === `#${current}`) {
      item.classList.add('active');
    }
  });
});

// Mobile menu
hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('active');
  navLinks.classList.toggle('open');
});

navItems.forEach(item => {
  item.addEventListener('click', () => {
    hamburger.classList.remove('active');
    navLinks.classList.remove('open');
  });
});

// ═══════════════════════════════════════════════════════════════
// TYPING EFFECT
// ═══════════════════════════════════════════════════════════════

const typingText = document.querySelector('.typing-text');
if (typingText) {
  const text = typingText.textContent;
  typingText.textContent = '';
  let index = 0;

  function type() {
    if (index < text.length) {
      typingText.textContent += text.charAt(index);
      index++;
      setTimeout(type, 50);
    }
  }

  setTimeout(type, 500);
}

// ═══════════════════════════════════════════════════════════════
// TERMINAL COMMAND TYPING
// ═══════════════════════════════════════════════════════════════

const commandElement = document.querySelector('.command');
if (commandElement) {
  const commandText = commandElement.getAttribute('data-text');
  commandElement.textContent = '';
  let cmdIndex = 0;

  function typeCommand() {
    if (cmdIndex < commandText.length) {
      commandElement.textContent += commandText.charAt(cmdIndex);
      cmdIndex++;
      setTimeout(typeCommand, 30);
    } else {
      // Show output after command completes
      setTimeout(() => {
        document.querySelector('.terminal-output').style.display = 'block';
      }, 300);
    }
  }

  setTimeout(typeCommand, 1500);
}

// ═══════════════════════════════════════════════════════════════
// ANIMATED COUNTER
// ═══════════════════════════════════════════════════════════════

function animateCounter(element) {
  const target = parseInt(element.getAttribute('data-count'));
  let current = 0;
  const increment = target / 60;
  const timer = setInterval(() => {
    current += increment;
    if (current >= target) {
      element.textContent = target + '+';
      clearInterval(timer);
    } else {
      element.textContent = Math.floor(current) + '+';
    }
  }, 30);
}

// Intersection Observer for counters
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const counters = entry.target.querySelectorAll('[data-count]');
      counters.forEach(counter => animateCounter(counter));
      counterObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

const heroStats = document.querySelector('.hero-stats');
if (heroStats) {
  counterObserver.observe(heroStats);
}

// ═══════════════════════════════════════════════════════════════
// 3D TILT EFFECT
// ═══════════════════════════════════════════════════════════════

const tiltElements = document.querySelectorAll('[data-tilt]');

tiltElements.forEach(element => {
  element.addEventListener('mousemove', (e) => {
    const rect = element.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateX = (y - centerY) / 20;
    const rotateY = (centerX - x) / 20;
    
    element.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05)`;
  });
  
  element.addEventListener('mouseleave', () => {
    element.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
  });
});

// ═══════════════════════════════════════════════════════════════
// SKILL PROGRESS BARS
// ═══════════════════════════════════════════════════════════════

const skillObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const progressBar = entry.target.querySelector('.progress-bar');
      const progress = progressBar.getAttribute('data-progress');
      setTimeout(() => {
        progressBar.style.width = progress + '%';
      }, 200);
      skillObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });

document.querySelectorAll('.skill-card').forEach(card => {
  skillObserver.observe(card);
});

// ═══════════════════════════════════════════════════════════════
// SCROLL REVEAL ANIMATIONS
// ═══════════════════════════════════════════════════════════════

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, index) => {
    if (entry.isIntersecting) {
      setTimeout(() => {
        entry.target.classList.add('fade-in');
      }, index * 100);
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

// Observe all cards
document.querySelectorAll('.bento-card, .skill-card, .project-card').forEach(element => {
  revealObserver.observe(element);
});

// ═══════════════════════════════════════════════════════════════
// SMOOTH SCROLLING
// ═══════════════════════════════════════════════════════════════

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const targetId = this.getAttribute('href');
    const target = document.querySelector(targetId);
    
    if (target) {
      const navbarHeight = 70;
      const elementPosition = target.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - navbarHeight;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  });
});

// ═══════════════════════════════════════════════════════════════
// EMAILJS CONTACT FORM
// ═══════════════════════════════════════════════════════════════

const EMAILJS_SERVICE_ID = 'service_qi5jk2m';
const EMAILJS_TEMPLATE_ID = 'template_k9iiet8';
const EMAILJS_PUBLIC_KEY = 's21_mlNeIaN77TMRs';

emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY });

const contactForm = document.getElementById('contact-form');
if (contactForm) {
  contactForm.addEventListener('submit', function (e) {
    e.preventDefault();
    const btn = this.querySelector('.btn-submit');
    const originalText = btn.innerHTML;

    // Disable button and show loading
    btn.disabled = true;
    btn.innerHTML = '<span>Sending...</span>';
    btn.style.opacity = '0.7';

    const templateParams = {
      from_name: document.getElementById('form-name').value.trim(),
      from_email: document.getElementById('form-email').value.trim(),
      subject: document.getElementById('form-subject').value.trim() || 'Portfolio Contact',
      message: document.getElementById('form-message').value.trim(),
    };

    emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams)
      .then(() => {
        btn.innerHTML = '<span>Message Sent! ✓</span>';
        btn.style.opacity = '1';
        this.reset();
        setTimeout(() => {
          btn.innerHTML = originalText;
          btn.disabled = false;
        }, 4000);
      })
      .catch((err) => {
        console.error('EmailJS error:', err);
        btn.innerHTML = '<span>Failed. Try Again ✗</span>';
        btn.style.opacity = '1';
        setTimeout(() => {
          btn.innerHTML = originalText;
          btn.disabled = false;
        }, 4000);
      });
  });
}

// ═══════════════════════════════════════════════════════════════
// PARALLAX EFFECT ON SCROLL
// ═══════════════════════════════════════════════════════════════

window.addEventListener('scroll', () => {
  const scrolled = window.pageYOffset;
  const terminal = document.querySelector('.terminal-3d');
  
  if (terminal) {
    terminal.style.transform = `rotateY(-5deg) rotateX(5deg) translateY(${scrolled * 0.1}px)`;
  }
});

// ═══════════════════════════════════════════════════════════════
// CURSOR TRAIL EFFECT (OPTIONAL - ADDS EXTRA CREATIVITY)
// ═══════════════════════════════════════════════════════════════

const coords = { x: 0, y: 0 };
const circles = document.querySelectorAll(".circle");

if (circles.length === 0) {
  // Create cursor trail circles
  for (let i = 0; i < 20; i++) {
    const circle = document.createElement('div');
    circle.className = 'circle';
    circle.style.cssText = `
      position: fixed;
      width: 8px;
      height: 8px;
      border-radius: 50%;
      pointer-events: none;
      z-index: 99999;
      mix-blend-mode: difference;
      background: white;
    `;
    document.body.appendChild(circle);
  }
}

const circleElements = document.querySelectorAll(".circle");

circleElements.forEach(function (circle) {
  circle.x = 0;
  circle.y = 0;
});

window.addEventListener("mousemove", function(e){
  coords.x = e.clientX;
  coords.y = e.clientY;
});

function animateCircles() {
  let x = coords.x;
  let y = coords.y;
  
  circleElements.forEach(function (circle, index) {
    circle.style.left = x - 4 + "px";
    circle.style.top = y - 4 + "px";
    
    circle.style.transform = `scale(${(circleElements.length - index) / circleElements.length})`;
    
    circle.x = x;
    circle.y = y;

    const nextCircle = circleElements[index + 1] || circleElements[0];
    x += (nextCircle.x - x) * 0.3;
    y += (nextCircle.y - y) * 0.3;
  });
 
  requestAnimationFrame(animateCircles);
}

animateCircles();

// ═══════════════════════════════════════════════════════════════
// CONSOLE MESSAGE (EASTER EGG FOR DEVELOPERS)
// ═══════════════════════════════════════════════════════════════

console.log('%c👋 Hey Developer!', 'font-size: 20px; font-weight: bold; color: #2563EB;');
console.log('%cLike what you see? Let\'s build something amazing together!', 'font-size: 14px; color: #7C3AED;');
console.log('%c📧 Email: sjworkmail07@gmail.com', 'font-size: 12px; color: #10B981;');
console.log('%c💼 LinkedIn: linkedin.com/in/savan-jobanputra', 'font-size: 12px; color: #10B981;');
