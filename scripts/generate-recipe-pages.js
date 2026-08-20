const fs = require('fs');
const path = require('path');
const vm = require('vm');

const SITE_URL = 'https://spin.haicook.ai';
const TODAY = '2026-08-08';
const root = path.resolve(__dirname, '..');
const recipesSource = fs.readFileSync(path.join(root, 'data', 'recipes.js'), 'utf8');
const context = {};
vm.createContext(context);
vm.runInContext(`${recipesSource}\nthis.RECIPES = RECIPES;`, context);

const recipes = context.RECIPES;
if (!Array.isArray(recipes)) {
  throw new Error('RECIPES was not loaded from data/recipes.js');
}

function slugify(value) {
  return (value || 'recipe').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

function escapeHtml(value = '') {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function absoluteUrl(value) {
  return new URL(value.replace(/^\//, ''), `${SITE_URL}/`).toString();
}

const GOOGLE_ADS_TRACKING_SNIPPET = `<!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=AW-17905621290"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());

  gtag('config', 'AW-17905621290');
</script>

<!-- Event snippet for Website traffic (1) conversion page -->
<script>
  gtag('event', 'conversion', {'send_to': 'AW-17905621290/CXYuCLyg1OQcEKqyiNpC'});
</script>`;
function renderList(items = []) {
  return items.map(item => `<li>${escapeHtml(item)}</li>`).join('\n');
}

function renderSteps(items = []) {
  return items.map(item => `<li>${escapeHtml(item)}</li>`).join('\n');
}

function renderRecipePage(recipe) {
  const slug = slugify(recipe.name);
  const canonical = `${SITE_URL}/recipes/${slug}/`;
  const image = absoluteUrl(recipe.image);
  const description = recipe.description || `${recipe.name} recipe idea from HAiCook.`;
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Recipe',
    name: recipe.name,
    description,
    image: [image],
    recipeCategory: recipe.mainBase,
    recipeCuisine: recipe.cuisine,
    keywords: [recipe.mainBase, recipe.cuisine, recipe.mood, 'HAiCook', 'recipe'].filter(Boolean).join(', '),
    recipeIngredient: recipe.ingredientsList || [],
    recipeInstructions: (recipe.steps || []).map(step => ({ '@type': 'HowToStep', text: step })),
    author: { '@type': 'Organization', name: 'HAiCook' },
    publisher: { '@type': 'Organization', name: 'HAiCook' }
  };

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${escapeHtml(recipe.name)} | HAiCook Recipe Spinner</title>
<meta name="description" content="${escapeHtml(description)}">
<link rel="canonical" href="${canonical}">
<meta property="og:type" content="article">
<meta property="og:site_name" content="HAiCook">
<meta property="og:title" content="${escapeHtml(recipe.name)} | HAiCook Recipe Spinner">
<meta property="og:description" content="${escapeHtml(description)}">
<meta property="og:url" content="${canonical}">
<meta property="og:image" content="${image}">
<meta property="og:image:alt" content="${escapeHtml(recipe.name)} recipe photo">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${escapeHtml(recipe.name)} | HAiCook Recipe Spinner">
<meta name="twitter:description" content="${escapeHtml(description)}">
<meta name="twitter:image" content="${image}">
<meta name="twitter:image:alt" content="${escapeHtml(recipe.name)} recipe photo">
<script type="application/ld+json">${JSON.stringify(jsonLd)}</script>
${GOOGLE_ADS_TRACKING_SNIPPET}
<link rel="icon" type="image/png" sizes="48x48" href="/images/favicon/recipe-spinner-48.png?v=20260726">
<link rel="icon" type="image/png" sizes="96x96" href="/images/favicon/recipe-spinner-96.png?v=20260726">
<link rel="icon" type="image/png" sizes="192x192" href="/images/favicon/recipe-spinner-192.png?v=20260726">
<link rel="manifest" href="/site.webmanifest">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Poppins:wght@500;600;700;800&family=Quicksand:wght@400;500;600;700&display=swap" rel="stylesheet">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.5.2/css/all.min.css">
<link rel="stylesheet" href="/styles.css?v=20260808-recipe-pages">
</head>
<body>
<div class="app-container recipe-detail-page">
  <header>
    <a href="/" aria-label="Back to Recipe Spinner"><img class="header-logo" src="/images/favicon/random-recipe-logo.png" alt="Recipe Spinner by HAiCook logo"></a>
    <div class="brand"><i class="fa-solid fa-utensils"></i> Recipe Spinner by HAiCook</div>
  </header>

  <main class="recipe-detail-shell">
    <article class="recipe-card recipe-detail-card">
      <div class="card-body">
        <div class="card-page-left">
          <div class="card-title-row">
            <h1>${escapeHtml(recipe.name)}</h1>
            <span class="difficulty-tag ${escapeHtml((recipe.difficulty || 'Easy').toLowerCase())}">${escapeHtml(recipe.difficulty || 'Easy')}</span>
          </div>
          <p class="description">${escapeHtml(description)}</p>

          <div class="section-block">
            <p class="section-heading"><i class="fa-solid fa-basket-shopping"></i>Ingredients</p>
            <ul class="ingredients-list">${renderList(recipe.ingredientsList)}</ul>
          </div>

          <div class="section-block why-love-block">
            <p class="why-love"><i class="fa-solid fa-heart"></i><strong>Why You'll Love It:</strong> ${escapeHtml(recipe.why || '')}</p>
          </div>
        </div>

        <div class="card-page-right">
          <div class="card-image-wrap">
            <img src="/${escapeHtml(recipe.image)}" alt="${escapeHtml(recipe.name)} recipe photo">
            <span class="badge">${escapeHtml(recipe.mainBase)}</span>
          </div>
          <p class="book-heading"><i class="fa-solid fa-book-open"></i>Cooking Steps</p>
          <ol class="steps-list">${renderSteps(recipe.steps)}</ol>
        </div>
      </div>
    </article>

    <div class="recipe-detail-actions">
      <a class="detail-action primary" href="/?recipe=${slug}"><i class="fa-solid fa-dice"></i> Open in Spinner</a>
      <a class="detail-action" href="/"><i class="fa-solid fa-house"></i> Explore More Recipes</a>
    </div>
  </main>

  <footer class="note">Dish photos are for illustration purposes only.</footer>
</div>
</body>
</html>
`;
}

const slugs = new Map();
for (const recipe of recipes) {
  const slug = slugify(recipe.name);
  if (slugs.has(slug)) {
    throw new Error(`Duplicate recipe slug: ${slug}`);
  }
  slugs.set(slug, recipe.name);

  const recipeDir = path.join(root, 'recipes', slug);
  fs.mkdirSync(recipeDir, { recursive: true });
  fs.writeFileSync(path.join(recipeDir, 'index.html'), renderRecipePage(recipe), 'utf8');
}

const sitemapUrls = [
  { loc: `${SITE_URL}/`, priority: '1.0', changefreq: 'weekly' },
  ...recipes.map(recipe => ({
    loc: `${SITE_URL}/recipes/${slugify(recipe.name)}/`,
    priority: '0.8',
    changefreq: 'monthly'
  }))
];

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapUrls.map(({ loc, priority, changefreq }) => `  <url>
    <loc>${loc}</loc>
    <lastmod>${TODAY}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`).join('\n')}
</urlset>
`;
fs.writeFileSync(path.join(root, 'sitemap.xml'), sitemap, 'utf8');

console.log(`Generated ${recipes.length} recipe pages.`);