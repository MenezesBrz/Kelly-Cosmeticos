// ===== PRELOADER =====
window.addEventListener('load', () => {
  const preloader = document.getElementById('preloader');
  setTimeout(() => {
    preloader.classList.add('loaded');
  }, 800);
});

// ===== HEADER SCROLL EFFECT =====
const header = document.getElementById('header');
let lastScroll = 0;

window.addEventListener('scroll', () => {
  const currentScroll = window.pageYOffset;
  
  if (currentScroll > 60) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }
  
  lastScroll = currentScroll;
});

// ===== MOBILE NAVIGATION =====
const mobileToggle = document.getElementById('mobileToggle');
const navLinks = document.getElementById('navLinks');
const navOverlay = document.getElementById('navOverlay');

function toggleNav() {
  mobileToggle.classList.toggle('active');
  navLinks.classList.toggle('open');
  navOverlay.classList.toggle('open');
  document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
}

mobileToggle.addEventListener('click', toggleNav);
navOverlay.addEventListener('click', toggleNav);

// Close nav on link click
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    if (navLinks.classList.contains('open')) {
      toggleNav();
    }
  });
});

// ===== SMOOTH SCROLL =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      const headerOffset = 80;
      const elementPosition = target.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  });
});

// ===== ANIMATED COUNTER =====
function animateCounters() {
  const counters = document.querySelectorAll('.stat-number[data-count]');
  
  counters.forEach(counter => {
    if (counter.dataset.animated) return;
    
    const rect = counter.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      counter.dataset.animated = 'true';
      const target = parseInt(counter.dataset.count);
      const duration = 2000;
      const step = target / (duration / 16);
      let current = 0;
      
      const updateCounter = () => {
        current += step;
        if (current < target) {
          counter.textContent = Math.floor(current).toLocaleString('pt-BR');
          requestAnimationFrame(updateCounter);
        } else {
          counter.textContent = target.toLocaleString('pt-BR');
          if (counter.closest('.stat-item').querySelector('.stat-label').textContent.includes('%')) {
            counter.textContent = target + '%';
          } else if (target >= 1000) {
            counter.textContent = target.toLocaleString('pt-BR') + '+';
          } else {
            counter.textContent = target + '+';
          }
        }
      };
      
      requestAnimationFrame(updateCounter);
    }
  });
}

window.addEventListener('scroll', animateCounters);
window.addEventListener('load', animateCounters);

// ===== SCROLL REVEAL ANIMATIONS =====
function revealOnScroll() {
  const reveals = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .stagger');
  
  reveals.forEach(element => {
    const rect = element.getBoundingClientRect();
    const windowHeight = window.innerHeight;
    const revealPoint = 120;
    
    if (rect.top < windowHeight - revealPoint) {
      element.classList.add('visible');
    }
  });
}

window.addEventListener('scroll', revealOnScroll);
window.addEventListener('load', () => {
  setTimeout(revealOnScroll, 300);
});

// ===== TESTIMONIALS SLIDER =====
const testimonials = document.querySelectorAll('.testimonial-card');
const dots = document.querySelectorAll('.testimonial-dot');
let currentTestimonial = 0;
let testimonialInterval;

function showTestimonial(index) {
  testimonials.forEach(t => t.classList.remove('active'));
  dots.forEach(d => d.classList.remove('active'));
  
  currentTestimonial = index;
  testimonials[currentTestimonial].classList.add('active');
  dots[currentTestimonial].classList.add('active');
}

function nextTestimonial() {
  const next = (currentTestimonial + 1) % testimonials.length;
  showTestimonial(next);
}

function startAutoplay() {
  testimonialInterval = setInterval(nextTestimonial, 5000);
}

function stopAutoplay() {
  clearInterval(testimonialInterval);
}

dots.forEach(dot => {
  dot.addEventListener('click', () => {
    stopAutoplay();
    showTestimonial(parseInt(dot.dataset.index));
    startAutoplay();
  });
});

// Touch/swipe support for testimonials
let touchStartX = 0;
let touchEndX = 0;
const slider = document.querySelector('.testimonials-slider');

if (slider) {
  slider.addEventListener('touchstart', e => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });

  slider.addEventListener('touchend', e => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
  }, { passive: true });
}

function handleSwipe() {
  const diff = touchStartX - touchEndX;
  if (Math.abs(diff) > 50) {
    stopAutoplay();
    if (diff > 0) {
      nextTestimonial();
    } else {
      const prev = (currentTestimonial - 1 + testimonials.length) % testimonials.length;
      showTestimonial(prev);
    }
    startAutoplay();
  }
}

startAutoplay();

// ===== WHATSAPP FLOAT VISIBILITY =====
const whatsappFloat = document.getElementById('whatsapp-float');

function toggleWhatsappFloat() {
  if (window.pageYOffset > 400) {
    whatsappFloat.style.opacity = '1';
    whatsappFloat.style.transform = 'scale(1)';
  } else {
    whatsappFloat.style.opacity = '0';
    whatsappFloat.style.transform = 'scale(0.5)';
  }
}

whatsappFloat.style.transition = 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
whatsappFloat.style.opacity = '0';
whatsappFloat.style.transform = 'scale(0.5)';

window.addEventListener('scroll', toggleWhatsappFloat);

// ===== PARALLAX EFFECT ON HERO =====
window.addEventListener('scroll', () => {
  const scrolled = window.pageYOffset;
  const heroImage = document.querySelector('.hero-image');
  if (heroImage && scrolled < window.innerHeight) {
    heroImage.style.transform = `translateY(${scrolled * 0.1}px)`;
  }
});

// ===== PRODUCT CARD HOVER TILT (Desktop Only) =====
if (window.matchMedia('(min-width: 769px)').matches) {
  document.querySelectorAll('.product-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = (y - centerY) / 20;
      const rotateY = (centerX - x) / 20;
      
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px)`;
    });
    
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
    });
  });
}
