import { KeyOf, ObjectOrType }   from '@itrocks/class-type'
import { decorate, decoratorOf } from '@itrocks/decorator/property'

const SIGNED = Symbol('signed')

export function Signed<T extends object>(signed: boolean)
{
	return decorate<T>(SIGNED, signed)
}

export function signedOf<T extends object>(target: ObjectOrType<T>, property: KeyOf<T>)
{
	return decoratorOf(target, property, SIGNED, false)
}
