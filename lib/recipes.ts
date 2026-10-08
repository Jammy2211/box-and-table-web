import type { Box, Ingredient, Recipe } from './types.ts';

export const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
const roots = ['swede', 'potato', 'carrot', 'parsnip', 'beetroot', 'kohlrabi', 'butternut squash', 'sweet potato', 'turnip', 'celeriac'];
const leaves = ['cavolo nero', 'chard', 'kale', 'cabbage', 'spinach', 'spring greens', 'savoy cabbage', 'pointed cabbage', 'red cabbage', 'pak choi'];
const florets = ['cauliflower', 'broccoli', 'romanesco'];
const summer = ['courgette', 'aubergine', 'pepper', 'fennel'];
const quick = ['courgette', 'pepper', 'mushroom', 'leek', 'green beans', 'runner beans', 'peas', 'mangetout', 'asparagus'];
const raw = ['carrot', 'cucumber', 'kohlrabi', 'radish', 'tomato'];
const item = (name: string, quantity: number, unit: Ingredient['unit'] = 'g', aisle = 'Cupboard'): Ingredient => ({ name, quantity, unit, aisle });
const veg = (name: string, quantity: number) => item(name, quantity, 'g', 'Fruit & vegetables');
const oil = item('olive oil', 30, 'ml');
const garlic = item('garlic granules', 2, 'tsp');
const beans = item('white beans (drained)', 720);
const chickpeas = item('chickpeas (drained)', 720);
const tomatoes = item('tinned chopped tomatoes', 800);
const bread = item('bread', 450);
const chicken = item('boneless chicken thigh', 900, 'g', 'Meat & fish');
const storage = 'Divide into shallow containers and cool within 1–2 hours, then refrigerate. Eat refrigerated portions within 48 hours; freeze portions you will not eat by then. Defrost in the fridge and use within 24 hours. Reheat only once, until steaming hot throughout.';
const chickenCheck = 'Check the thickest chicken pieces with a food thermometer: 75°C for at least 30 seconds. Continue cooking if needed. Keep raw chicken and its utensils separate from other food; wash hands after handling it.';
const portion = 'Taste and season with salt and pepper as needed. Divide into six portions. Serve two and cool the other four promptly; follow the storage guidance below.';
const step = (title: string, text: string) => ({ title, text });
function chop(name: string) {
  if (leaves.includes(name)) return `wash the ${name}, slice the stems very finely and shred the leaves`;
  if (florets.includes(name)) return `cut the ${name} into small florets and dice the stalk into 1 cm pieces`;
  if (name === 'leek') return 'wash the leek thoroughly and slice thinly';
  if (name === 'mushroom') return 'wipe and slice the mushroom';
  if (['green beans', 'runner beans', 'asparagus'].includes(name)) return `trim the ${name} and cut into 2 cm pieces`;
  if (['peas', 'mangetout'].includes(name)) return `wash and trim the ${name} as needed`;
  return `peel or trim the ${name} as needed and cut into 1 cm pieces`;
}

type Spec = {
  id: string; slots: string[][]; amounts: number[]; vegetarian?: boolean;
  minutes: number; method: string; title: (v: string[]) => string;
  extras: Ingredient[]; equipment: string[];
  cook: (v: string[], base: string) => { title: string; text: string }[];
  image?: number;
};
const pan = ['Large hob pan (5–6 litres)', 'Chopping board', 'Sharp knife'];
const oven = ['Oven', 'Two large baking trays', 'Chopping board', 'Sharp knife'];
export const collection: Spec[] = [
  { id: 'swede-potato-mash', slots: [['swede'], ['potato'], leaves], amounts: [600, 750, 400], minutes: 45, method: 'Mash & greens',
    title: ([a,b,c]) => `${cap(a)} & ${b} mash with ${c} and white beans`, extras: [beans, item('vegetarian cheddar', 150, 'g', 'Chilled')], equipment: [...pan, 'Second saucepan', 'Potato masher'],
    cook: ([a,b,c], base) => [step('Boil the roots', `Cover the ${a} with water in a saucepan. Bring to the boil and simmer for 10 minutes. Add the ${b} and simmer for another 15–20 minutes until both crush easily with a fork; allow longer if needed.`), step('Cook the greens and beans', `${base} Add the ${c}, garlic granules, white beans and 200 ml water. Cover and simmer for 10–15 minutes until the stems and leaves are tender, stirring occasionally.`), step('Mash and serve', `Drain the ${a} and ${b}, reserving a mug of cooking water. Mash with the cheddar, loosening with a little reserved water. Spoon the greens and beans over the mash. ${portion}`)] },
  { id: 'roast-chickpea-tray', slots: [roots, florets], amounts: [650, 650], minutes: 45, method: 'Roasted & spiced',
    title: ([a,b]) => `Smoky ${a}, ${b} & chickpea trays`, extras: [chickpeas, item('smoked paprika', 3, 'tsp'), item('couscous', 450)], equipment: [...oven, 'Kettle', 'Heatproof bowl'],
    cook: ([a,b]) => [step('Roast the vegetables', `Heat the oven to 220°C / 200°C fan while preparing the vegetables. Spread the ${a}, ${b}, any listed onion and drained chickpeas across two trays. Toss with olive oil, garlic granules and smoked paprika. Roast for 30–35 minutes, turning halfway, until the diced roots are tender; avoid overcrowding and allow longer if needed.`), step('Make the couscous', 'During the final 10 minutes, put the couscous in a heatproof bowl, add boiling water in the ratio on its packet, cover and leave for the packet time. Fluff with a fork.'), step('Bring it together', `Serve the roasted ${a}, ${b} and chickpeas over the couscous. ${portion}`)] },
  { id: 'leafy-bean-pasta', slots: [leaves], amounts: [750], minutes: 35, method: 'Creamy pasta',
    title: ([a]) => `Creamy ${a} & white-bean pasta`, extras: [beans, item('pasta', 500), item('cream cheese', 200, 'g', 'Chilled')], equipment: [...pan, 'Second saucepan', 'Colander'], image: 1,
    cook: ([a], base) => [step('Soften the greens', `${base} Add the ${a}, garlic granules and 250 ml water. Cover and simmer for 10–15 minutes until tender, stirring occasionally.`), step('Cook the pasta', 'Meanwhile, boil the pasta according to its packet. Reserve 400 ml cooking water before draining.'), step('Make the sauce', `Add the drained white beans and cream cheese to the ${a}. Heat gently for 5 minutes, stirring. Fold in the pasta and enough reserved water for a loose sauce. ${portion}`)] },
  { id: 'floret-orzo', slots: [florets], amounts: [1100], minutes: 35, method: 'One-pot orzo',
    title: ([a]) => `${cap(a)}, white-bean & cheddar orzo`, extras: [beans, item('orzo', 450), item('vegetarian cheddar', 180, 'g', 'Chilled'), item('vegetable stock powder', 3, 'tsp')], equipment: pan,
    cook: ([a], base) => [step('Start the pot', `${base} Add the ${a}, garlic granules, orzo, stock powder and 1.2 litres boiling water. Bring to a simmer.`), step('Stir and simmer', `Cook uncovered for the orzo packet time, usually 10–15 minutes, stirring often and adding hot water if it catches. The ${a} should be tender; keep simmering if needed. Add the white beans for the last 5 minutes.`), step('Finish with cheese', `Take off the heat and fold in the cheddar. Add a little hot water if thick. ${portion}`)] },
  { id: 'coconut-lentil-dhal', slots: [[...roots, ...florets]], amounts: [1200], minutes: 45, method: 'Coconut dhal',
    title: ([a]) => `${cap(a)} & red-lentil coconut dhal`, extras: [item('red lentils (dry)', 450), item('coconut milk', 400, 'ml'), tomatoes, item('curry powder', 4, 'tsp'), bread], equipment: pan,
    cook: ([a], base) => [step('Start the dhal', `${base} Stir in garlic granules and curry powder for 30 seconds. Add rinsed red lentils, coconut milk, tomatoes, ${a} and 800 ml water.`), step('Simmer gently', `Simmer partly covered for 25–30 minutes, stirring frequently, until the lentils have softened and the ${a} is tender. Add more water if it becomes thick. Small 1 cm root pieces are essential; allow longer if needed.`), step('Serve with bread', `${portion} Divide the bread between all six portions; freeze it separately from the dhal.`)] },
  { id: 'potato-greens-scramble', slots: [['potato'], [...leaves, ...florets]], amounts: [900, 600], minutes: 45, method: 'Potato & egg skillet',
    title: ([a,b]) => `${cap(a)}, ${b} & cheddar egg skillet`, extras: [item('eggs (about 12 medium, without shells)', 600, 'g', 'Chilled'), item('vegetarian cheddar', 180, 'g', 'Chilled')], equipment: [...pan, 'Second saucepan', 'Mixing bowl'],
    cook: ([a,b], base) => [step('Prepare the filling', `Boil the diced ${a} for 10–12 minutes until just tender, then drain. ${base} Add the ${b}, garlic granules and 150 ml water. Cover and cook for 8–12 minutes until tender, then uncover to evaporate excess water.`), step('Scramble the eggs', `Whisk the eggs and stir in the cheddar. Add the drained ${a} to the pan of ${b}, then pour over the egg mixture. Cook over a medium-low heat for 6–10 minutes, stirring and folding gently until the egg is fully set with no liquid remaining.`), step('Serve hot', portion)] },
  { id: 'root-green-bean-soup', slots: [roots, leaves], amounts: [700, 500], minutes: 45, method: 'Hearty bean soup',
    title: ([a,b]) => `${cap(a)}, ${b} & white-bean soup`, extras: [beans, tomatoes, item('dried mixed herbs', 2, 'tsp'), bread], equipment: pan,
    cook: ([a,b], base) => [step('Simmer the roots', `${base} Add the ${a}, garlic granules, mixed herbs, tomatoes and 900 ml water. Bring to a simmer and cook partly covered for 15 minutes.`), step('Add beans and greens', `Add the ${b} and drained white beans. Simmer for 10–15 minutes more until all vegetables are tender, adding water as needed. Check the ${a} with a fork.`), step('Serve with bread', `${portion} Divide the bread between six portions and keep it separate for storage.`)] },
  { id: 'peanut-tofu-noodles', slots: [quick, leaves], amounts: [600, 500], minutes: 40, method: 'Peanut noodles',
    title: ([a,b]) => `${cap(a)}, ${b} & peanut tofu noodles`, extras: [item('firm tofu', 600, 'g', 'Chilled'), item('dried wheat noodles', 450), item('peanut butter', 120), item('soy sauce', 60, 'ml'), item('cider vinegar', 30, 'ml')], equipment: [...pan, 'Second saucepan', 'Colander'],
    cook: ([a,b], base) => [step('Cook the vegetables and tofu', `Drain and cube the tofu. ${base} Add the ${a}, ${b}, tofu, garlic granules and 200 ml water. Cover and cook for 12–15 minutes until the vegetables are fully tender. Runner beans must be cooked through.`), step('Boil the noodles', 'Cook the noodles according to their packet, then drain. Mix peanut butter, soy sauce and cider vinegar with 200 ml hot water to make a smooth sauce.'), step('Toss and portion', `Add noodles and peanut sauce to the vegetables and tofu. Toss over a low heat until hot throughout, loosening with water if needed. ${portion}`)] },
  { id: 'crunchy-chickpea-couscous', slots: [raw, raw], amounts: [500, 500], minutes: 30, method: 'Crunchy couscous',
    title: ([a,b]) => `${cap(a)}, ${b} & chickpea couscous`, extras: [chickpeas, item('couscous', 450), item('vegetarian feta', 200, 'g', 'Chilled'), item('cider vinegar', 30, 'ml')], equipment: ['Kettle', 'Large heatproof bowl', 'Chopping board', 'Sharp knife'], image: 3,
    cook: ([a,b]) => [step('Make the couscous', 'Put the couscous in a heatproof bowl. Add boiling water following the ratio on its packet, cover for the packet time, then fluff with a fork.'), step('Prepare the vegetables', `Wash and finely chop the ${a} and ${b}; peel kohlrabi and grate any carrot rather than leaving hard cubes. Drain and rinse the chickpeas, and crumble the feta. No onion is used in this salad.`), step('Dress and portion', `Whisk olive oil, garlic granules and cider vinegar together. Divide couscous and chickpeas into six, then add vegetables, feta and dressing to the portions for today. Keep the remaining components separate. Refrigerate within 1–2 hours and eat within 48 hours. For later meals, freeze only the chickpea-couscous base and prepare fresh toppings when serving.`)] },
  { id: 'summer-ratatouille', slots: [['aubergine'], ['courgette', 'pepper']], amounts: [700, 700], minutes: 45, method: 'Summer ratatouille',
    title: ([a,b]) => `${cap(a)}, ${b} & white-bean ratatouille`, extras: [beans, tomatoes, item('dried mixed herbs', 2, 'tsp'), item('couscous', 450)], equipment: [...pan, 'Kettle', 'Heatproof bowl'],
    cook: ([a,b], base) => [step('Soften the vegetables', `${base} Add the ${a} and ${b}. Cook for 8 minutes, stirring and adding a splash of water if needed.`), step('Simmer in tomato', `Add garlic granules, mixed herbs, tomatoes and 200 ml water. Cover and simmer for 20 minutes until the aubergine is soft throughout. Add the drained white beans for the last 5 minutes.`), step('Serve over couscous', `Meanwhile prepare couscous with boiling water following its packet ratio and time. Fluff and serve with the ratatouille. ${portion}`)] },
  { id: 'summer-feta-tray', slots: [summer, summer], amounts: [700, 700], minutes: 45, method: 'Feta traybake',
    title: ([a,b]) => `${cap(a)}, ${b} & chickpea feta trays`, extras: [chickpeas, item('vegetarian feta', 250, 'g', 'Chilled'), item('dried mixed herbs', 2, 'tsp'), bread], equipment: oven,
    cook: ([a,b]) => [step('Roast the vegetables', `Heat the oven to 220°C / 200°C fan. Spread the ${a}, ${b}, any listed onion and drained chickpeas across two trays. Toss with olive oil, garlic granules and mixed herbs. Roast for 25 minutes, turning halfway.`), step('Add the feta', 'Crumble over the feta and roast for 5–10 minutes more, until the vegetables are completely tender and the cheese is hot.'), step('Serve and save', `${portion} Divide the bread between six portions and store separately.`)] },
  { id: 'mushroom-stroganoff', slots: [['mushroom'], leaves], amounts: [800, 450], minutes: 35, method: 'Smoky stroganoff',
    title: ([a,b]) => `${cap(a)}, ${b} & butter-bean stroganoff`, extras: [item('butter beans (drained)', 720), item('cream cheese', 200, 'g', 'Chilled'), item('smoked paprika', 3, 'tsp'), item('pasta', 500)], equipment: [...pan, 'Second saucepan', 'Colander'],
    cook: ([a,b], base) => [step('Cook the mushrooms and greens', `${base} Add the ${a} and cook for 5 minutes. Add the ${b}, garlic granules, smoked paprika and 200 ml water. Cover and simmer for 10–15 minutes until the greens are tender.`), step('Cook the pasta', 'Meanwhile cook the pasta according to its packet. Reserve a mug of cooking water before draining.'), step('Finish the sauce', `Stir the butter beans and cream cheese into the vegetables. Heat gently for 5 minutes, thinning with pasta water. Serve over the pasta. ${portion}`)] },
  { id: 'leek-potato-soup', slots: [['leek'], ['potato']], amounts: [650, 900], minutes: 40, method: 'Creamy potato soup',
    title: ([a,b]) => `${cap(a)}, ${b} & white-bean soup`, extras: [beans, item('vegetable stock powder', 3, 'tsp'), bread], equipment: [...pan, 'Potato masher'],
    cook: ([a,b], base) => [step('Soften the leeks', `${base} Add the ${a} and cook gently for 5 minutes, stirring.`), step('Simmer the potatoes', `Add the ${b}, garlic granules, stock powder and 1.3 litres water. Simmer for 20–25 minutes until the potato is soft. Add the white beans for the last 5 minutes.`), step('Mash and serve', `Mash some of the potatoes and beans in the pan to thicken the soup. Add water if needed. ${portion} Divide the bread between six portions.`)] },
  { id: 'seasonal-chickpea-curry', slots: [roots, [...leaves, ...florets]], amounts: [700, 500], minutes: 45, method: 'Chickpea curry', image: 0,
    title: ([a,b]) => `${cap(a)}, ${b} & chickpea curry`, extras: [chickpeas, tomatoes, item('coconut milk', 400, 'ml'), item('curry powder', 4, 'tsp'), item('couscous', 450)], equipment: [...pan, 'Kettle', 'Heatproof bowl'],
    cook: ([a,b], base) => [step('Simmer the roots', `${base} Add garlic granules and curry powder for 30 seconds, then ${a}, tomatoes, coconut milk and 300 ml water. Simmer partly covered for 15 minutes.`), step('Add greens and chickpeas', `Add ${b} and the drained chickpeas. Simmer for another 10–15 minutes until both vegetables are tender. Add water if needed and allow extra time for firm roots.`), step('Prepare couscous and serve', `While the curry simmers, prepare the couscous with boiling water following its packet ratio and standing time. Fluff and serve alongside the curry. ${portion}`)] },
  { id: 'chicken-root-tray', slots: [roots, florets], amounts: [650, 600], vegetarian: false, minutes: 45, method: 'Chicken traybake',
    title: ([a,b]) => `Paprika chicken, ${a} & ${b} trays`, extras: [chicken, chickpeas, item('smoked paprika', 3, 'tsp')], equipment: [...oven, 'Separate board for raw chicken', 'Food thermometer'],
    cook: ([a,b]) => [step('Prepare and roast', `Heat the oven to 220°C / 200°C fan. Cut chicken into 2 cm pieces on a separate board. Spread it with ${a}, ${b}, any listed onion and drained chickpeas across two trays. Toss with olive oil, garlic granules and smoked paprika. Roast for 30–35 minutes, turning halfway.`), step('Check thoroughly', `The ${a} must be tender. ${chickenCheck} Allow more cooking time if either chicken or roots need it.`), step('Portion', portion)] },
  { id: 'chicken-leafy-beans', slots: [roots, leaves], amounts: [650, 500], vegetarian: false, minutes: 45, method: 'Chicken & bean pot', image: 4,
    title: ([a,b]) => `Chicken, ${a} & ${b} bean pot`, extras: [chicken, beans, tomatoes, item('dried mixed herbs', 2, 'tsp')], equipment: [...pan, 'Separate board for raw chicken', 'Food thermometer'],
    cook: ([a,b], base) => [step('Start the pot', `Cut chicken into 2 cm pieces on a separate board. ${base} Add chicken, ${a}, garlic granules, mixed herbs, tomatoes and 400 ml water. Bring to a simmer and cook covered for 15 minutes.`), step('Add the greens', `Add ${b} and drained white beans. Simmer for 10–15 minutes more, until the vegetables are tender. ${chickenCheck}`), step('Portion', portion)] },
  { id: 'chicken-green-noodles', slots: [quick, leaves], amounts: [550, 500], vegetarian: false, minutes: 40, method: 'Chicken noodles',
    title: ([a,b]) => `Ginger chicken, ${a} & ${b} noodles`, extras: [chicken, item('dried wheat noodles', 450), item('soy sauce', 60, 'ml'), item('ground ginger', 2, 'tsp')], equipment: [...pan, 'Second saucepan', 'Colander', 'Separate board for raw chicken', 'Food thermometer'],
    cook: ([a,b], base) => [step('Cook chicken and vegetables', `Cut the chicken into 2 cm pieces on a separate board. ${base} Add chicken, ${a}, ${b}, garlic granules, ground ginger and 300 ml water. Cover and simmer for 20–25 minutes, stirring occasionally, until the vegetables and chicken are cooked through.`), step('Cook the noodles', 'Meanwhile, cook the noodles according to their packet and drain. Stir soy sauce into the chicken and vegetables.'), step('Check and combine', `${chickenCheck} Toss the noodles into the pan until hot throughout. ${portion}`)] },
  { id: 'chicken-floret-orzo', slots: [florets], amounts: [1100], vegetarian: false, minutes: 40, method: 'Chicken orzo',
    title: ([a]) => `Chicken & ${a} tomato orzo`, extras: [chicken, tomatoes, item('orzo', 450), item('dried mixed herbs', 2, 'tsp')], equipment: [...pan, 'Separate board for raw chicken', 'Food thermometer'],
    cook: ([a], base) => [step('Start the chicken', `Cut chicken into 2 cm pieces on a separate board. ${base} Add chicken, garlic granules, mixed herbs, tomatoes and 900 ml water. Bring to a simmer, cover and cook for 10 minutes.`), step('Add orzo and vegetables', `Add ${a} and the orzo. Simmer for the orzo packet time, usually 10–15 minutes, stirring frequently. Add hot water if the orzo catches; continue until the vegetables are tender.`), step('Check and portion', `${chickenCheck} ${portion}`)] },
];

function available(box: Box) {
  return new Set(box.vegetables.filter(p => !p.alternatives.length && p.quantity !== 0).map(p => p.name));
}
function combinations(slots: string[][], names: Set<string>, chosen: string[] = []): string[][] {
  if (!slots.length) return [chosen];
  return slots[0].filter(n => names.has(n) && !chosen.includes(n)).flatMap(n => combinations(slots.slice(1), names, [...chosen, n]));
}
function materialise(spec: Spec, names: string[], box: Box): Recipe {
  const onion = available(box).has('onion') && spec.id !== 'crunchy-chickpea-couscous';
  const base = onion ? 'Heat the olive oil in a large pan and soften the 250 g chopped onion for 5 minutes.' : 'Heat the olive oil in a large pan over a medium heat.';
  const ingredients = [...names.map((n,i) => veg(n, spec.amounts[i])), ...(onion ? [veg('onion', 250)] : []), oil, garlic, ...spec.extras];
  const prep = names.map((n,i) => `${spec.amounts[i]} g: ${chop(n)}`).join('; ');
  const recipe: Recipe = {
    id: spec.id, title: spec.title(names), subtitle: `Chosen for the box of ${box.week}`, vegetarian: spec.vegetarian !== false,
    minutes: spec.minutes, prep: 15, image: spec.image ?? null, ingredients, equipment: spec.equipment,
    method: spec.method, week: box.week, mainVegetables: names,
    steps: [step('Prepare the ingredients', `Weigh the vegetables before starting: ${prep}.${onion ? ' Peel and chop the onion.' : ''} Measure the remaining listed ingredients. Drain and rinse any tinned beans or chickpeas; quantities are drained weights.`), ...spec.cook(names, base)],
    storage: spec.id === 'crunchy-chickpea-couscous' ? 'Keep vegetables, feta and dressing separate from the couscous where practical. Refrigerate within 1–2 hours and eat within 48 hours. Freeze only the chickpea-couscous base for later meals; add fresh toppings after defrosting in the fridge. Use defrosted portions within 24 hours.' : storage,
    boxNames: ingredients.filter(i => available(box).has(i.name)).map(i => i.name),
  };
  return recipe;
}
export function candidates(box: Box): Recipe[] {
  const names = available(box);
  return collection.flatMap(spec => combinations(spec.slots, names).map(v => materialise(spec, v, box)));
}
export function validateMenu(box: Box, recipes: Recipe[]) {
  const names = available(box);
  if (new Set(recipes.map(r => r.id)).size !== recipes.length) throw new Error('Repeated recipe in weekly menu.');
  for (const r of recipes) {
    if (r.week !== box.week || !r.mainVegetables.length || r.mainVegetables.some(n => !names.has(n))) throw new Error('Recipe does not match the confirmed weekly box.');
    const ingredientNames = new Set(r.ingredients.map(i => i.name));
    if (r.ingredients.some(i => !Number.isFinite(i.quantity) || i.quantity <= 0) || r.mainVegetables.some(n => !ingredientNames.has(n))) throw new Error('Invalid recipe ingredients.');
    const directions = r.steps.map(s => s.text).join(' ');
    if (r.mainVegetables.some(n => !directions.includes(n))) throw new Error('Recipe directions do not match the box ingredients.');
  }
}
export function weeklyMenu(box: Box) {
  const all = candidates(box);
  const count = (vegetarian: boolean) => new Set(all.filter(r => r.vegetarian === vegetarian).map(r => r.id)).size;
  const quotas = [...Array(Math.min(4, count(true))).fill(true), ...Array(Math.min(1, count(false))).fill(false)] as boolean[];
  const weekIndex = Math.floor(Date.parse(`${box.week}T12:00:00Z`) / (7 * 86400000));
  const rotation = (r: Recipe) => { let hash = 2166136261; for (const c of `${weekIndex}:${r.id}`) hash = Math.imul(hash ^ c.charCodeAt(0), 16777619); return (hash >>> 0) % 1000; };
  const score = (menu: Recipe[]) => new Set(menu.flatMap(r => r.boxNames)).size * 100000 + menu.reduce((sum,r) => sum + rotation(r), 0);
  const key = (menu: Recipe[]) => menu.map(r => `${r.id}:${r.mainVegetables.join(',')}`).sort().join('|');
  let beam: Recipe[][] = [[]];
  for (const vegetarian of quotas) {
    const best = new Map<string, Recipe[]>();
    for (const menu of beam) for (const recipe of all.filter(r => r.vegetarian === vegetarian && !menu.some(m => m.id === r.id))) {
      const next = [...menu, recipe];
      const styles = next.map(r => r.id).sort().join('|');
      const old = best.get(styles);
      if (!old || score(next) > score(old) || (score(next) === score(old) && key(next) < key(old))) best.set(styles, next);
    }
    beam = [...best.values()].sort((a,b) => score(b) - score(a) || key(a).localeCompare(key(b))).slice(0, 80);
  }
  const recipes = beam[0] ?? [];
  validateMenu(box, recipes);
  const used = new Set(recipes.flatMap(r => r.boxNames));
  return { recipes, collectionSize: collection.length,
    used: [...available(box)].filter(n => used.has(n)),
    uncovered: [...available(box)].filter(n => !used.has(n)),
    unconfirmed: box.vegetables.filter(p => p.alternatives.length).map(p => p.original) };
}
export function suggestions(box: Box): Recipe[] { return weeklyMenu(box).recipes; }
