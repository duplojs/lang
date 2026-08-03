# Philosophie du projet

## 1. Rôle

Ce fichier donne le modèle mental global du projet et sert de routeur vers les philosophies de domaines.

Le charger avant une analyse ou une modification, puis charger uniquement les fichiers de domaine utiles à la tâche.

## 2. Principes généraux

`@duplojs/lang` expose des fonctions et des types utilitaires dont l'API TypeScript fait partie du produit.

Une fonction publique doit être jugée sur :

- son comportement runtime;
- ses formes d'appel;
- son inférence;
- ses erreurs TypeScript publiques;
- les informations qu'elle préserve, ajoute, retire ou refuse.

## 3. Domaines

Le code est organisé par domaines fonctionnels.

Un domaine contient les fonctions, types et contraintes qui correspondent à un même concept utilisateur.

Le domaine `common` regroupe les fonctions et types inclassables dans un domaine métier précis.

Il est rare d'ajouter une nouvelle fonction dans `common`. En revanche, il faut y chercher les helpers génériques, les types d'inférence et les bases transversales avant de recréer un utilitaire dans un autre domaine.

Ne pas traiter `common` comme un domaine métier.

## 4. Contraintes

Les contraintes ajoutent au type une garantie validée ou supposée par l'API.

Elles remplacent souvent une information que TypeScript ne peut pas exprimer naturellement avec les types primitifs du langage.

Lorsqu'une tâche touche une contrainte, une fonction predicate qui produit une contrainte, `Constraint`, `DynamicConstraint`, `RemoveConstraint`, `GetConstraint`, `ComputedTypeError` ou une réapplication de contraintes, lire aussi `domains/constraints.md`.

## 5. Routage

Lire un fichier de domaine seulement lorsqu'il est utile :

- `domains/array.md` pour `scripts/array`, les types array, les callbacks array et les contraintes de taille de tableau.
- `domains/chrono.md` pour `scripts/chrono`, `TheDate`, `TheTime`, les conversions, sérialisations, timezones et opérations temporelles.
- `domains/constraints.md` pour le système transversal des contraintes.
- `domains/dataStructure.md` pour `scripts/dataStructure`, les structures, types, contraintes runtime, helpers, codecs, checks, encode et decode.
- `domains/number.md` pour `scripts/number`, les types number, les predicates numériques et les contraintes numériques.
- `domains/string.md` pour `scripts/string`, les types string, les predicates string et les contraintes string.
