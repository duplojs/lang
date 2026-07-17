# Exemples de tests de types

Ces exemples illustrent le placement des assertions de types. Ils doivent être adaptés au contrat de la fonction testée.

## Entrée et sortie d'une API

```ts
const parser = DDataParser.extended.coercer(
	DDataParser.extended.number(),
);

type _CheckOutput = ExpectType<
	DDataParser.Output<typeof parser>,
	number,
	"strict"
>;

type _CheckInput = ExpectType<
	DDataParser.Input<typeof parser>,
	string | number | bigint | boolean | null,
	"strict"
>;

expect(parser.parse("42")).toStrictEqual(DEither.success(42));
```

## Conservation exacte d'un type intermédiaire

```ts
const inner = DDataParser.extended.number().min(4).max(10);
const parser = inner.coerce();

type _CheckInner = ExpectType<
	typeof parser.definition.inner,
	typeof inner,
	"strict"
>;

expect(parser.definition.inner).toBe(inner);
```

## Narrowing d'une sortie sans modifier l'entrée

```ts
const parser = DDataParser.extended
	.number()
	.coerce()
	.addChecker(
		DDataParser.checkerRefine(
			(value): value is 42 => value === 42,
		),
	);

type _CheckOutput = ExpectType<
	DDataParser.Output<typeof parser>,
	42,
	"strict"
>;

type _CheckInput = ExpectType<
	DDataParser.Input<typeof parser>,
	string | number | bigint | boolean | null,
	"strict"
>;
```

## Inférence dans un pipe

```ts
const result = pipe(
	input,
	DNamespace.functionName(params),
);

type _CheckResult = ExpectType<
	typeof result,
	ExpectedResult,
	"strict"
>;
```

Utiliser ce dernier exemple uniquement lorsque la fonction possède une signature curryfiée et que le pipe apporte une vérification d'inférence utile.
