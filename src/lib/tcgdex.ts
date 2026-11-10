const BASE_URL = "https://api.tcgdex.net/v2/de";

// Kurzfassung aus der Suche
export type CardBrief = {
  id: string;
  localId: string;
  name: string;
  image?: string; // Basis-URL ohne Qualität und Endung
};

export type CardmarketPricing = {
  updated: string;
  unit: string; // "EUR"
  avg?: number;
  low?: number;
  trend?: number;
  avg7?: number;
  avg30?: number;
};

// Vollständige Karte aus der Detailanfrage
export type Card = CardBrief & {
  rarity?: string;
  set: { id: string; name: string };
  pricing?: {
    cardmarket?: CardmarketPricing | null;
  };
};

export function cardImageUrl(card: CardBrief, quality: "low" | "high" = "low") {
  return card.image ? `${card.image}/${quality}.webp` : undefined;
}

export async function searchCards(name: string): Promise<CardBrief[]> {
  const res = await fetch(`${BASE_URL}/cards?name=${encodeURIComponent(name)}`);
  if (!res.ok) throw new Error(`Suche fehlgeschlagen (${res.status})`);
  return res.json();
}

export async function getCard(id: string): Promise<Card> {
  const res = await fetch(`${BASE_URL}/cards/${encodeURIComponent(id)}`);
  if (!res.ok) throw new Error(`Karte nicht gefunden (${res.status})`);
  return res.json();
}