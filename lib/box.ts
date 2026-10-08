import type { Box, Produce } from "./types.ts";
export const SOURCE_URL = "https://www.neog.org.uk/veg-box-scheme/veg-fruit-bags";
const aliases: Record<string, string> = { potatoes: "potato", carrots: "carrot", onions: "onion", tomatoes: "tomato", aubergines: "aubergine", cucumbers: "cucumber", courgettes: "courgette", "rainbow chard": "chard", "swiss chard": "chard", "kohl rabi": "kohlrabi", "spring onions": "spring onion", "salad onion": "spring onion", "salad onions": "spring onion", "sweet corn": "sweetcorn", "chilli peppers": "chilli", chillies: "chilli", leeks: "leek", apples: "apple", bananas: "banana", lemons: "lemon", oranges: "orange", pears: "pear", mangoes: "mango" };
Object.assign(aliases, { swedes: "swede", cauliflowers: "cauliflower", beetroots: "beetroot", parsnips: "parsnip", turnips: "turnip", mushrooms: "mushroom", peppers: "pepper", radishes: "radish", "curly kale": "kale", "black kale": "cavolo nero", "cavolo nero kale": "cavolo nero", "cavalo nero": "cavolo nero", "swiss chard": "chard", "green pepper": "pepper", "red pepper": "pepper", "yellow pepper": "pepper" });
export function normalise(value: string) { const clean = value.toLowerCase().replace(/\s*[-–]\s*fair[ -]?trade/gi, "").replace(/\s+/g, " ").trim(); return aliases[clean] ?? clean; }
function plain(value: string) { return value.replace(/<[^>]*>/g, " ").replace(/&nbsp;|&#160;/gi, " ").replace(/&amp;/gi, "&").replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n))).replace(/\s+/g, " ").trim(); }
export function londonDate(now = new Date()) { const p = new Intl.DateTimeFormat("en-GB", { timeZone: "Europe/London", year: "numeric", month: "2-digit", day: "2-digit" }).formatToParts(now); const part = (name: string) => p.find(x => x.type === name)!.value; return `${part("year")}-${part("month")}-${part("day")}`; }
export function expectedWeek(now = new Date()) { const day = new Date(`${londonDate(now)}T12:00:00Z`); day.setUTCDate(day.getUTCDate() - ((day.getUTCDay() + 4) % 7)); return day.toISOString().slice(0, 10); }
export function monitorDue(now = new Date()) { const p = new Intl.DateTimeFormat("en-GB", { timeZone: "Europe/London", weekday: "short", hour: "2-digit", hourCycle: "h23" }).formatToParts(now); const day = p.find(x => x.type === "weekday")?.value; const hour = Number(p.find(x => x.type === "hour")?.value); return (day === "Wed" && hour >= 7 && hour <= 22) || (day === "Thu" && hour >= 7 && hour <= 12); }
export function parseBox(html: string, now = new Date()): Box {
  const match = plain(html).match(/week commencing\s+(?:Wednesday\s+)?(\d{1,2})\s+(\w+)\s+(\d{4})/i);
  if (!match) throw new Error("NEOG's publication date was not found. Your saved box has been kept.");
  const months = ["january", "february", "march", "april", "may", "june", "july", "august", "september", "october", "november", "december"];
  const month = months.indexOf(match[2].toLowerCase()); const date = new Date(Date.UTC(Number(match[3]), month, Number(match[1]), 12));
  if (month < 0 || date.getUTCMonth() !== month || date.getUTCDay() !== 3 || date.getTime() > now.getTime() + 7 * 86400000) throw new Error("NEOG's publication date needs checking. Your saved box has been kept.");
  function section(label: string): Produce[] {
    const headings = [...html.matchAll(/<h[1-6]\b[^>]*>[\s\S]*?<\/h[1-6]>/gi)]; const index = headings.findIndex(h => plain(h[0]).toLowerCase().includes(label.toLowerCase()));
    if (index < 0) throw new Error(`Could not find ${label}. Your saved box has been kept.`);
    const start = headings[index].index! + headings[index][0].length; const end = headings[index + 1]?.index ?? html.length;
    const table = html.slice(start, end).match(/<table\b[^>]*>([\s\S]*?)<\/table>/i)?.[1];
    if (!table) throw new Error(`Could not read ${label}. Your saved box has been kept.`);
    const result = [...table.matchAll(/<tr\b[^>]*>([\s\S]*?)<\/tr>/gi)].flatMap(row => {
      const cells = [...row[1].matchAll(/<td\b[^>]*>([\s\S]*?)<\/td>/gi)].map(c => plain(c[1])); if (!cells[0]) return [];
      const alternatives = cells[0].split(/\s*\/\s*|\s+or\s+/i).map(normalise);
      return [{ name: normalise(cells[0]), original: cells[0], origin: cells[1] ?? "", quantity: null, alternatives: alternatives.length > 1 ? alternatives : [] }];
    });
    if (result.length < 2 || result.length > 30) throw new Error(`${label} looks incomplete. Your saved box has been kept.`);
    return result;
  }
  return { week: date.toISOString().slice(0, 10), fetchedAt: now.toISOString(), vegetables: section("Large Vegetable Bag"), fruit: section("Large Fruit Bag"), source: "neog" };
}
