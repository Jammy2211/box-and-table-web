import type { Box, Ingredient, Recipe, ShoppingItem } from "./types.ts";
const veg = (name: string, quantity: number): Ingredient => ({ name, quantity, unit: "g", aisle: "Fruit & vegetables" });
const item = (name: string, quantity: number, unit: Ingredient["unit"], aisle: string, pack?: number, packLabel?: string): Ingredient => ({ name, quantity, unit, aisle, pack, packLabel });
const oil = item("olive oil", 30, "ml", "Cupboard", 500, "500 ml bottle");
const garlic = veg("garlic", 15);
const tomatoes = item("tinned chopped tomatoes", 800, "g", "Tins & jars", 400, "400 g tin");
const chickpeas = item("chickpeas (drained)", 720, "g", "Tins & jars", 240, "400 g tin (about 240 g drained)");
const beans = item("white beans (drained)", 720, "g", "Tins & jars", 240, "400 g tin (about 240 g drained)");
const storage = "Divide into shallow containers and cool within 1–2 hours, then refrigerate. Eat refrigerated portions within 48 hours; freeze the rest on cooking day for later meals. Defrost in the fridge and use within 24 hours. Reheat only once, until steaming hot throughout; add a splash of water if needed.";
function pick(box: Box, preferences: string[], fallback: string, avoid: string[] = []) { return preferences.find(name => box.vegetables.some(x => x.name === name && !x.alternatives.length && x.quantity !== 0) && !avoid.includes(name)) ?? fallback; }
function chop(name: string) {
  if (["kale", "chard", "spinach", "cabbage"].includes(name)) return `shred the ${name} (slice tough stems very finely)`;
  if (["broccoli", "cauliflower"].includes(name)) return `cut the ${name} into small florets and finely dice the stalk`;
  if (name === "leek") return "wash the leek well and thinly slice it";
  return `peel if needed and dice the ${name} into 1 cm pieces`;
}
export function cap(s: string) { return s.charAt(0).toUpperCase() + s.slice(1); }
export function suggestions(box: Box): Recipe[] {
  const onion = pick(box, ["onion", "leek", "spring onion"], "onion");
  const root = pick(box, ["carrot", "potato", "kohlrabi", "sweet potato", "butternut squash", "parsnip"], "carrot", [onion]);
  const green = pick(box, ["broccoli", "cauliflower", "courgette", "cabbage", "chard", "kale", "spinach", "leek"], "spinach", [onion, root]);
  const pastaVeg = pick(box, ["leek", "broccoli", "courgette", "chard", "kale", "spinach", "cabbage"], "spinach", [onion]);
  const stewRoot = pick(box, ["potato", "carrot", "kohlrabi", "parsnip", "sweet potato"], "carrot", [onion]);
  const stewGreen = pick(box, ["cabbage", "kale", "chard", "broccoli", "cauliflower"], "cabbage", [onion, stewRoot]);
  const salad = pick(box, ["cucumber", "tomato", "kohlrabi", "carrot"], "cucumber");
  const salad2 = pick(box, ["carrot", "tomato", "kohlrabi", "cucumber"], salad === "carrot" ? "tomato" : "carrot", [salad]);
  const base = { minutes: 45, prep: 15, storage, boxNames: [], equipment: ["Large hob pan (5–6 litres)", "Chopping board", "Sharp knife"] };
  const recipes: Recipe[] = [
    { ...base, id: "chickpea-curry", image: 0, vegetarian: true, title: `${cap(root)} & chickpea curry`, subtitle: `With ${green}, tomato and warm spices`, ingredients: [veg(root, 600), veg(green, 400), veg(onion, 250), garlic, oil, tomatoes, chickpeas, item("coconut milk", 400, "ml", "Tins & jars", 400, "400 ml tin"), item("curry powder", 4, "tsp", "Cupboard"), item("couscous", 360, "g", "Pasta, grains & bread", 500, "500 g bag")], steps: [
      { title: "Prepare the vegetables · 15 min", text: `Finely slice 250 g ${onion}, chop 15 g garlic, ${chop(root)} (600 g) and ${chop(green)} (400 g). Measure the remaining ingredients. Use a 5–6 litre pan so the six portions have room.` },
      { title: "Build the base · 5 min", text: `Heat 30 ml olive oil over a medium heat. Soften the ${onion} for 4 minutes, then add the garlic and 4 tsp curry powder. Stir for 1 minute.` },
      { title: "Simmer · 20–22 min", text: `Add the ${root}, 800 g tinned tomatoes, 400 ml coconut milk, 720 g drained chickpeas and 200 ml water. Bring to a simmer, cover and cook for 15 minutes, stirring occasionally. Add the ${green} and simmer for another 5–7 minutes until all vegetables are tender. Add a little more water if thick.` },
      { title: "Prepare the couscous · alongside", text: "During the final simmer, place 360 g couscous in a heatproof bowl. Add the volume of boiling water specified on its packet, cover and stand for the packet time (usually 5 minutes). Fluff with a fork." },
      { title: "Serve & portion", text: "Taste the curry and season to preference. Divide curry and couscous into six equal portions. Serve two and cool the other four promptly." },
    ] },
    { ...base, minutes: 40, prep: 12, id: "bean-pasta", image: 1, vegetarian: true, title: `Creamy ${pastaVeg} & white-bean pasta`, subtitle: "A generous tomato sauce with soft cheese", equipment: [...base.equipment, "Second saucepan", "Colander"], ingredients: [veg(pastaVeg, 700), veg(onion, 250), garlic, oil, tomatoes, beans, item("pasta", 500, "g", "Pasta, grains & bread", 500, "500 g bag"), item("cream cheese", 200, "g", "Chilled", 200, "200 g tub")], steps: [
      { title: "Chop & boil · 12 min", text: `Set a large saucepan of water to boil. Slice 250 g ${onion}, chop 15 g garlic and ${chop(pastaVeg)} (700 g). Drain and rinse the white beans; you need 720 g drained.` },
      { title: "Start the sauce · 6 min", text: `Heat 30 ml olive oil in a second large pan. Soften the ${onion} for 5 minutes and stir in the garlic for 1 minute.` },
      { title: "Cook together · 12–15 min", text: `Add 800 g tinned tomatoes, 200 ml water, the beans and ${pastaVeg}. Cover and simmer for 12–15 minutes, stirring, until the vegetables are tender. Meanwhile cook 500 g pasta according to its packet, saving 300 ml cooking water before draining.` },
      { title: "Make it creamy · 2 min", text: "Lower the sauce heat. Stir in 200 g cream cheese until smooth, then fold in the pasta. Loosen with reserved pasta water a little at a time. Taste and season to preference." },
      { title: "Divide into six", text: "Serve two portions and cool four for later. Pasta absorbs sauce in storage, so add a splash of water before reheating." },
    ] },
    { ...base, minutes: 45, prep: 15, id: "lentil-pot", image: 2, vegetarian: true, title: `${cap(stewRoot)} & red-lentil pot`, subtitle: `Smoky paprika, ${stewGreen} and crusty bread`, ingredients: [veg(stewRoot, 750), veg(stewGreen, 450), veg(onion, 250), garlic, oil, tomatoes, item("red lentils (dry)", 300, "g", "Cupboard", 500, "500 g bag"), item("smoked paprika", 3, "tsp", "Cupboard"), item("bread", 400, "g", "Pasta, grains & bread", 400, "400 g loaf")], steps: [
      { title: "Prepare · 15 min", text: `Rinse 300 g dry red lentils. Slice 250 g ${onion}, chop 15 g garlic, ${chop(stewRoot)} (750 g) and ${chop(stewGreen)} (450 g). Small, even pieces keep cooking time down.` },
      { title: "Soften the base · 5 min", text: `Heat 30 ml olive oil in your largest pan. Soften the ${onion} for 4 minutes, then add the garlic and 3 tsp smoked paprika for 1 minute.` },
      { title: "Simmer · 20–25 min", text: `Add the lentils, ${stewRoot}, 800 g tinned tomatoes and 1 litre water. Bring to a simmer and partly cover. Stir regularly so the lentils do not catch. After 15 minutes add the ${stewGreen}; cook until lentils and vegetables are fully tender, adding water if necessary.` },
      { title: "Finish & portion", text: "Taste and season to preference. Divide into six portions and serve with 400 g bread divided between them. Freeze bread separately from the stew." },
    ] },
    { ...base, minutes: 30, prep: 20, id: "chickpea-couscous", image: 3, vegetarian: true, title: `Lemony ${salad} & chickpea couscous`, subtitle: `Crunchy ${salad2}, feta and a quick lemon dressing`, equipment: ["Kettle", "Large heatproof bowl", "Chopping board", "Sharp knife"], storage: "Keep dressing and chopped vegetables separate from the couscous where practical. Cool couscous within 1–2 hours and refrigerate. Eat refrigerated portions within 48 hours. For later meals, freeze the chickpea couscous base promptly; prepare fresh crunchy vegetables and add feta and dressing after defrosting. Defrost in the fridge and use within 24 hours.", ingredients: [veg(salad, 500), veg(salad2, 400), veg("lemon", 150), item("olive oil", 45, "ml", "Cupboard", 500, "500 ml bottle"), chickpeas, item("couscous", 450, "g", "Pasta, grains & bread", 500, "500 g bag"), item("vegetarian feta", 200, "g", "Chilled", 200, "200 g pack")], steps: [
      { title: "Fluff the couscous · 5–10 min", text: "Put 450 g couscous in a large heatproof bowl. Add boiling water following the ratio on its packet. Cover and leave for the packet time, then fluff well with a fork." },
      { title: "Prepare the crunch · 15 min", text: `Wash and finely dice 500 g ${salad} and 400 g ${salad2}; peel kohlrabi if using it. Grate carrots instead of dicing if preferred. Drain and rinse 720 g chickpeas. Crumble 200 g vegetarian feta.` },
      { title: "Mix the dressing · 3 min", text: "Wash the lemon (about 150 g, usually one large fruit). Finely grate its zest and squeeze its juice. Mix the zest and 3 tbsp juice with 45 ml olive oil. Taste and season to preference; save remaining juice for another meal." },
      { title: "Build six portions", text: "Mix chickpeas into the couscous and divide into six. Add vegetables, feta and dressing to the portions you are eating now. Store the remaining components separately; see the storage note for freezing later portions." },
    ] },
    { ...base, minutes: 45, prep: 15, id: "chicken-beans", image: 4, vegetarian: false, title: `Chicken, ${root} & white-bean stew`, subtitle: `A tomato-rich pot with ${green}`, ingredients: [veg(root, 500), veg(green, 400), veg(onion, 250), garlic, oil, tomatoes, beans, item("boneless chicken thigh", 900, "g", "Meat & fish", 600, "600 g pack"), item("smoked paprika", 3, "tsp", "Cupboard")], steps: [
      { title: "Prepare · 15 min", text: `Slice 250 g ${onion}, chop 15 g garlic, ${chop(root)} (500 g) and ${chop(green)} (400 g). On a separate board cut 900 g boneless chicken thigh into 2 cm pieces. Wash hands and clean utensils after handling raw chicken.` },
      { title: "Start the sauce · 5 min", text: `Heat 30 ml olive oil in a 5–6 litre pan. Soften the ${onion} for 4 minutes. Add the garlic and 3 tsp smoked paprika for 1 minute.` },
      { title: "Poach gently · 20–25 min", text: `Add 800 g tinned tomatoes, 400 ml water, the ${root} and chicken. Bring back to a simmer, cover and cook for 15 minutes. Stir in 720 g drained beans and the ${green}, then simmer for 5–10 minutes more until vegetables are tender and chicken is cooked through.` },
      { title: "Check & portion", text: "Check the thickest chicken pieces: steaming hot throughout, no pink flesh and clear juices (a food thermometer should show 75°C for at least 30 seconds). Continue cooking if needed. Taste, season to preference and divide into six portions." },
    ] },
  ];
  const names = new Set([...box.vegetables, ...box.fruit].filter(x => !x.alternatives.length && x.quantity !== 0).map(x => x.name));
  return recipes.map(r => ({ ...r, boxNames: r.ingredients.filter(i => names.has(i.name)).map(i => i.name) }));
}
export function shoppingList(recipes: Recipe[], box: Box, pantry: string[]): ShoppingItem[] {
  const sums = new Map<string, ShoppingItem>();
  for (const recipe of recipes) for (const ingredient of recipe.ingredients) {
    const key = `${ingredient.name}:${ingredient.unit}`; const old = sums.get(key);
    if (old) { old.needed += ingredient.quantity; old.recipes.push(recipe.title); }
    else sums.set(key, { ...ingredient, needed: ingredient.quantity, boxAmount: 0, remaining: 0, status: "buy", packs: null, recipes: [recipe.title] });
  }
  return [...sums.values()].map(i => {
    const found = [...box.vegetables, ...box.fruit].find(p => p.name === i.name && !p.alternatives.length);
    const boxAmount = i.unit === "g" ? (found?.quantity ?? 0) : 0;
    const remaining = pantry.includes(i.name) ? 0 : Math.max(0, i.needed - boxAmount);
    const status: ShoppingItem["status"] = remaining === 0 ? "covered" : found && found.quantity === null ? "check" : "buy";
    return { ...i, boxAmount, remaining, status, packs: status === "buy" && i.pack ? Math.ceil(remaining / i.pack) : null };
  }).sort((a, b) => a.aisle.localeCompare(b.aisle) || a.name.localeCompare(b.name));
}
