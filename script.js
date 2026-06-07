// Scroll Progress Bar
window.addEventListener('scroll', () => {
    const scroll = window.scrollY;
    const height = document.body.scrollHeight - window.innerHeight;
    document.getElementById('scroll-progress').style.width = (scroll / height * 100) + '%';
});

// Custom Cursor
const cursor = document.createElement('div');
cursor.classList.add('custom-cursor');
const trail = document.createElement('div');
trail.classList.add('cursor-trail');
document.body.appendChild(cursor);
document.body.appendChild(trail);

let mx = 0, my = 0, tx = 0, ty = 0;
document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    cursor.style.left = mx - 6 + 'px';
    cursor.style.top = my - 6 + 'px';
});
function animateTrail() {
    tx += (mx - tx) * 0.12;
    ty += (my - ty) * 0.12;
    trail.style.left = tx - 16 + 'px';
    trail.style.top = ty - 16 + 'px';
    requestAnimationFrame(animateTrail);
}
animateTrail();

document.querySelectorAll('a, button').forEach(el => {
    el.addEventListener('mouseenter', () => cursor.style.transform = 'scale(2)');
    el.addEventListener('mouseleave', () => cursor.style.transform = 'scale(1)');
});

// Scroll Reveal
const reveals = document.querySelectorAll('section, .service-card, .quiz-card');
reveals.forEach(el => el.classList.add('reveal'));
const observer = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
}, { threshold: 0.1 });
reveals.forEach(el => observer.observe(el));

// Glitch Headings on scroll
const glitchHeadings = document.querySelectorAll('.glitch-heading');
const glitchObserver = new IntersectionObserver(entries => {
    entries.forEach(e => {
        if (e.isIntersecting) {
            e.target.classList.add('glitching');
            setTimeout(() => e.target.classList.remove('glitching'), 400);
        }
    });
}, { threshold: 0.5 });
glitchHeadings.forEach(el => glitchObserver.observe(el));

// Micro-interactions
document.querySelectorAll('button, a').forEach(el => {
    el.addEventListener('mousedown', () => { el.style.transform = 'scale(0.97)'; });
    el.addEventListener('mouseup', () => { el.style.transform = ''; });
    el.addEventListener('mouseleave', () => { el.style.transform = ''; });
});

// Quiz Logic
function nextStep(current) {
    const next = current + 1;
    const currentEl = document.getElementById('q' + current);
    const nextEl = document.getElementById(next === 4 ? 'results' : 'q' + next);
    const progress = document.getElementById('quiz-progress');
    progress.style.width = (current / 3 * 100) + '%';
    currentEl.classList.add('hidden');
    nextEl.classList.remove('hidden');
    nextEl.classList.add('fade-in');
}

// Video System
document.addEventListener('DOMContentLoaded', () => {
    const video = document.getElementById('hero-video');
    if (!video) return;
    video.removeAttribute('loop');

    let rafId = null, fadingOut = false;

    function fade(to, duration, cb) {
        if (rafId) cancelAnimationFrame(rafId);
        const from = parseFloat(video.style.opacity) || 0;
        const start = performance.now();
        function step(now) {
            const p = Math.min((now - start) / duration, 1);
            video.style.opacity = from + (to - from) * p;
            if (p < 1) { rafId = requestAnimationFrame(step); }
            else { rafId = null; if (cb) cb(); }
        }
        rafId = requestAnimationFrame(step);
    }

    function restart() {
        fadingOut = false;
        video.currentTime = 0;
        video.play().catch(() => { });
        fade(1, 500);
    }

    video.addEventListener('timeupdate', () => {
        if (video.duration && (video.duration - video.currentTime <= 0.6) && !fadingOut) {
            fadingOut = true;
            fade(0, 500);
        }
    });

    video.addEventListener('ended', () => setTimeout(restart, 100));
    video.addEventListener('stalled', () => { video.load(); restart(); });
    video.addEventListener('pause', () => { if (!document.hidden) video.play().catch(() => { }); });

    video.style.opacity = '0';
    video.play().then(() => fade(1, 500)).catch(() => fade(1, 500));
});