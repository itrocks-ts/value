import { KeyOf, ObjectOrType }   from '@itrocks/class-type'
import { decorate, decoratorOf } from '@itrocks/decorator/property'

const MAX_VALUE = Symbol('maxValue')

export function MaxValue<T extends object>(value?: number | string | undefined | Date)
{
	return decorate<T>(MAX_VALUE, value)
}

export function maxValueOf<T extends object>(target: ObjectOrType<T>, property: KeyOf<T>)
{
	return decoratorOf<number | string | undefined | Date, T>(target, property, MAX_VALUE, undefined)
}
