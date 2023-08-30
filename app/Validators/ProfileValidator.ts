import { schema, CustomMessages, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class ProfileValidator {
	constructor(protected ctx: HttpContextContract) {}

	/*
	 * Define schema to validate the "shape", "type", "formatting" and "integrity" of data.
	 *
	 * For example:
	 * 1. The username must be of data type string. But then also, it should
	 *    not contain special characters or numbers.
	 *    ```
	 *     schema.string({}, [ rules.alpha() ])
	 *    ```
	 *
	 * 2. The email must be of data type string, formatted as a valid
	 *    email. But also, not used by any other user.
	 *    ```
	 *     schema.string({}, [
	 *       rules.email(),
	 *       rules.unique({ table: 'users', column: 'email' }),
	 *     ])
	 *    ```
	 */
	public schema = schema.create({
		username: schema.string([
			rules.required(), rules.maxLength(100), rules.trim()
		]),
		email: schema.string.nullableAndOptional([
			rules.trim(),
			rules.email()
		]),
		profession: schema.string.nullable({trim: true}),
		gender: schema.number.nullable([
			rules.range(1, 3)
		]),
		thumbnail: schema.array().anyMembers(),
		two_authorize: schema.array().members(schema.number())
	})

	/**
	 * Custom messages for validation failures. You can make use of dot notation `(.)`
	 * for targeting nested fields and array expressions `(*)` for targeting all
	 * children of an array. For example:
	 *
	 * {
	 *   'profile.username.required': 'Username is required',
	 *   'scores.*.number': 'Define scores as valid numbers'
	 * }
	 *
	 */
	public messages: CustomMessages = {
		'username.required': '名前は必須です。',
		'username.maxLength': '名前は100文字以内で入力してください。',
		'email.email': 'Eメールは正しく入力してください。',
		'gender.notIn': '値が不正です。'
	}
}
