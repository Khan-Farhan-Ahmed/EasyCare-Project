import hospitals from "../info/info.js"

let nav = document.getElementById('navbar');

gsap.registerPlugin(ScrollTrigger);

// ---- ENTRANCE ANIMATIONS ----
var tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

tl.from(nav, {
    y: -80,
    duration: 0.8,
    opacity: 0,
});

tl.from('.hero-badge', {
    y: 20,
    opacity: 0,
    duration: 0.6,
}, '-=0.3');

tl.from('.left-hero h1', {
    y: 40,
    opacity: 0,
    duration: 0.8,
}, '-=0.3');

tl.from('.left-hero > p', {
    y: 30,
    opacity: 0,
    duration: 0.7,
}, '-=0.5');

tl.from('.hero-stats-row', {
    y: 20,
    opacity: 0,
    duration: 0.6,
}, '-=0.4');

tl.from('.hero-btns', {
    y: 20,
    opacity: 0,
    duration: 0.6,
}, '-=0.3');

tl.from('.right-hero', {
    x: 80,
    opacity: 0,
    duration: 1,
}, '-=1.2');

tl.from('.card-float-1', {
    x: -30,
    opacity: 0,
    duration: 0.6,
}, '-=0.4');

tl.from('.card-float-2', {
    x: 30,
    opacity: 0,
    duration: 0.6,
}, '-=0.5');


// ---- FLOATING ANIMATION on hero cards ----
gsap.to('.card-float-1', {
    y: -10,
    duration: 2.2,
    ease: 'sine.inOut',
    yoyo: true,
    repeat: -1,
});

gsap.to('.card-float-2', {
    y: 10,
    duration: 2.8,
    ease: 'sine.inOut',
    yoyo: true,
    repeat: -1,
    delay: 0.5,
});


// ---- SCROLL ANIMATIONS (Section 2) ----
gsap.from('.section-2 .section-header', {
    scrollTrigger: {
        trigger: '.section-2',
        start: 'top 80%',
    },
    y: 40,
    opacity: 0,
    duration: 0.7,
    ease: 'power2.out',
});

gsap.from('.section-2 .card', {
    scrollTrigger: {
        trigger: '.section-2 .cards',
        start: 'top 85%',
    },
    y: 50,
    opacity: 0,
    duration: 0.7,
    stagger: 0.15,
    ease: 'power2.out',
});


// ---- SCROLL ANIMATIONS (Section 3) ----
gsap.from('.left-section-3', {
    scrollTrigger: {
        trigger: '.section-3',
        start: 'top 80%',
    },
    x: -60,
    opacity: 0,
    duration: 0.9,
    ease: 'power2.out',
});

gsap.from('.right-section-3', {
    scrollTrigger: {
        trigger: '.section-3',
        start: 'top 80%',
    },
    x: 60,
    opacity: 0,
    duration: 0.9,
    ease: 'power2.out',
    delay: 0.15,
});

gsap.from('.right-section-3 ul li', {
    scrollTrigger: {
        trigger: '.right-section-3 ul',
        start: 'top 85%',
    },
    x: 20,
    opacity: 0,
    stagger: 0.12,
    duration: 0.5,
    ease: 'power2.out',
});


// ---- SCROLL ANIMATIONS (Section 4 header) ----
gsap.from('.section-4-header', {
    scrollTrigger: {
        trigger: '.section-4',
        start: 'top 85%',
    },
    y: 30,
    opacity: 0,
    duration: 0.7,
    ease: 'power2.out',
});


// ---- FOOTER ANIMATION ----
gsap.from('footer .footer-container > div', {
    scrollTrigger: {
        trigger: 'footer',
        start: 'top 90%',
    },
    y: 30,
    opacity: 0,
    stagger: 0.1,
    duration: 0.6,
    ease: 'power2.out',
});


window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
        nav.style.boxShadow = '0 4px 30px rgba(15,39,68,0.12)';
    } else {
        nav.style.boxShadow = '0 2px 20px rgba(15,39,68,0.06)';
    }
});

const goListPage = () => {
    window.location.href = "../HospitallistPage/list-page/index.html";
}

function render() {
  const allData = JSON.parse(localStorage.getItem("allHospitalData")) || {};
  let normal = 0;
  let busy = 0;
  let critical = 0;
  hospitals.forEach(h => {
    const status = allData[h.name]?.status || h.status;
    if (status === "Normal") normal++;
    else if (status === "Busy") busy++;
    else if (status === "Critical") critical++;
  });
  document.getElementById("totalCount").textContent = hospitals.length;
  document.getElementById("heroTotalCount").textContent = hospitals.length;
  document.getElementById("normalCount").textContent = normal;
  document.getElementById("heroNormalCount").textContent = normal;
  document.getElementById("busyCount").textContent = busy;
  document.getElementById("heroBusyCount").textContent = busy;
  document.getElementById("criticalCount").textContent = critical;
  document.getElementById("heroCriticalCount").textContent = critical;
}
render();