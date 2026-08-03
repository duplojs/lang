# Philosophie du domaine array

## 1. Rôle

Le domaine `array` contient les fonctions et types propres à la manipulation des tableaux.

Une API array doit raisonner sur les éléments, mais aussi sur les garanties que la collection peut porter : taille minimale, taille maximale, longueur exacte.

## 2. Contraintes array

Les contraintes de taille enrichissent un tableau avec une garantie sur `length`.

`MinElements`, `MaxElements` et `LengthEqual` doivent rester cohérentes entre elles.

Ces contraintes peuvent se cumuler lorsqu'elles décrivent des garanties compatibles sur le même tableau.

## 3. Transformations

Une transformation array doit préserver uniquement les garanties structurelles encore vraies.

Une fonction qui conserve le nombre d'éléments peut réappliquer les contraintes de taille.

Une fonction qui peut supprimer des éléments ne doit pas conserver `LengthEqual` ni `MinElements`.

Une fonction qui peut ajouter des éléments ne doit pas conserver `LengthEqual` ni `MaxElements`.

Les helpers comme `ReapplyAllSizeConstraints` servent à rendre ce choix explicite.

## 4. Callbacks

Les callbacks array reçoivent souvent la valeur courante et un objet `params` contenant les informations secondaires utiles.

Préserver le type de `self`, l'index et le type d'élément lorsque ces informations participent au contrat public.
