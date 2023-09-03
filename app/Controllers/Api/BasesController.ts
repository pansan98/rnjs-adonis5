import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import UserModel from 'App/Models/User'

export default class BasesController {
	public async success(ctx: HttpContextContract, params?: {}) {
		ctx.response.status(200).json(Object.assign({result: true}, params))
	}

	public async fail(ctx: HttpContextContract, params?: {}) {
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
}
