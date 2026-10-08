import { suggestions, cap } from './recipes.ts';
import { stepImage } from './step-images.ts';
import { SOURCE_URL, expectedWeek } from './box.ts';

export const escapeHTML = value => String(value).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
const e = escapeHTML;
const dateLabel = week => new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' }).format(new Date(`${week}T12:00:00Z`));
const bag = (title, rows) => `<section class="bag"><h3>${title}</h3><ul>${rows.map(p => `<li><span>${e(cap(p.original))}</span><small>${e(p.origin)}</small></li>`).join('')}</ul></section>`;

function recipeCard(recipe) {
  return `<article class="recipe" id="${e(recipe.id)}">
    <div class="dish-photo" role="img" aria-label="Illustration of ${e(recipe.title)}" style="background-position:${recipe.image * 25}% center"><span>Illustration</span></div>
    <div class="recipe-body"><div class="recipe-meta"><span>${recipe.vegetarian ? 'Vegetarian' : 'Chicken option'}</span><span>${recipe.minutes} min · 6 portions</span></div>
    <h3>${e(recipe.title)}</h3><p class="subtitle">${e(recipe.subtitle)}</p>
    <details><summary>Ingredients &amp; cooking steps <span aria-hidden="true">↗</span></summary><div class="recipe-content">
    <h4>Ingredients for all six portions</h4><ul class="ingredients">${recipe.ingredients.map(i => `<li><strong>${i.quantity} ${e(i.unit)}</strong><span>${e(i.name)}</span></li>`).join('')}</ul>
    <p class="note">Check what you already have. Box weights are not supplied by the grower; measure what arrived before shopping. Tin weights are drained where stated.</p>
    <h4>Equipment</h4><p>${recipe.equipment.map(e).join(' · ')}</p>
    <h4>Let’s cook</h4><ol class="steps">${recipe.steps.map((step, i) => {
      const image = stepImage(recipe.id, i);
      const illustration = image ? `<div class="step-photo"><img loading="lazy" src="assets${e(image.src)}" alt="${e(image.alt)}" style="${Object.entries(image.style).map(([k,v]) => `${k}:${v}`).join(';')}"></div>` : '';
      return `<li>${illustration}<div><h5>${e(step.title)}</h5><p>${e(step.text)}</p></div></li>`;
    }).join('')}</ol>
    <div class="storage"><h4>Save some for later</h4><p>${e(recipe.storage)}</p></div>
    <button type="button" data-print="${e(recipe.id)}">Print this recipe</button>
    </div></details></div></article>`;
}

export function renderPage(box, now = new Date()) {
  const stale = box.week < expectedWeek(now);
  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>Box &amp; Table — this week’s box</title><meta name="description" content="This week’s NEOG vegetable and fruit box, with five seasonal batch-cook recipes for six portions.">
<link rel="icon" href="assets/favicon.svg"><link rel="stylesheet" href="assets/site.css"><script src="assets/site.js" defer></script></head>
<body><a class="skip" href="#main">Skip to content</a><header class="masthead"><a class="brand" href="./"><img src="assets/favicon.svg" width="34" height="34" alt="">Box <span>&amp;</span> Table</a><nav aria-label="Main"><a href="#box">The box</a><a href="#recipes">Recipes</a></nav></header>
<main id="main"><section class="hero"><div><p class="eyebrow">Seasonal food. A little less planning.</p><h1>A good box.<br>A week of possibilities.</h1><p class="lede">Your NEOG vegetables and fruit, turned into generous, practical meals. Pick two batch cooks, make six portions of each, and keep some for later.</p><a class="primary" href="#recipes">Find something to cook <span aria-hidden="true">↗</span></a></div><aside class="week-card"><span class="eyebrow">This week’s delivery</span><p class="week-date">${e(dateLabel(box.week))}</p><p>Large vegetable &amp; fruit bags</p><div class="week-counts"><div><strong>${box.vegetables.length}</strong><span>vegetables</span></div><div><strong>${box.fruit.length}</strong><span>fruits</span></div><div><strong>5</strong><span>recipes</span></div></div><a href="${SOURCE_URL}">See the grower’s listing ↗</a></aside></section>
<p id="stale" class="stale" data-week="${e(box.week)}" ${stale ? '' : 'hidden'}>The grower’s latest saved listing is from ${e(dateLabel(box.week))}. A newer week has not been published here yet. Check the source before shopping.</p>
<section id="box" class="box-section"><div class="section-title"><div><p class="eyebrow">Fresh from the grower</p><h2>What’s in the box?</h2></div><p>Week commencing Wednesday<br><strong>${e(dateLabel(box.week))}</strong></p></div><div class="bags">${bag('Vegetables', box.vegetables)}${bag('Fruit', box.fruit)}</div><p class="note">Contents can vary with the harvest. Amounts are not listed; check your actual bags. Fruit is ideal for breakfasts and snacks.</p></section>
<section id="recipes"><div class="section-title"><div><p class="eyebrow">Two cooks. Plenty to share.</p><h2>Put your box on the table.</h2></div><p>Four vegetarian ideas + one chicken option.<br>Every recipe makes six portions.</p></div><p class="recipe-intro">Original, adaptable recipe templates using compatible vegetables from this week’s box. Total times include preparation and are estimates, not kitchen-tested timings.</p><div class="recipes">${suggestions(box).map(recipeCard).join('')}</div></section>
<section class="closing"><p class="eyebrow">Make it your week</p><h2>Cook two. Enjoy six meals for two.</h2><p>Browse, open and print any recipe. This page does not save selections or shopping lists; your full local planner is still available for that.</p></section>
</main><footer><span class="brand">Box &amp; Table</span><p>Independent meal ideas using the <a href="${SOURCE_URL}">NEOG large bags</a>. Dish and step images are AI illustrations and may differ from your ingredients.</p><p>For storage and reheating, see <a href="https://www.food.gov.uk/safety-hygiene/cooking-your-food">Food Standards Agency guidance</a>.</p></footer></body></html>`;
}
