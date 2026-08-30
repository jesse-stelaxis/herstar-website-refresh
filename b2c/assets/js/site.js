const menuButton = document.querySelector('.menu-button');
const nav = document.querySelector('#site-nav');

menuButton?.addEventListener('click', () => {
  const open = menuButton.getAttribute('aria-expanded') === 'true';
  menuButton.setAttribute('aria-expanded', String(!open));
  nav.classList.toggle('is-open', !open);
});

nav?.addEventListener('click', (event) => {
  if (!event.target.closest('a')) return;
  nav.classList.remove('is-open');
  menuButton?.setAttribute('aria-expanded', 'false');
});

const filters = document.querySelectorAll('.filter');
const cards = document.querySelectorAll('.product-card');

filters.forEach((button) => {
  button.addEventListener('click', () => {
    const filter = button.dataset.filter;
    filters.forEach((item) => item.classList.toggle('is-active', item === button));
    cards.forEach((card) => {
      const categories = card.dataset.category.split(' ');
      card.hidden = filter !== 'all' && !categories.includes(filter);
    });
  });
});

document.querySelector('.signup-form')?.addEventListener('submit', (event) => {
  event.preventDefault();
  const form = event.currentTarget;
  const email = form.querySelector('input');
  const status = document.querySelector('.form-status');
  status.textContent = `You’re on the list, ${email.value}.`;
  form.reset();
});

const offer = document.querySelector('.offer');
const offerForm = document.querySelector('.offer-form');
const offerCloseButtons = document.querySelectorAll('.offer-close, .offer-skip, .offer-backdrop');
const offerStorageKey = 'herstar-welcome-offer-dismissed';
let previousFocus;

const closeOffer = () => {
  offer.hidden = true;
  localStorage.setItem(offerStorageKey, 'true');
  previousFocus?.focus();
};

const openOffer = () => {
  if (localStorage.getItem(offerStorageKey)) return;
  previousFocus = document.activeElement;
  offer.hidden = false;
  offer.querySelector('.offer-close').focus();
};

offerCloseButtons.forEach((button) => button.addEventListener('click', closeOffer));

offerForm?.addEventListener('submit', (event) => {
  event.preventDefault();
  const status = offer.querySelector('.offer-status');
  status.textContent = 'You’re in. Your opening-day code is reserved.';
  offerForm.reset();
  localStorage.setItem(offerStorageKey, 'true');
  window.setTimeout(() => { offer.hidden = true; }, 1400);
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && !offer.hidden) closeOffer();
});

window.setTimeout(openOffer, 900);
