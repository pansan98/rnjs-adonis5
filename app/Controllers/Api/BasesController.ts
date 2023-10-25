import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import UserModel from 'App/Models/User'
import ValidateWrap from 'App/Helpers/ValidateWrap'

export default class BasesController {
	protected validator_errors = {}
	protected async success(ctx: HttpContextContract, params?: {}) {
		ctx.response.status(200).json(Object.assign({result: true}, params))
	}

	protected async fail(ctx: HttpContextContract, params?: {}) {
		ctx.response.status(400).json(Object.assign({result: false}, params))
	}
	
	// user data
	protected async ud(ctx: HttpContextContract) {
		const idf = await ctx.session.get('identify', null)
		if(idf) {
			return await UserModel.get(idf)
		}
		return null
	}

	protected async notLogged(ctx: HttpContextContract) {
		return this.fail(ctx, {errors: {
			system: ['ログインしてください。']
		}})
	}

	protected async validate(ctx: HttpContextContract, Validate) {
		try {
			await ctx.request.validate(Validate)
		} catch(error) {
			const errorwrap = ValidateWrap.apiwrap(error.messages)
			this.validator_errors = errorwrap
			return false
		}
		return true
	}

	protected get_validator_errors() {
		return this.validator_errors
	}
}
