# Philosophie du domaine number

## 1. Rôle

Le domaine `number` contient les fonctions et types propres aux nombres et aux relations numériques.

Une API number doit raisonner sur la valeur numérique, mais aussi sur les garanties que son type peut porter : signe, parité, intégrité, finitude, bornes ou multiplicité.

## 2. Contraintes number

Les contraintes numériques enrichissent un number avec une garantie validée en amont.

Les contraintes simples décrivent une propriété de la valeur.

Les contraintes dynamiques décrivent une relation avec un seuil littéral : supérieur à, inférieur à, multiple de.

Ces contraintes peuvent se cumuler lorsqu'elles décrivent des garanties compatibles sur le même number.

## 3. Relations numériques

Les relations de bornes doivent être comparées au niveau type quand le contrat public en dépend.

Un seuil large `number` ne suffit pas lorsqu'une contrainte dynamique doit porter la valeur exacte du seuil.

Une contrainte plus faible ne doit pas remplacer une contrainte plus forte.

Une combinaison impossible doit rester visible dans le contrat public.

## 4. Domaine transversal

Le domaine number sert aussi de support aux autres domaines lorsque leurs contraintes reposent sur un calcul numérique.

Ne pas déplacer une logique propre aux tailles de string, aux tailles d'array ou à chrono dans `number` uniquement parce qu'elle utilise des nombres.
