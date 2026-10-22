# Règles de calcul du panier

Tous les montants sont **TTC, en centimes, en nombres entiers**. 12,50 € s'écrit `1250`.

1. **Sous-total** : la somme des lignes, prix du catalogue × quantité.
2. **Code promo** : facultatif, un seul par panier.
   - `BIENVENUE` : 10 % du sous-total, arrondi au centime inférieur.
   - `FIDELE` : 5,00 €.
   La remise ne peut pas dépasser le sous-total. Un code inconnu est une erreur.
3. **Livraison** : 4,90 € en France, 9,90 € ailleurs en Europe.
   **Offerte dès que le sous-total après remise atteint 60,00 €.**
4. **Total** : sous-total − remise + livraison.

## Catalogue

| Référence | Produit | Prix TTC |
|---|---|---|
| `THE-VERT` | Thé vert 100 g | 12,50 € |
| `THEIERE` | Théière en fonte | 45,00 € |
| `TASSES` | Duo de tasses | 18,00 € |
| `COFFRET` | Coffret découverte | 32,00 € |
| `LIVRE` | Recettes au thé | 15,00 € |
