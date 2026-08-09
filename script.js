// ---------- State ----------
let selectedBase = null;
let lastShownName = null;
let recentShownNames = [];
let isSpinning = false;

// ---------- DOM References ----------
const baseOptions = document.getElementById('baseOptions');
const spinBtn = document.getElementById('spinBtn');
const surpriseBtn = document.getElementById('surpriseBtn');
const recipeCard = document.getElementById('recipeCard');
const cardStack = document.getElementById('cardStack');
const ctaSection = document.getElementById('ctaSection');

const cardImage = document.getElementById('cardImage');
const cardBase = document.getElementById('cardBase');
const cardName = document.getElementById('cardName');
const cardDescription = document.getElementById('cardDescription');
const cardDifficulty = document.getElementById('cardDifficulty');
const cardWhy = document.getElementById('cardWhy');
const cardIngredientsList = document.getElementById('cardIngredientsList');
const cardStepsList = document.getElementById('cardStepsList');

const shareSection = document.getElementById('shareSection');
const copyShareLink = document.getElementById('copyShareLink');
const facebookShareLink = document.getElementById('facebookShareLink');
const xShareLink = document.getElementById('xShareLink');
const lineShareLink = document.getElementById('lineShareLink');
const whatsappShareLink = document.getElementById('whatsappShareLink');
const redditShareLink = document.getElementById('redditShareLink');
const messengerShareLink = document.getElementById('messengerShareLink');
const snapchatShareLink = document.getElementById('snapchatShareLink');
const threadsShareLink = document.getElementById('threadsShareLink');
const telegramShareLink = document.getElementById('telegramShareLink');

const DEFAULT_SPIN_BUTTON_HTML = '<i class="fa-solid fa-dice"></i><span class="spin-btn-text">Spin for a Recipe Idea</span>';
const SPIN_LOADING_ICONS = ['?Ž²', '??', '??', '??', '?³', '??'];

// ---------- Step 1: Base selection ----------
baseOptions.addEventListener('click', (e) => {
  const chip = e.target.closest('.base-chip');
  if (!chip) return;

  // toggle active state
  document.querySelectorAll('.base-chip').forEach(c => c.classList.remove('active'));
  chip.classList.add('active');

  selectedBase = chip.dataset.base;
  if (!isSpinning) spinBtn.disabled = false;
});

// ---------- Step 2: Spin logic ----------
function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function getRecipePool(base) {
  let pool = (!base || base === 'Any')
    ? RECIPES
    : RECIPES.filter(r => r.mainBase === base);

  return pool.length ? pool : RECIPES;
}

function rememberShownRecipe(name) {
  lastShownName = name;
  recentShownNames = [name, ...recentShownNames.filter(item => item !== name)].slice(0, 3);
}

function pickRecipeFromPool(pool) {
  let candidates = pool.filter(r => !recentShownNames.includes(r.name));
  if (candidates.length === 0) candidates = pool.filter(r => r.name !== lastShownName);
  if (candidates.length === 0) candidates = pool;

  return candidates[Math.floor(Math.random() * candidates.length)];
}

function setSpinLoading(isLoading) {
  if (isLoading) {
    const icons = SPIN_LOADING_ICONS
      .map((icon, index) => `<span class="spin-loading-icon" style="--i:${index}">${icon}</span>`)
      .join('');

    spinBtn.classList.add('is-spinning');
    spinBtn.disabled = true;
    surpriseBtn.disabled = true;
    spinBtn.innerHTML = `<span class="spin-loading-icons" aria-hidden="true">${icons}</span><span class="spin-btn-text">Spinning...</span>`;
    return;
  }

  spinBtn.classList.remove('is-spinning');
  spinBtn.innerHTML = DEFAULT_SPIN_BUTTON_HTML;
  spinBtn.disabled = !selectedBase;
  surpriseBtn.disabled = false;
}

function prepareCardForSpin(isFirstReveal) {
  if (!isFirstReveal) return Promise.resolve();

  cardStack.classList.add('stack-fade-out');
  return wait(420).then(() => {
    cardStack.hidden = true;
    recipeCard.hidden = false;
    if (shareSection) shareSection.hidden = true;
  });
}

function runNameRoulette(pool, finalDish) {
  const names = pool
    .filter(dish => dish.name !== finalDish.name)
    .map(dish => dish.name);
  const rouletteNames = names.length ? names : [finalDish.name];
  const duration = 900;
  const intervalMs = 82;
  let tick = 0;

  cardName.classList.add('name-roulette');
  cardName.textContent = rouletteNames[Math.floor(Math.random() * rouletteNames.length)];

  return new Promise(resolve => {
    const interval = setInterval(() => {
      cardName.textContent = rouletteNames[tick % rouletteNames.length];
      tick += 1;
    }, intervalMs);

    setTimeout(() => {
      clearInterval(interval);
      cardName.textContent = finalDish.name;
      cardName.classList.remove('name-roulette');
      resolve();
    }, duration);
  });
}

function animateFinalCard() {
  recipeCard.classList.remove('card-appear', 'card-flip-in', 'result-settle');
  void recipeCard.offsetWidth;
  recipeCard.classList.add('result-settle');
  setTimeout(() => recipeCard.classList.remove('result-settle'), 620);
}

function scrollToResultCard() {
  const rect = recipeCard.getBoundingClientRect();
  const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
  const isComfortablyVisible = rect.top >= 80 && rect.bottom <= viewportHeight - 40;

  if (!isComfortablyVisible) {
    recipeCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
}

async function spinFromBase(base) {
  if (isSpinning) return;

  isSpinning = true;
  setSpinLoading(true);

  const pool = getRecipePool(base);
  const pick = pickRecipeFromPool(pool);
  const isFirstReveal = recipeCard.hasAttribute('hidden');

  await prepareCardForSpin(isFirstReveal);
  await runNameRoulette(pool, pick);
  fillCard(pick);
  rememberShownRecipe(pick.name);
  if (shareSection) shareSection.hidden = false;
  animateFinalCard();
  scrollToResultCard();

  isSpinning = false;
  setSpinLoading(false);
}

spinBtn.addEventListener('click', () => {
  if (!selectedBase || isSpinning) return;
  spinFromBase(selectedBase);
});

// "Surprise Me" button spins immediately from the full recipe pool,
// without requiring a main-base selection first.
surpriseBtn.addEventListener('click', () => {
  if (isSpinning) return;

  // clear any active base chip selection to avoid confusing UI state
  document.querySelectorAll('.base-chip').forEach(c => c.classList.remove('active'));
  selectedBase = null;
  spinFromBase('Any');
});

// ---------- Render / animate card ----------

function fillCard(dish) {
  cardImage.src = dish.image;
  cardImage.alt = dish.name;
  cardBase.textContent = dish.mainBase;
  cardName.textContent = dish.name;
  cardDescription.textContent = dish.description;
  cardWhy.textContent = dish.why || '';

  cardDifficulty.textContent = dish.difficulty;
  cardDifficulty.className = 'difficulty-tag ' + (dish.difficulty || 'Easy').toLowerCase();

  cardIngredientsList.innerHTML = '';
  (dish.ingredientsList || []).forEach(item => {
    const li = document.createElement('li');
    li.textContent = item;
    cardIngredientsList.appendChild(li);
  });

  cardStepsList.innerHTML = '';
  (dish.steps || []).forEach(step => {
    const li = document.createElement('li');
    li.textContent = step;
    cardStepsList.appendChild(li);
  });
  updateShareLinks(dish);
}

// ---------- Share actions ----------
function getBaseShareUrl() {
  const url = new URL(window.location.href);
  url.search = '';
  url.hash = '';
  return url.toString();
}

function getRecipeSlug(dish) {
  return (dish.name || 'recipe').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

function buildTrackedShareUrl(dish, medium) {
  const slug = getRecipeSlug(dish);
  const baseUrl = window.location.protocol.startsWith('http')
    ? new URL(`/recipes/${slug}/`, window.location.origin)
    : new URL(`/recipes/${slug}/`, 'https://spin.haicook.ai');
  baseUrl.searchParams.set('utm_source', 'recipe_spinner');
  baseUrl.searchParams.set('utm_medium', medium);
  baseUrl.searchParams.set('utm_campaign', 'recipe_share');
  baseUrl.searchParams.set('utm_content', slug);
  return baseUrl.toString();
}

function formatRecipeShareText(dish) {
  const ingredients = (dish.ingredientsList || []).map(item => `- ${item}`).join('\n');
  const steps = (dish.steps || []).map((step, index) => `${index + 1}. ${step}`).join('\n');

  return [
    `${dish.name} | HAiCook Recipe Spinner`,
    '',
    `Main base: ${dish.mainBase}`,
    `Difficulty: ${dish.difficulty}`,
    '',
    dish.description,
    '',
    'Ingredients:',
    ingredients,
    '',
    'Cooking Steps:',
    steps,
    '',
    `Why You'll Love It: ${dish.why || ''}`
  ].filter(Boolean).join('\n');
}

function updateShareLinks(dish) {
  const recipeText = formatRecipeShareText(dish);
  const recipeTitle = `${dish.name} | HAiCook Recipe Spinner`;
  const copyUrl = buildTrackedShareUrl(dish, 'copy_link');
  const facebookUrl = buildTrackedShareUrl(dish, 'facebook');
  const xUrl = buildTrackedShareUrl(dish, 'x');
  const lineUrl = buildTrackedShareUrl(dish, 'line');
  const whatsappUrl = buildTrackedShareUrl(dish, 'whatsapp');
  const redditUrl = buildTrackedShareUrl(dish, 'reddit');
  const messengerUrl = buildTrackedShareUrl(dish, 'messenger');
  const snapchatUrl = buildTrackedShareUrl(dish, 'snapchat');
  const threadsUrl = buildTrackedShareUrl(dish, 'threads');
  const telegramUrl = buildTrackedShareUrl(dish, 'telegram');

  if (copyShareLink) {
    copyShareLink.dataset.shareUrl = copyUrl;
    copyShareLink.dataset.shareText = `${recipeText}\n\nView this recipe: ${copyUrl}`;
  }
  if (facebookShareLink) facebookShareLink.href = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(facebookUrl)}&quote=${encodeURIComponent(recipeText)}`;
  if (xShareLink) xShareLink.href = `https://twitter.com/intent/tweet?text=${encodeURIComponent(`${recipeText}\n\n${xUrl}`)}`;
  if (lineShareLink) lineShareLink.href = `https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(lineUrl)}&text=${encodeURIComponent(recipeText)}`;
  if (whatsappShareLink) whatsappShareLink.href = `https://wa.me/?text=${encodeURIComponent(`${recipeText}\n\n${whatsappUrl}`)}`;
  if (redditShareLink) redditShareLink.href = `https://www.reddit.com/submit?url=${encodeURIComponent(redditUrl)}&title=${encodeURIComponent(recipeTitle)}&text=${encodeURIComponent(recipeText)}`;
  if (messengerShareLink) messengerShareLink.href = `fb-messenger://share/?link=${encodeURIComponent(messengerUrl)}`;
  if (snapchatShareLink) snapchatShareLink.href = `https://www.snapchat.com/share?link=${encodeURIComponent(snapchatUrl)}`;
  if (threadsShareLink) threadsShareLink.href = `https://www.threads.net/intent/post?text=${encodeURIComponent(`${recipeText}\n\n${threadsUrl}`)}`;
  if (telegramShareLink) telegramShareLink.href = `https://t.me/share/url?url=${encodeURIComponent(telegramUrl)}&text=${encodeURIComponent(recipeText)}`;
}

function trackShare(method) {
  if (typeof gtag === 'function') {
    gtag('event', 'share_recipe', { method });
  }
}

async function copyRecipeLink() {
  const text = copyShareLink?.dataset.shareText || copyShareLink?.dataset.shareUrl || getBaseShareUrl();

  try {
    await navigator.clipboard.writeText(text);
  } catch (error) {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.setAttribute('readonly', '');
    textarea.style.position = 'fixed';
    textarea.style.left = '-9999px';
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    textarea.remove();
  }

  const label = copyShareLink.querySelector('span');
  const originalText = label.textContent;
  copyShareLink.classList.add('copied');
  label.textContent = 'Copied!';
  trackShare('copy_link');

  setTimeout(() => {
    copyShareLink.classList.remove('copied');
    label.textContent = originalText;
  }, 1600);
}

copyShareLink?.addEventListener('click', copyRecipeLink);
facebookShareLink?.addEventListener('click', () => trackShare('facebook'));
xShareLink?.addEventListener('click', () => trackShare('x'));
lineShareLink?.addEventListener('click', () => trackShare('line'));
whatsappShareLink?.addEventListener('click', () => trackShare('whatsapp'));
redditShareLink?.addEventListener('click', () => trackShare('reddit'));
messengerShareLink?.addEventListener('click', () => trackShare('messenger'));
snapchatShareLink?.addEventListener('click', () => trackShare('snapchat'));
threadsShareLink?.addEventListener('click', () => trackShare('threads'));
telegramShareLink?.addEventListener('click', () => trackShare('telegram'));
// ---------- Shared recipe entry ----------
function getRecipeFromUrl() {
  const params = new URLSearchParams(window.location.search);
  const slug = params.get('recipe');
  if (!slug) return null;

  return RECIPES.find(dish => getRecipeSlug(dish) === slug) || null;
}

function revealSharedRecipe() {
  const sharedRecipe = getRecipeFromUrl();
  if (!sharedRecipe) return;

  selectedBase = sharedRecipe.mainBase;
  rememberShownRecipe(sharedRecipe.name);
  document.querySelectorAll('.base-chip').forEach(chip => {
    chip.classList.toggle('active', chip.dataset.base === sharedRecipe.mainBase);
  });
  if (!isSpinning) spinBtn.disabled = false;
  cardStack.hidden = true;
  fillCard(sharedRecipe);
  recipeCard.hidden = false;
  if (shareSection) shareSection.hidden = false;
}

revealSharedRecipe();
