/** Technique illustrations stay separate from saved recipe snapshots, so older plans
 * get pictures too. Each asset is a regular contact sheet, clipped by the UI.
 */
const stepImages: Record<string, { rows: number; width: number; height: number; rowEdges: number[]; descriptions: string[] }> = {
  "chickpea-curry": {
    rows: 3, width: 1024, height: 1536, rowEdges: [0, 493, 950, 1536],
    descriptions: [
      "Diced root vegetables, broccoli, sliced onion and chopped garlic prepared separately on a board.",
      "Onion and garlic softening with curry spices in a deep pan.",
      "Chickpeas and vegetables simmering in a tomato and coconut sauce.",
      "A fork fluffing hydrated couscous in a heatproof bowl.",
      "Curry and couscous divided between two serving bowls and four shallow storage containers.",
    ],
  },
  "bean-pasta": {
    rows: 3, width: 1024, height: 1536, rowEdges: [0, 512, 945, 1536],
    descriptions: [
      "Chopped vegetables and drained white beans ready beside a pot of water.",
      "Sliced onion and garlic softening in olive oil.",
      "Vegetable and white-bean tomato sauce simmering beside a separate pan of pasta.",
      "Cream cheese stirred into the tomato sauce, with cooked pasta ready to combine.",
      "Six portions of creamy white-bean pasta in two bowls and four shallow containers.",
    ],
  },
  "lentil-pot": {
    rows: 2, width: 1254, height: 1254, rowEdges: [0, 627, 1254],
    descriptions: [
      "Small potato cubes, shredded leafy greens and aromatics beside rinsed red lentils.",
      "Onion and garlic softening with smoked paprika in a large pan.",
      "Lentils, root vegetables and leafy greens simmering together in tomato broth.",
      "Six portions of lentil stew, with sliced bread kept separately.",
    ],
  },
  "chickpea-couscous": {
    rows: 2, width: 1254, height: 1254, rowEdges: [0, 627, 1254],
    descriptions: [
      "A fork fluffing hydrated plain couscous in a heatproof bowl.",
      "Chopped crunchy vegetables, drained chickpeas and crumbled feta prepared separately.",
      "Lemon juice and olive oil whisked into a dressing beside lemon halves and a zester.",
      "Two finished couscous bowls and four portions of chickpea couscous, with remaining toppings stored separately.",
    ],
  },
  "chicken-beans": {
    rows: 2, width: 1254, height: 1254, rowEdges: [0, 578, 1254],
    descriptions: [
      "Vegetables and raw chicken prepared on separate boards to avoid cross-contamination.",
      "Onion and garlic softening with smoked paprika in olive oil.",
      "Chicken pieces, vegetables and white beans gently poaching in tomato sauce.",
      "A food thermometer checking a thick piece of chicken before the stew is portioned.",
    ],
  },
};

export function stepImage(recipeId: string, stepIndex: number) {
  const sheet = stepImages[recipeId];
  if (!sheet || !Number.isInteger(stepIndex) || !sheet.descriptions[stepIndex]) return null;
  const column = stepIndex % 2;
  const row = Math.floor(stepIndex / 2);
  // Generated sheets can have slightly unequal rows. Crop an inset square from
  // each measured panel so adjacent scenes and seams cannot enter the frame.
  const inset = 6;
  const panelWidth = sheet.width / 2;
  const panelHeight = sheet.rowEdges[row + 1] - sheet.rowEdges[row];
  const size = Math.min(panelWidth, panelHeight) - inset * 2;
  const x = column * panelWidth + (panelWidth - size) / 2;
  const y = sheet.rowEdges[row] + (panelHeight - size) / 2;
  return {
    src: `/steps/${recipeId}-v1.png`,
    alt: `Illustration: ${sheet.descriptions[stepIndex]}`,
    style: {
      width: `${sheet.width / size * 100}%`,
      height: `${sheet.height / size * 100}%`,
      left: `${-x / size * 100}%`,
      top: `${-y / size * 100}%`,
    },
  };
}
