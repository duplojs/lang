# Philosophie des data structures

## 1. Rôle
Le premier rôle des data structures est de créer du typage qui peut être utilisé au runtime. De la même manière que nous pourrions déclarer une interface et des types, nous allons déclarer du code qui représentera des interfaces et des types. Les data structures portent également un système de codec. Elles embarquent un système d'encode qui permet de transiter d'un état `A` vers un état `B`, et elles embarquent aussi un système de decode qui permet de transiter de l'état `B` vers l'état `A`. Pour cela, il suffit de créer un `Codec`.

## 2. Fonctionnement
Les data structures sont organisées en plusieurs couches :
- `FundamentalType` : désigne des types considérés comme primitifs. Il permet de centraliser l'identification et le traitement du codec sur les types représentés par celui-ci. Cela résout un problème de cohérence entre le typage et l'exécution. Dans le typage, il existe des types littéraux et des types globaux. Pour une string, par exemple, à l'exécution, il est impossible de savoir s'il s'agit d'une string littérale ou d'une string tout court, vu que cette nuance n'existe absolument pas. Il faut donc quelque chose qui représente ces deux types à l'exécution. Ainsi, que ce soit un littéral ou ce type global, le `FundamentalType` représente les deux. C'est pour ça que, dans le système de codec, ce qu'on remplace est un `FundamentalType`, ce qui permet d'identifier à l'exécution et au niveau du typage quel type remplacer.
- `Type` : ce sont des wrappers qui embarquent un `FundamentalType` et qui peuvent ajouter à l'exécution la nuance des types littéraux.
- `Structure` : les structures jouent le rôle de compositeur. Elles peuvent embarquer un `Type` ou embarquer d'autres `Structure`. Cela permet de créer des types comme des objets avec des clés et des valeurs, et des tableaux. Elles embarquent également la logique d'encode et de decode.
- `Constraint` : s'ajoutent au système de structure afin de préciser des vérifications supplémentaires. Une structure pourrait vérifier que c'est une string, mais la contrainte, elle, peut appliquer un pattern comme une adresse email.
- Les helpers : toutes les manipulations de l'API se font à travers des fonctions qui réduisent la complexité et homogénéisent l'API afin de ressembler davantage à ce qui existe déjà.

## 3. Fonctionnement Codec
Un `Codec` se crée avec un `FundamentalType` qui représente le type ciblé et une `Structure` qui représente ce par quoi sera remplacé le `FundamentalType`. Cela permet d'utiliser la même `Structure` pour l'encode et le decode. Il suffit ensuite d'appeler les méthodes associées. Tous les `FundamentalType` reconnus seront alors remplacés pendant l'encode par le résultat de la fonction d'encode du `Codec`. La partie des codes fonctionne de la même manière
