// ---------- State ----------
let selectedBase = null;
let lastShownName = null;

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

// ---------- Step 1: Base selection ----------
baseOptions.addEventListener('click', (e) => {
  const chip = e.target.closest('.base-chip');
  if (!chip) return;

  // toggle active state
  document.querySelectorAll('.base-chip').forEach(c => c.classList.remove('active'));
  chip.classList.add('active');

  selectedBase = chip.dataset.base;
  spinBtn.disabled = false;
});

// ---------- Step 2: Spin logic ----------
function spinFromBase(base) {
  let pool = (!base || base === 'Any')
    ? RECIPES
    : RECIPES.filter(r => r.mainBase === base);

  // fallback safety net (should not trigger given full dataset)
  if (pool.length === 0) pool = RECIPES;

  // avoid repeating the same dish twice in a row when possible
  let candidates = pool.filter(r => r.name !== lastShownName);
  if (candidates.length === 0) candidates = pool;

  const pick = candidates[Math.floor(Math.random() * candidates.length)];
  lastShownName = pick.name;

  renderCard(pick);
}

spinBtn.addEventListener('click', () => {
  if (!selectedBase) return;
  spinFromBase(selectedBase);
});

// "Surprise Me" button spins immediately from the full recipe pool,
// without requiring a main-base selection first.
surpriseBtn.addEventListener('click', () => {
  // clear any active base chip selection to avoid confusing UI state
  document.querySelectorAll('.base-chip').forEach(c => c.classList.remove('active'));
  spinFromBase('Any');
});

// ---------- Render / animate card ----------
function renderCard(dish) {
  const isFirstReveal = recipeCard.hasAttribute('hidden');

  if (isFirstReveal) {
    // Step 1: shrink + fade out the placeholder stack completely first,
    // so it fully disappears before the recipe card enters — avoids the
    // brief side-by-side "jump" that happens when both elements share
    // the flex row at the same time.
    cardStack.classList.add('stack-fade-out');
    setTimeout(() => {
      cardStack.hidden = true;
      // Step 2: only now bring the real recipe card into the flow and
      // play its entrance animation, so the transition reads as one
      // smooth continuous motion rather than two overlapping ones.
      fillCard(dish);
      recipeCard.hidden = false;
      if (shareSection) shareSection.hidden = false;
      recipeCard.classList.add('card-appear');
      setTimeout(() => recipeCard.classList.remove('card-appear'), 650);
    }, 420);
  } else {
    // flip-out, then flip-in with new content
    recipeCard.classList.add('card-flip-out');
    setTimeout(() => {
      fillCard(dish);
      recipeCard.classList.remove('card-flip-out');
      recipeCard.classList.add('card-flip-in');
      setTimeout(() => recipeCard.classList.remove('card-flip-in'), 600);
    }, 280);
  }
}

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
  const canonical = document.querySelector('link[rel="canonical"]');
  return canonical ? canonical.href : window.location.href.split('#')[0];
}

function buildTrackedShareUrl(dish, medium) {
  const url = new URL(getBaseShareUrl());
  url.searchParams.set('utm_source', 'recipe_spinner');
  url.searchParams.set('utm_medium', medium);
  url.searchParams.set('utm_campaign', 'recipe_share');
  url.searchParams.set('utm_content', (dish.name || 'recipe').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''));
  return url.toString();
}

function updateShareLinks(dish) {
  const shareText = `I found ${dish.name} on HAiCook Recipe Spinner.`;
  const copyUrl = buildTrackedShareUrl(dish, 'copy_link');
  const socialUrl = buildTrackedShareUrl(dish, 'social');

  if (copyShareLink) copyShareLink.dataset.shareUrl = copyUrl;
  if (facebookShareLink) facebookShareLink.href = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(socialUrl)}`;
  if (xShareLink) xShareLink.href = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(socialUrl)}`;
  if (lineShareLink) lineShareLink.href = `https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(socialUrl)}`;
  if (whatsappShareLink) whatsappShareLink.href = `https://wa.me/?text=${encodeURIComponent(`${shareText} ${socialUrl}`)}`;
}

function trackShare(method) {
  if (typeof gtag === 'function') {
    gtag('event', 'share_recipe', { method });
  }
}

async function copyRecipeLink() {
  const url = copyShareLink?.dataset.shareUrl || getBaseShareUrl();

  try {
    await navigator.clipboard.writeText(url);
  } catch (error) {
    const textarea = document.createElement('textarea');
    textarea.value = url;
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
