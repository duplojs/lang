# Philosophie du domaine chrono

## 1. Rôle

Le domaine `chrono` contient les fonctions et types propres aux dates, temps, timezones, sérialisations et opérations temporelles.

Il ne suit pas le modèle principal des contraintes.

Il manipule des valeurs temporelles fortes : `TheDate` et `TheTime`.

## 2. Valeurs temporelles

`TheDate` représente une date immutable construite depuis un timestamp sûr.

`TheTime` représente une valeur temporelle sûre exprimée en millisecondes.

Ne pas exposer une mutation native comme contrat public. Une opération temporelle doit produire une nouvelle valeur.

## 3. Création et validation

Les fonctions de création sont la frontière principale du domaine.

Une entrée statiquement sûre peut produire directement une valeur forte.

Une entrée large ou incertaine doit retourner un résultat explicite avec `Either`.

Les erreurs TypeScript servent à refuser les dates, années, durées ou unités impossibles lorsque l'information est connue par le type.

## 4. Sérialisation

Les formes sérialisées sont un contrat public du domaine, pas un détail interne.

Une fonction qui accepte une valeur chrono doit souvent accepter la valeur forte et sa forme sérialisée lorsque cela correspond à l'usage public.

## 5. Timezones et calendrier

Les timezones, les années bissextiles, les limites de timestamp et les règles calendaires font partie du contrat métier.

Ne pas réduire `chrono` à une manipulation numérique de timestamps lorsque la fonction travaille avec une date calendaire.

Les opérations doivent distinguer les calculs de durée simples et les calculs calendaires comme les mois ou les années.
