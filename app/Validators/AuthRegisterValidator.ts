import { schema, CustomMessages, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class AuthRegisterValidator {
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
			rules.required()
		]),
		login_id: schema.string([
			rules.required(),
			rules.minLength(4),
			rules.maxLength(50),
			rules.alphaNum({allow: ['dash']}),
			rules.unique({
				table: 'users',
				column: 'login_id',
				where: {
					delete_flag: 0
				}
			})
		]),
		password: schema.string([
			rules.required(), rules.minLength(6), rules.maxLength(100), rules.alphaNum(), rules.confirmed('password_confirmation')
		]),
		password_confirmation: schema.string([
			rules.required()
		]),
		email: schema.string([
			rules.email(),
			rules.unique({
				table: 'users',
				column: 'email',
				where: {
					delete_flag: 0
				}
			})
		])
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
		'username.required': 'Nick nameは必須です。',
		'login_id.required': 'ログインIDは必須です。',
		'login_id.vfdbexists': 'このログインIDは利用できません。',
		'login_id.vfaplhadash': '英数字、-、_のみ使用できます。',
		'login_id.min': 'ログインIDは4文字以上です。',
		'login_id.max': 'ログインIDは50文字までです。',
		'password.required': 'Passwordは必須です。',
		'password.min': 'パスワードは6文字以上です。',
		'password.max': 'パスワードは100文字までです。',
		'password.vfalphanum': 'パスワードは英数字のみです。',
		'password.confirmed': 'パスワードが一致しません。',
		'password_confirmation.required': 'パスワードretry',
		'email.email': 'Emailを正しく入力してください。',
		'email.vfdbexists': 'このEmailは利用できません。'
	}
}
