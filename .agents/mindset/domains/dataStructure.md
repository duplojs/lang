# Philosophie des data structures

## 1. Rôle

Le domaine `dataStructure` sert à déclarer du typage utilisable au runtime.

Au lieu de déclarer seulement une interface ou un type TypeScript, on déclare du code qui représente ce contrat et qui peut vérifier une donnée inconnue à l'exécution.

Les data structures portent aussi un système de codec. Un codec permet de passer d'un état `A` vers un état `B` avec `encode`, puis de revenir de `B` vers `A` avec `decode`.

Ce domaine est plus systémique que les domaines fonctionnels simples. Une modification locale peut changer le contrat de validation, l'inférence publique, les erreurs ou le comportement des codecs.

La plupart des interventions doivent rester sur la couche adaptée : ajout de structure, type, contrainte, codec ou helper. Modifier les bases du domaine doit rester rare et justifié.

## 2. Couches

`FundamentalType` représente une famille primitive observable au runtime.

Il sert notamment à centraliser l'identification utilisée par les codecs. TypeScript peut distinguer `string` et un littéral comme `"admin"`, mais cette nuance n'existe pas à l'exécution. Le `FundamentalType` représente donc le point commun runtime et typé qui permet de savoir quoi remplacer pendant l'encodage ou le décodage.

`Type` wrappe un `FundamentalType` et peut ajouter une nuance runtime, comme la vérification d'un littéral.

`Structure` compose un `Type` ou d'autres `Structure`. Elle permet de représenter des objets, tableaux, unions ou autres formes composées, et porte la logique de validation, encode et decode.

`Constraint` s'ajoute à une structure pour préciser une vérification supplémentaire. Une structure peut vérifier qu'une valeur est une string; une contrainte peut ensuite vérifier un format comme une adresse email.

Les helpers sont souvent l'entrée DX principale. Ils doivent exposer une API simple sans perdre les informations utiles de la structure construite.

## 3. Contrat public

`StructureValue` est le type public central d'une structure.

Une structure doit préserver les informations utiles : littéraux, propriétés readonly, optionalité, unions, valeurs imbriquées et sorties de contraintes.

Les `definition` ne sont pas de simples détails internes. Elles portent les informations nécessaires à l'exécution, à la composition et à l'inspection du comportement.

Une API correcte doit aligner :

- la valeur acceptée au runtime;
- la valeur produite par `StructureValue`;
- les erreurs retournées;
- les formes encode et decode.

## 4. Contraintes dataStructure

Les contraintes de `dataStructure` ne sont pas équivalentes aux contraintes transversales du projet.

Elles ont une exécution runtime, peuvent produire des issues d'erreur et participent au calcul de `StructureValue`.

Le type vérifié par une contrainte doit représenter la valeur réellement garantie après validation.

Ne pas ajouter une contrainte uniquement pour rendre le type plus précis si le runtime ne valide pas cette garantie.

## 5. Codec

Un codec se crée avec un `FundamentalType` cible et une `Structure` qui représente la forme encodée.

Pendant l'encode, les structures qui rencontrent ce `FundamentalType` peuvent remplacer la valeur par le résultat de la fonction d'encodage du codec.

Le résultat de l'encode doit être validé par la structure encodée.

Le decode suit le chemin inverse : la donnée encodée est validée par cette même structure avant d'être transformée en valeur finale.

Les contextes d'erreur `encode` et `decode` font partie du contrat public observable.

Le calcul de `EncodedValue` est sensible, notamment avec les structures récursives. Ne pas le complexifier sans besoin clair.

## 6. Sync et async

Les APIs synchrones doivent retourner une erreur `async-error` lorsqu'une partie de la structure nécessite de l'asynchrone.

Les APIs asynchrones doivent attendre toutes les couches concernées.

`isAsynchronous` doit agréger les types, contraintes et structures imbriquées qui composent la structure.

## 7. Points d'arrêt

S'arrêter et demander avant de continuer lorsqu'une modification touche :

- les bases `Structure`, `Type`, `Constraint`, `FundamentalType` ou `Codec`;
- le calcul de `StructureValue`, `StructureInitialValue` ou `EncodedValue`;
- la propagation des chemins d'erreur;
- les contextes `check`, `encode` ou `decode`;
- le modèle sync/async;
- la compatibilité des helpers publics.
