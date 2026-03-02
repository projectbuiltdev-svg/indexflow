const DEMAND_INDEX: Record<string, number> = {
  plumber: 92,
  electrician: 90,
  solicitor: 88,
  dentist: 87,
  accountant: 85,
  physiotherapist: 82,
  veterinarian: 80,
  mechanic: 79,
  locksmith: 78,
  "estate agent": 77,
  chiropractor: 75,
  optician: 74,
  architect: 73,
  surveyor: 72,
  "driving instructor": 70,
  "personal trainer": 68,
  photographer: 65,
  florist: 62,
  tailor: 58,
  "dog groomer": 55,
  tutor: 53,
  cleaner: 50,
  gardener: 48,
  painter: 45,
  handyman: 42,
};

const MAX_POPULATION = 10_000_000;
const POPULATION_WEIGHT = 0.6;
const DEMAND_WEIGHT = 0.4;

export function getBusinessCategoryDemandIndex(category: string): number {
  const key = category.toLowerCase().trim();
  return DEMAND_INDEX[key] ?? 50;
}

export function commercialIntentScore(
  population: number,
  businessCategoryDemandIndex: number
): number {
  const normPop = Math.min(population, MAX_POPULATION) / MAX_POPULATION;
  const normDemand = Math.min(Math.max(businessCategoryDemandIndex, 0), 100) / 100;

  const raw = normPop * POPULATION_WEIGHT + normDemand * DEMAND_WEIGHT;
  return Math.round(raw * 100 * 100) / 100;
}

export function scoreLocation(
  location: { population: number },
  category: string
): number {
  const demandIndex = getBusinessCategoryDemandIndex(category);
  return commercialIntentScore(location.population, demandIndex);
}
