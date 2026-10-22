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

  // Couplé au catalogue : ce panier vaut exactement 60,00 € après remise.
  // Si un prix change, l'assertion ci-dessous échoue : reconstruire le panier au seuil.
  it('offre la livraison quand le sous-total après remise atteint exactement 60,00 €', () => {
    const r = calculerPanier({
      lignes: [
        { ref: 'COFFRET', qte: 1 },
        { ref: 'TASSES', qte: 1 },
        { ref: 'LIVRE', qte: 1 },
      ],
      pays: 'FR',
      code: 'FIDELE',
    });
    expect(r.sousTotal).toBe(6500);
    expect(r.remise).toBe(500);
    expect(r.sousTotal - r.remise).toBe(6000);
    expect(r.livraison).toBe(0);
    expect(r.total).toBe(6000);
  });

  describe('Premium', () => {
    it("n'offre pas la livraison sous 30,00 €", () => {
      const r = calculerPanier({ lignes: [{ ref: 'TASSES', qte: 1 }], pays: 'FR', premium: true });
      expect(r.remise).toBe(0);
      expect(r.livraison).toBe(490);
      expect(r.total).toBe(2290);
    });

    it('offre la livraison dès 30,00 €', () => {
      const r = calculerPanier({ lignes: [{ ref: 'LIVRE', qte: 2 }], pays: 'FR', premium: true });
      expect(r.livraison).toBe(0);
      expect(r.total).toBe(3000);
    });

    it('garde le code quand il gagne de 0,10 €', () => {
      const r = calculerPanier({ lignes: [{ ref: 'COFFRET', qte: 1 }], pays: 'FR', code: 'FIDELE', premium: true });
      expect(r.remise).toBe(500);
      expect(r.livraison).toBe(490);
      expect(r.total).toBe(3190);
    });

    it('garde le code même quand la remise est plus petite que la livraison', () => {
      const r = calculerPanier({ lignes: [{ ref: 'TASSES', qte: 1 }], pays: 'FR', code: 'BIENVENUE', premium: true });
      expect(r.remise).toBe(180);
      expect(r.livraison).toBe(490);
      expect(r.total).toBe(2110);
    });

    it('abandonne le code quand Premium est plus avantageux', () => {
      const r = calculerPanier({ lignes: [{ ref: 'COFFRET', qte: 1 }], pays: 'FR', code: 'BIENVENUE', premium: true });
      expect(r.remise).toBe(0);
      expect(r.livraison).toBe(0);
      expect(r.total).toBe(3200);
    });

    it('garde le code quand la remise fait repasser sous 60,00 €', () => {
      const r = calculerPanier({
        lignes: [
          { ref: 'THEIERE', qte: 1 },
          { ref: 'LIVRE', qte: 1 },
        ],
        pays: 'FR',
        code: 'BIENVENUE',
        premium: true,
      });
      expect(r.remise).toBe(600);
      expect(r.livraison).toBe(490);
      expect(r.total).toBe(5890);
    });

    it('utilise le tarif Europe dans la comparaison', () => {
      const r = calculerPanier({
        lignes: [
          { ref: 'THEIERE', qte: 1 },
          { ref: 'LIVRE', qte: 1 },
        ],
        pays: 'EU',
        code: 'FIDELE',
        premium: true,
      });
      expect(r.remise).toBe(0);
      expect(r.livraison).toBe(0);
      expect(r.total).toBe(6000);
    });

    it('refuse un code inconnu même en Premium', () => {
      expect(() =>
        calculerPanier({ lignes: [{ ref: 'LIVRE', qte: 1 }], pays: 'FR', code: 'NOEL', premium: true }),
      ).toThrow('Code promo inconnu');
    });

    it("garde le code en cas d'égalité", () => {
      const r = calculerPanier({
        lignes: [
          { ref: 'THE-VERT', qte: 0 },
          { ref: 'LIVRE', qte: 0 },
        ],
        pays: 'FR',
        code: 'FIDELE',
        premium: true,
      });
      expect(r.remise).toBe(0);
      expect(r.livraison).toBe(490);
      expect(r.total).toBe(490);
    });
  });
});
