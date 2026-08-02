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
}
