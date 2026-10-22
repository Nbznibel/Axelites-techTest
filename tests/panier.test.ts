import { describe, expect, it } from 'vitest';
import { calculerPanier } from '../src/panier';

describe('calculerPanier', () => {
  it('additionne les lignes', () => {
    const r = calculerPanier({ lignes: [{ ref: 'THE-VERT', qte: 2 }], pays: 'FR' });
    expect(r.sousTotal).toBe(2500);
  });

  it('facture la livraison en France', () => {
    const r = calculerPanier({ lignes: [{ ref: 'THE-VERT', qte: 2 }], pays: 'FR' });
    expect(r.livraison).toBe(490);
    expect(r.total).toBe(2990);
  });

  it('facture la livraison en Europe', () => {
    const r = calculerPanier({ lignes: [{ ref: 'TASSES', qte: 1 }], pays: 'EU' });
    expect(r.livraison).toBe(990);
  });

  it('offre la livraison pour un gros panier', () => {
    const r = calculerPanier({ lignes: [{ ref: 'THEIERE', qte: 2 }], pays: 'FR' });
    expect(r.livraison).toBe(0);
    expect(r.total).toBe(9000);
  });

  it('applique BIENVENUE à 10 %', () => {
    const r = calculerPanier({ lignes: [{ ref: 'THEIERE', qte: 2 }], pays: 'FR', code: 'BIENVENUE' });
    expect(r.remise).toBe(900);
    expect(r.total).toBe(8100);
  });

  it('applique FIDELE à 5 €', () => {
    const r = calculerPanier({ lignes: [{ ref: 'COFFRET', qte: 1 }], pays: 'FR', code: 'FIDELE' });
    expect(r.remise).toBe(500);
    expect(r.total).toBe(2700 + 490);
  });

  it('ne remise jamais plus que le sous-total', () => {
    const r = calculerPanier({ lignes: [{ ref: 'THE-VERT', qte: 0 }, { ref: 'LIVRE', qte: 0 }], pays: 'FR', code: 'FIDELE' });
    expect(r.remise).toBe(0);
  });

  it('refuse un code inconnu', () => {
    expect(() => calculerPanier({ lignes: [{ ref: 'LIVRE', qte: 1 }], pays: 'FR', code: 'NOEL' })).toThrow();
  });
});
