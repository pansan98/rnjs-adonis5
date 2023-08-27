import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import BaseController from './BasesController'
import AuthRegister from 'App/Validators/AuthRegisterValidator'
import AuthLogin from 'App/Validators/AuthLoginValidator'
import AuthHelper from 'App/Helpers/Auth'
import ValidateWrap from 'App/Helpers/ValidateWrap'
import UserModel from 'App/Models/User'

export default class AuthController extends BaseController {
	public async login(ctx: HttpContextContract) {
		try{
			await ctx.request.validate(AuthLogin)
		} catch(error) {
			const errorwrap = ValidateWrap.apiwrap(error.messages)
			return this.fail(ctx, {
				errors: errorwrap
			})
		}
		const user = await UserModel.query()
			.where('login_id', ctx.request.input('login_id'))
			.where('delete_flag', 0)
			.first()
		if(!user) return this.fail(ctx, {errors: {
			system: ['ログインIDが間違っています。']
		}})
		if(!await UserModel.verify(ctx.request.input('password'), user)) return this.fail(ctx, {errors: {
			system: ['ログインできません。']
		}})
		await AuthHelper.retension(ctx.session, user.identify_code)
		return this.success(ctx)
	}

	public async logout(ctx: HttpContextContract) {
		const idf = await ctx.session.get('identify', null)
		const user = await UserModel.profile(idf)
		if(user) {
			user.merge({
				active_flag: 0
			})
			await user.save()
		}
		await ctx.session.forget('identify')
		return this.success(ctx)
	}

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
		return this.success(ctx)
	}
}
