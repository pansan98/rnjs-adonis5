import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import BaseController from './BasesController'

import Encryption from '@ioc:Adonis/Core/Encryption'

import ContactValidator from 'App/Validators/ContactValidator'
import ValidateWrap from 'App/Helpers/ValidateWrap'
import StringHelper from 'App/Helpers/String'

export default class ContactController extends BaseController {
	protected token_prefix = 'csrf_contact_'

	public async confirm(ctx: HttpContextContract) {
		const user = await this.ud(ctx)
		if(!user) return this.fail(ctx, {errors: {
			system: ['ログインしてください。']
		}})

		let posts = {
			subject: '',
			email: '',
			message: ''
		}
		try {
			posts = await ctx.request.validate(ContactValidator)
		} catch(error) {
			const errorwrap = ValidateWrap.apiwrap(error.messages)
			return this.fail(ctx, {errors: errorwrap})
		}

		const token = StringHelper.random(20)
		const enc = Encryption.encrypt(token, '1 hours')
		ctx.session.put(this.token_prefix+'token', token)

		return this.success(ctx, {
			inputs: {
				csrf_token: enc,
				subject: posts.subject,
				email: posts.email,
				message: posts.message
			}
		})
	}

	public async back(ctx: HttpContextContract) {
		const user = await this.ud(ctx)
		if(!user) return this.fail(ctx, {errors: {
			system: ['ログインしてください。']
		}})

		ctx.session.forget(this.token_prefix+'token')
		return this.success(ctx)
	}

	public async send(ctx: HttpContextContract) {
		const user = await this.ud(ctx)
		if(!user) return this.fail(ctx, {
			errors: {
				system: ['ログインしてください。']
			},
			forbidden: true
		})

		const session_token = await ctx.session.get(this.token_prefix+'token')
		const enc = await ctx.request.input('csrf_token', null)
		ctx.session.forget(this.token_prefix+'token')
		if(!session_token || !enc) return this.fail(ctx, {
			errors: {
				system: ['不正なアクセスです。最初からやり直してください。']
			},
			forbidden: true
		})

		const token = Encryption.decrypt(enc)
		if(session_token !== token) {
			return this.fail(ctx, {
				errors: {
					system: ['不正なアクセスです。最初からやり直してください。']
				},
				forbidden: true
			})
		}

		return this.success(ctx)
	}
}
