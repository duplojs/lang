# Philosophie du domaine string

## 1. Rôle

Le domaine `string` contient les fonctions et types propres à la manipulation des chaînes.

Une API string doit raisonner sur la valeur textuelle, mais aussi sur les garanties que son type peut porter : taille, format, contenu ou relation avec un template literal.

## 2. Contraintes string

Le domaine possède ses propres contraintes.

Les contraintes de taille enrichissent une string avec une garantie sur `length`.

`Format` associe un nom de format à un template literal exploitable par le typage.

`ContainsOnly` repose sur un registre de ranges propre au domaine.

Ces contraintes peuvent se cumuler lorsqu'elles décrivent des garanties compatibles sur la même string.

## 3. Transformations

Une transformation string doit calculer depuis la valeur sans contrainte lorsque le type primitif est nécessaire, puis réappliquer uniquement les garanties encore vraies.

Ne pas conserver un format, une contrainte de contenu ou une contrainte de taille si l'opération peut l'invalider.

Les helpers comme `ReapplyAllSizeConstraints` servent à rendre ce choix explicite.
