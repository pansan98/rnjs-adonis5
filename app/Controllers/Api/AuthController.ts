import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import BaseController from './BasesController'
import AuthRegister from 'App/Validators/AuthRegisterValidator'
import ValidateWrap from 'App/Helpers/ValidateWrap'
import UserModel from 'App/Models/User'
import SharingLoginModel from 'App/Models/SharingLogin'

export default class AuthController extends BaseController {
	public async register(ctx: HttpContextContract) {
		try {
			await ctx.request.validate(AuthRegister)
		} catch(error) {
			const errorwrap = ValidateWrap.apiwrap(error.messages)
			return this.fail(ctx, {
				errors: errorwrap
			})
		}
		const user = await UserModel.newUser({
			username: ctx.request.input('username'),
			login_id: ctx.request.input('login_id'),
			password: ctx.request.input('password'),
			email: ctx.request.input('email')
		})
		if(!user) return this.fail(ctx, {
			errors: {
				system: ['新規登録に失敗しました。']
			}
		})
		// const SharingLogin = new SharingLoginModel()
		// const sl = await SharingLogin.related('user').create(user)
		// sl.merge(SharingLoginModel.filter({
		// 	ip: ctx.request.ip(),
		// 	os: ctx.request.header('User-Agent')
		// }, SharingLoginModel.fillable))
		return this.success(ctx)
	}
}
