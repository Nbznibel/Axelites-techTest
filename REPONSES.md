# Réponses

Répondez en quelques lignes par question, en français, avec vos mots. Pas besoin de rédiger : des phrases courtes et précises.

## 1. Le bug

Quelle ligne de `src/panier.ts` était fausse, et pourquoi le panier de Camille précisément déclenchait le problème alors que les tests passaient ?

> Le bug :La ligne 29 de src/panier.ts
> Le seuil doit être inclusif
> Le panier de Camille vaut 6 000, exactement le seuil : 6000 > 6000 est faux
> Les 8 tests passaient parce qu'aucun ne tombe pile sur 6 000

## 2. Les clients concernés

Si vous deviez retrouver toutes les commandes touchées par ce bug depuis six mois, quelle condition exacte chercheriez-vous ?

> Les clients concernés:
> Les commandes où le montant après remise vaut exactement 6 000 centimes et où la livraison a quand même été facturée

## 3. La règle Premium

Dans la mission 2, quel cas vous a obligé à prendre une décision que les règles n'écrivent pas ? Qu'avez-vous décidé, et pourquoi ?

> La règle Premium:
> -L'égalité des deux totaux :J'ai gardé le code promo pour que le choix soit déterministe et que la remise demandée apparaisse sur la commande
> -J'ai aussi tranché qu'un code inconnu reste une erreur même en Premium: pas de repli silencieux sur le tarif Premium En revanche, quand Premium gagne, le résultat ne signale pas que le code a été écarté (remise: 0) : c'est un manque à combler à l'affichage.

## 4. L'IA

Donnez un exemple précis d'une proposition de votre assistant IA que vous avez refusée ou modifiée, et expliquez pourquoi. Si vous n'avez pas utilisé d'IA, dites-le.

> L'assistant avait ajouté un test qui comparait le même panier en France et en Europe pour montrer que le gagnant change selon le pays.
> Je l'ai fait retirer : un client n'a qu'un pays, ce n'est pas un cas réel, et le code ne compare jamais deux pays
> Il proposait aussi un fichier de tests séparé pour la mission 2 ; j'ai gardé un seul fichier.

## 5. Demain

Citez une évolution plausible des règles qui casserait votre code tel que vous l'avez écrit. Que faudrait-il changer ?

> Un code qui dépend du contenu du panier (par exemple −20 % sur THEIERE seulement, ou un minimum d'achat) ou des remises cumulables. calculerRemise ne reçoit que le sous-total, et l'arbitrage ne compare que deux scénarios. Il faudrait passer le panier entier à calculerRemise, modéliser les règles comme une liste de scénarios comparés entre eux, et renvoyer les codes réellement appliqués.
