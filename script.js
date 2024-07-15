'use strict';


// Elements

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');
const nav = document.querySelector('.nav');
const navLink = document.querySelector('.nav__link');
const navLinks = document.querySelector('.nav__links');
const tabs = document.querySelectorAll('.operations__tab');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');

//--------------------------------------------------------------------------------------------------------------------------------------

// Modal window
const openModal = function (event) {
  event.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

//--------------------------------------------------------------------------------------------------------------------------------------

btnScrollTo.addEventListener('click', () => {
  // There are 2 methods for implementing scrolling

  // Method - 1 (old method)
  // const s1coords = section1.getBoundingClientRect();
  // console.log(s1coords);

  // console.log(`Total length of the page that is scrolled:-\nX/left: ${window.pageXOffset}\nY/top: ${window.pageYOffset}`);

  // window.scrollTo({
  //   top: window.pageYOffset + s1coords.top,
  //   behavior: 'smooth'
  // });


  // Method - 2 (Latest Method)
  section1.scrollIntoView({behavior: 'smooth'});
});

//--------------------------------------------------------------------------------------------------------------------------------------

// Page navigation

// Scrolling without event propagation (not useful with large set of elements)
// document.querySelectorAll('.nav__link').forEach(
// function(ele) {
//   console.log(ele);
//     ele.addEventListener('click', function(event) {
//       event.preventDefault();

//       const id = this.getAttribute('href');
//       console.log(id);
//       document.querySelector(id).scrollIntoView({behavior: 'smooth'});
//     });
// });


// Implementing scrolling using event propagation
// 1. Add event listener to common parent element
// 2. Determine what element originated the event
navLinks.addEventListener('click', function(e) {
  e.preventDefault();
  // console.log(e.target);
  
  if(e.target.classList.contains('nav__link')) {
    const id = e.target.getAttribute('href');
    // console.log(id);
    document.querySelector(id).scrollIntoView({behavior: 'smooth'});
  }
});

//--------------------------------------------------------------------------------------------------------------------------------------

// Tabbed components
tabsContainer.addEventListener('click', (event) => {
  const clicked = event.target.closest('.operations__tab');

  console.log(clicked);

  if(!clicked) return;

  // Removing active classes
  tabs.forEach(ele => ele.classList.remove('operations__tab--active'));

  tabsContent.forEach(ele => ele.classList.remove('operations__content--active'));

  // Activate tab
  clicked.classList.add('operations__tab--active');

  // Activate content area
  document.querySelector(`.operations__content--${clicked.dataset.tab}`).classList.add('operations__content--active');
});

//--------------------------------------------------------------------------------------------------------------------------------------

// Menu fade animation
const handleHover = function(event) {
  // console.log(this);

  if(event.target.classList.contains('nav__link')) {
    const target = event.target;

    const siblings = target.closest('.nav__links').querySelectorAll('.nav__link');

    // console.log(siblings);

    siblings.forEach(ele => {
      if(ele !== target) ele.style.opacity = this;
    });
  }
}

// Method - 1
// nav.addEventListener('mouseover', function(e) {
//   handleHover(e, 0.5);
// });

// Method - 2
nav.addEventListener('mouseover', handleHover.bind(0.5));

nav.addEventListener('mouseout', handleHover.bind(1));

//--------------------------------------------------------------------------------------------------------------------------------------

// Sticky navigation (2 Methods)

// Method - 1 (not efficient)
// const initialCoords = section1.getBoundingClientRect();
// console.log(initialCoords);

// window.addEventListener('scroll', function () {
//   console.log(window.scrollY);

//   if (window.scrollY > initialCoords.top) nav.classList.add('sticky');
//   else nav.classList.remove('sticky');
// });

// Method - 2 (efficient)
const header = document.querySelector('.header');
const navHeight = nav.getBoundingClientRect().height;

const stickyNav = function (entries) {
  const [entry] = entries;
  // Same as entry = entries[0]
  // console.log(entry);

  if (!entry.isIntersecting) nav.classList.add('sticky');
  else nav.classList.remove('sticky');
};

const headerObserver = new IntersectionObserver(stickyNav, {
  root: null,
  threshold: 0,
  rootMargin: `-${navHeight}px`,
});

headerObserver.observe(header);

//--------------------------------------------------------------------------------------------------------------------------------------

// Reveal sections

const sections = document.querySelectorAll('.section');

const revealSection = function(entries, observer) {
  const [entry] = entries;
  // console.log(entry);

  if(!entry.isIntersecting) return;

  entry.target.classList.remove('section--hidden');
  observer.unobserve(entry.target);
}

const sectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.15
});

sections.forEach(section => {
  sectionObserver.observe(section);
  section.classList.add('section--hidden');
});

//--------------------------------------------------------------------------------------------------------------------------------------

// Lazy Loading Images

const imgTargets = document.querySelectorAll('img[data-src]');

const loadImg = function(entries, observer) {
  const [entry] = entries;
  // console.log(entry);

  if(!entry.isIntersecting) return;

  // Replace src with data-src
  entry.target.src = entry.target.dataset.src;

  entry.target.addEventListener('load', () => {
    entry.target.classList.remove('lazy-img');
  });

  observer.unobserve(entry.target);
}

const imgObserver = new IntersectionObserver(loadImg, {
  root: null,
  threshold: 0,
  rootMargin: '200px',
});

imgTargets.forEach(img => imgObserver.observe(img));

//--------------------------------------------------------------------------------------------------------------------------------------

