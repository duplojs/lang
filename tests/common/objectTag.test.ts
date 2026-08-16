import { createTaggedObject, objectTagKind, type DKind, type ExpectType, type ObjectTag } from "@scripts";

describe("objectTag", () => {
	it("create object tag from interface", () => {
		interface TaggedObjectOne extends ObjectTag<"superObject1"> {
			prop1: string;
			prop2: number;
		}

		interface TaggedObjectTwo extends ObjectTag<"superObject2"> {
			prop3: string;
			prop4: number;
		}

		const taggedObject = createTaggedObject<
			| TaggedObjectOne
			| TaggedObjectTwo
		>()(
			"superObject1",
			{
				prop1: "test",
				prop2: 12,
			},
		);

		type check = ExpectType<
			typeof taggedObject,
			TaggedObjectOne,
			"strict"
		>;

		expect(taggedObject).toStrictEqual({
			prop1: "test",
			prop2: 12,
			[objectTagKind.runTimeKey]: "superObject1",
		});
	});

	it("create object tag from inference", () => {
		const taggedObject = createTaggedObject(
			"superObject",
			{
				prop1: "test",
				prop2: 12,
			},
		);

		type check = ExpectType<
			typeof taggedObject,
			(
				& ObjectTag<"superObject">
				& {
					prop1: string;
					prop2: number;
				}
			),
			"strict"
		>;

		expect(taggedObject).toStrictEqual({
			prop1: "test",
			prop2: 12,
			[objectTagKind.runTimeKey]: "superObject1",
		});
	});

	it("create object tag from declaration", () => {
		interface TaggedObjectOne extends ObjectTag<"superObject1"> {
			prop1: string;
			prop2: number;
		}

		interface TaggedObjectTwo extends ObjectTag<"superObject2"> {
			prop3: string;
			prop4: number;
		}

		const taggedObject: (
			| TaggedObjectOne
			| TaggedObjectTwo
		) = createTaggedObject(
			"superObject1",
			{
				prop1: "test",
				prop2: 12,
			},
		);

		expect(taggedObject).toStrictEqual({
			prop1: "test",
			prop2: 12,
			[objectTagKind.runTimeKey]: "superObject1",
		});
	});
});
