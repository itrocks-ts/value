import { KeyOf, ObjectOrType }   from '@itrocks/class-type'
import { decorate, decoratorOf } from '@itrocks/decorator/property'

const MIN_VALUE = Symbol('minValue')

type Ranged = bigint | number | string | Date | undefined

export function MinValue<T extends object>(value?: Ranged)
{
	return decorate<T>(MIN_VALUE, value)
}

export function minValueOf<T extends object>(target: ObjectOrType<T>, property: KeyOf<T>)
{
	return decoratorOf<Ranged, T>(target, property, MIN_VALUE, undefined)
}
