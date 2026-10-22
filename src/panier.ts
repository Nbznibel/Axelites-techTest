/** Calcul du total d'un panier. Les règles sont dans REGLES.md. Montants en centimes. */

export type Ligne = { ref: string; qte: number };
export type Panier = { lignes: Ligne[]; pays: 'FR' | 'EU'; code?: string; premium?: boolean };
export type Resultat = { sousTotal: number; remise: number; livraison: number; total: number };

const CATALOGUE: Record<string, number> = {
  'THE-VERT': 1250,
  'THEIERE': 4500,
  'TASSES': 1800,
  'COFFRET': 3200,
  'LIVRE': 1500,
};

const CODES: Record<string, { type: 'pourcent' | 'montant'; valeur: number }> = {
  BIENVENUE: { type: 'pourcent', valeur: 10 },
  FIDELE: { type: 'montant', valeur: 500 },
};

const LIVRAISON = { FR: 490, EU: 990 };
const SEUIL_LIVRAISON_OFFERTE = 6000;
const SEUIL_LIVRAISON_OFFERTE_PREMIUM = 3000;

export function calculerPanier(panier: Panier): Resultat {
  if (panier.lignes.length === 0) throw new Error('Panier vide');

  const sousTotal = panier.lignes.reduce((somme, ligne) => somme + prix(ligne.ref) * ligne.qte, 0);
  const premium = panier.premium === true;

  if (premium && panier.code) {
    const avecCode = calculerScenario(sousTotal, panier.code, panier.pays, SEUIL_LIVRAISON_OFFERTE);
    const sansCode = calculerScenario(sousTotal, undefined, panier.pays, SEUIL_LIVRAISON_OFFERTE_PREMIUM);

    return avecCode.total <= sansCode.total ? avecCode : sansCode;
  }

  const seuil = premium ? SEUIL_LIVRAISON_OFFERTE_PREMIUM : SEUIL_LIVRAISON_OFFERTE;
  return calculerScenario(sousTotal, panier.code, panier.pays, seuil);
}

function calculerScenario(sousTotal: number, code: string | undefined, pays: Panier['pays'], seuil: number): Resultat {
  const remise = calculerRemise(sousTotal, code);
  const apresRemise = sousTotal - remise;
  const livraison = apresRemise >= seuil ? 0 : LIVRAISON[pays];

  return { sousTotal, remise, livraison, total: apresRemise + livraison };
}

function prix(ref: string): number {
  const p = CATALOGUE[ref];
  if (p === undefined) throw new Error(`Référence inconnue : ${ref}`);
  return p;
}

function calculerRemise(sousTotal: number, code?: string): number {
  if (!code) return 0;
  const promo = CODES[code.toUpperCase()];
  if (!promo) throw new Error(`Code promo inconnu : ${code}`);
  const remise = promo.type === 'pourcent' ? Math.floor((sousTotal * promo.valeur) / 100) : promo.valeur;
  return Math.min(remise, sousTotal);
}
