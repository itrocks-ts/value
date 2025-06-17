import { KeyOf, ObjectOrType }   from '@itrocks/class-type'
import { decorate, decoratorOf } from '@itrocks/decorator/property'

const MAX_VALUE = Symbol('maxValue')

type Ranged = bigint | number | string | Date | undefined

export function MaxValue<T extends object>(value?: Ranged)
{
	return decorate<T>(MAX_VALUE, value)
}

export function maxValueOf<T extends object>(target: ObjectOrType<T>, property: KeyOf<T>)
{
	return decoratorOf<Ranged, T>(target, property, MAX_VALUE, undefined)
}
