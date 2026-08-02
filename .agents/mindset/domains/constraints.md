# Philosophie des contraintes

## 1. Rôle

Une contrainte est une marque uniquement typée qui représente une garantie supplémentaire sur une valeur.

Elle ne remplace pas la valeur primitive. Elle enrichit son type.

Elle n'a pas d'effet runtime et ne wrappe pas la valeur.

Elle sert à faire porter par la donnée le résultat d'une validation déjà faite, au lieu de refaire porter cette vérification à chaque fonction appelée ensuite.

Exemples :

- `string & DString.MaxCharacters<5>`;
- `number & DNumber.GreaterThan<3>`;
- `readonly unknown[] & DArray.MinElements<1>`.

## 2. Source de vérité

Une contrainte doit correspondre à une garantie réellement obtenue ou conservée.

Une fonction peut :

- ajouter une contrainte après validation;
- conserver une contrainte si la transformation la garantit encore;
- retirer une contrainte si la transformation peut l'invalider;
- refuser une combinaison impossible avec une erreur TypeScript explicite;
- réduire un narrowing impossible à `never`.

Ne jamais conserver une contrainte seulement parce que cela rend le type plus précis.

Les contraintes sont composables. Une même donnée peut porter plusieurs contraintes si elles concernent cette donnée et restent cohérentes entre elles.

Ne pas mélanger des contraintes de domaines incompatibles : une contrainte de tableau ne doit pas être appliquée à une string, une contrainte de string ne doit pas être appliquée à un number.

## 3. Intention d'API

Les contraintes permettent d'écrire des fonctions plus ciblées.

Une fonction peut exiger une donnée déjà validée plutôt que recevoir une valeur large et gérer elle-même tous les cas invalides.

Cela rend le parcours de la donnée lisible dans son type : une valeur peut montrer qu'elle a été bornée, formatée, filtrée ou structurée par des étapes précédentes.

## 4. Contraintes statiques et dynamiques

`Constraint` représente une garantie nommée.

`DynamicConstraint` représente une garantie nommée paramétrée par une valeur littérale.

Les contraintes dynamiques servent notamment aux seuils et aux tailles :

- `MaxCharacters<5>`;
- `MinElements<2>`;
- `GreaterThan<3>`.

Quand la valeur paramétrique doit être connue par le type, refuser le type large correspondant avec `RequireLiteralNumber` ou une règle équivalente.

## 5. Compatibilité

Vérifier les combinaisons compatibles et incompatibles pendant la conception du contrat public.

Une contrainte plus faible ne doit pas remplacer une contrainte plus forte.

Une contrainte incompatible doit être visible dans le contrat public :

- erreur TypeScript pour un appel invalide;
- narrowing vers `never` lorsque le cas ne peut pas exister;
- branche `else` correctement discriminée lorsque le predicate échoue.

Utiliser `ComputedTypeError` lorsque l'erreur publique serait trop opaque sans message dédié.

## 6. Transformations

Avant de propager une contrainte, vérifier si la transformation conserve réellement la garantie.

Exemples de raisonnement :

- `map` conserve la taille d'un tableau;
- `filter` ne garantit plus `LengthEqual` ni `MinElements`;
- `trim` ne garantit plus la longueur exacte ni le minimum de caractères;
- une transformation de casse conserve la taille, mais peut changer les formats ou les caractères autorisés.

Les helpers de réapplication doivent exprimer ces choix explicitement.
