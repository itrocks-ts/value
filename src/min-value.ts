import { KeyOf, ObjectOrType }   from '@itrocks/class-type'
import { decorate, decoratorOf } from '@itrocks/decorator/property'

const MIN_VALUE = Symbol('minValue')

export function MinValue<T extends object>(value?: number | string | undefined | Date)
{
	return decorate<T>(MIN_VALUE, value)
}

export function minValueOf<T extends object>(target: ObjectOrType<T>, property: KeyOf<T>)
{
	return decoratorOf<number | string | undefined | Date, T>(target, property, MIN_VALUE, undefined)
}
