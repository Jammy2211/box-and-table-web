export type Produce = { name: string; original: string; origin: string; quantity: number | null; alternatives: string[] };
export type Box = { week: string; fetchedAt: string; vegetables: Produce[]; fruit: Produce[]; source: "neog" | "manual" };
export type Ingredient = { name: string; quantity: number; unit: "g" | "ml" | "tsp"; aisle: string; pack?: number; packLabel?: string };
export type Recipe = { id: string; title: string; subtitle: string; vegetarian: boolean; minutes: number; prep: number; image: number; ingredients: Ingredient[]; steps: { title: string; text: string }[]; equipment: string[]; storage: string; boxNames: string[] };
export type Plan = { box: Box; selected: Recipe[]; checked: string[]; };
export type State = { revision: number; feedback: Record<string, CookingFeedback>; activeWeek: string | null; plans: Record<string, Plan>; pantry: string[]; equipment: string[]; monitor: { lastAttempt: string | null; lastSuccess: string | null; error: string | null; newWeekAt: string | null } };
export type ShoppingItem = Ingredient & { needed: number; boxAmount: number; remaining: number; status: "buy" | "check" | "covered"; packs: number | null; recipes: string[] };
export type View = { state: State; cooking: Record<string, CookingSummary>; suggestions: Recipe[]; expectedWeek: string; stale: boolean; shopping: ShoppingItem[]; history: { week: string; selected: number }[] };

export type CookingFeedback = { week: string; recipeId: string; title: string; rating: number; actualMinutes: number | null; notes: string; updatedAt: string };
export type CookingSummary = { cooks: number; rating: number; actualMinutes: number | null; latestNote: string };
