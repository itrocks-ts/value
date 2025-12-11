[![npm version](https://img.shields.io/npm/v/@itrocks/value?logo=npm)](https://www.npmjs.org/package/@itrocks/value)
[![npm downloads](https://img.shields.io/npm/dm/@itrocks/value)](https://www.npmjs.org/package/@itrocks/value)
[![GitHub](https://img.shields.io/github/last-commit/itrocks-ts/value?color=2dba4e&label=commit&logo=github)](https://github.com/itrocks-ts/value)
[![issues](https://img.shields.io/github/issues/itrocks-ts/value)](https://github.com/itrocks-ts/value/issues)
[![discord](https://img.shields.io/discord/1314141024020467782?color=7289da&label=discord&logo=discord&logoColor=white)](https://25.re/ditr)

# value

Limit property values with @MinValue, @MaxValue, and @Signed.

*This documentation was written by an artificial intelligence and may contain errors or approximations.
It has not yet been fully reviewed by a human. If anything seems unclear or incomplete,
please feel free to contact the author of this package.*

## Installation

```bash
npm i @itrocks/value
```

## Usage

`@itrocks/value` provides decorators that attach value constraints as metadata on
your class properties:

- `@MinValue()` – minimum allowed value
- `@MaxValue()` – maximum allowed value
- `@Signed()`   – whether a numeric value is signed (`true`) or forced to be
  non‑negative (`false`)

The decorators themselves do not enforce the constraints at runtime. Instead,
they store metadata that other parts of your application (validation, schema
generation, UI, etc.) can read using the helper functions:

- `minValueOf()`
- `maxValueOf()`
- `signedOf()`

These helpers work both with class constructors and instances.

### Minimal example

```ts
import { MaxValue, MinValue, Signed } from '@itrocks/value'

class Product {
	// A positive integer quantity, with a maximum of 9,999
	@MinValue(1)
	@MaxValue(9999)
	@Signed(false)
	quantity = 1
}
```

This marks `quantity` as a non‑negative value between `1` and `9999`. Other
code can then rely on this metadata to validate input or generate database
schemas.

### Complete example with metadata reading

In a more realistic setup, the decorators are typically used together with
schema or form helpers that read the metadata. The following example shows a
stand‑alone usage where we manually consult the metadata to validate user
input:

```ts
import type { ObjectOrType } from '@itrocks/class-type'
import { MaxValue, MinValue, Signed, maxValueOf, minValueOf, signedOf } from '@itrocks/value'

class Account {
	// Allowed balance range: -1_000_000 to +1_000_000
	@MinValue(-1_000_000)
	@MaxValue( 1_000_000)
	@Signed(true)
	balance = 0
}

function validateNumber<T extends object>(
	value: number,
	type: ObjectOrType<T>,
	property: keyof T
): string[] {
	const min    = minValueOf(type, property)
	const max    = maxValueOf(type, property)
	const signed = signedOf(type, property)

	const errors: string[] = []

	if ((signed === false) && (value < 0)) {
		errors.push('Value must be non‑negative')
	}
	if ((min !== undefined) && (value < (min as number))) {
		errors.push(`Value must be greater than or equal to ${min}`)
	}
	if ((max !== undefined) && (value > (max as number))) {
		errors.push(`Value must be less than or equal to ${max}`)
	}

	return errors
}

const account = new Account()

validateNumber(-5, Account, 'balance')
// [ 'Value must be greater than or equal to -1000000' ]

validateNumber(2_000_000, Account, 'balance')
// [ 'Value must be less than or equal to 1000000' ]
```

In real applications, you will often use these decorators indirectly through
schema or ORM helpers such as `@itrocks/reflect-to-schema`, which already know
how to transform this metadata into database column definitions.

## API

All the exports are available from the package root:

```ts
import { MaxValue, MinValue, Signed, maxValueOf, minValueOf, signedOf } from '@itrocks/value'
```

Throughout this section, `Ranged` refers to one of the following types:

```ts
type Ranged = bigint | number | string | Date | undefined
```

### `function MaxValue<T extends object>(value?: Ranged)`

Declares the maximum allowed value for a property.

#### Parameters

- `value?: Ranged` – the maximum value allowed for the property. If omitted,
  only the presence of a maximum constraint is recorded and can be interpreted
  by your tooling as “no explicit limit”.

#### Usage notes

- Can decorate properties of type `bigint`, `number`, `string`, or `Date`.
- You can read the stored value using `maxValueOf()`.

### `function maxValueOf<T extends object>(target: ObjectOrType<T>, property: KeyOf<T>): Ranged`

Reads the maximum value metadata for the given property.

#### Parameters

- `target` – a class constructor or object instance.
- `property` – the property name on which the `@MaxValue()` decorator was
  applied.

#### Returns

- The maximum value provided to `@MaxValue()` for this property, or
  `undefined` if no maximum has been defined.

### `function MinValue<T extends object>(value?: Ranged)`

Declares the minimum allowed value for a property.

#### Parameters

- `value?: Ranged` – the minimum value allowed for the property. If omitted,
  only the presence of a minimum constraint is recorded.

#### Usage notes

- Typically used together with `@MaxValue()` to define a value range.
- You can read the stored value using `minValueOf()`.

### `function minValueOf<T extends object>(target: ObjectOrType<T>, property: KeyOf<T>): Ranged`

Reads the minimum value metadata for the given property.

#### Parameters

- `target` – a class constructor or object instance.
- `property` – the property name on which the `@MinValue()` decorator was
  applied.

#### Returns

- The minimum value provided to `@MinValue()` for this property, or
  `undefined` if no minimum has been defined.

### `function Signed<T extends object>(signed: boolean)`

Declares whether the property should be considered signed or not.

#### Parameters

- `signed: boolean` –
  - `true`: values may be negative or positive.
  - `false`: values are expected to be non‑negative only.

#### Usage notes

- This is typically used for numeric properties (`number` or `bigint`).
- The actual enforcement is left to your validation or schema tools.

### `function signedOf<T extends object>(target: ObjectOrType<T>, property: KeyOf<T>): boolean`

Reads the `signed` metadata for the given property.

#### Parameters

- `target` – a class constructor or object instance.
- `property` – the property name on which the `@Signed()` decorator was
  applied.

#### Returns

- The boolean value passed to `@Signed()`.
- `false` if no `@Signed()` decorator is present on the property.

## Typical use cases

- **Input validation rules** – Define allowed value ranges on domain models
  and have a validation layer read `minValueOf()` / `maxValueOf()` to check
  user input.
- **Database schema generation** – Combine this package with schema tools
  (e.g. `@itrocks/reflect-to-schema`) so that numeric column definitions
  automatically respect `@MinValue()`, `@MaxValue()` and `@Signed()`.
- **Configuration objects** – Describe valid ranges and sign requirements for
  configuration values (timeouts, quotas, thresholds) in a central place.
- **UI form generation** – Generate HTML inputs (`min`, `max`, validation
  messages, etc.) from the metadata to keep the UI consistent with your
  domain rules.
- **Reporting and analytics** – Document the expected bounds of numeric fields
  so that reports can flag out‑of‑range values.
