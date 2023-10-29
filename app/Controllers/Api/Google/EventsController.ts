import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import GoogleController from 'App/Controllers/Api/Google/BasesController'
import EventsCreateValidator from 'App/Validators/Google/EventsCreate'
import GoogleCalendar from 'App/Modules/OAuth/Google/GoogleCalendar'

import SnsOAuthToken from 'App/Models/SnsOAuthToken'

export default class EventsController extends GoogleController {
	public async events(ctx: HttpContextContract) {
		const user = await this.ud(ctx)
		if(!user) return this.fail(ctx)
		
		// トークンが有効であるか確認
		const auth = await this.googleOAuth.auth(user.id)
		if(!auth) {
			const redirect_url = await this.googleOAuth.redirect_oauth()
			return this.success(ctx, {
				auth: false,
				data: {
					redirect_url: redirect_url
				}
			})
		}

		const OAuthToken = await SnsOAuthToken.exists(user.id, 'google')
		if(!OAuthToken) return this.fail(ctx)
		const calendar = new GoogleCalendar()
		const queries = ctx.request.qs()
		const events = await calendar.list(OAuthToken, {
			expireMax: (queries?.expire_max) ? parseInt(queries.expire_max) : undefined,
			expireMin: (queries?.expire_min) ? parseInt(queries.expire_min) : undefined
		})

		// イベント情報をとる
		return this.success(ctx, {
			auth: true,
			events: events
		})
	}

	public async create(ctx: HttpContextContract) {
		const validate = await this.validate(ctx, EventsCreateValidator)
		if(!validate) {
			return this.fail(ctx, {
				errors: this.get_validator_errors()
			})
		}
		const user = await this.ud(ctx)
		if(!user) return this.fail(ctx, {
			errors: {
				system: ['ログインしてください。']
			}
		})
		// トークンが有効であるかチェックする
		const auth = await this.googleOAuth.auth(user.id)
		if(!auth) {
			return this.success(ctx, {
				auth: false
			})
		}

		return this.success(ctx, {
			auth: true
		})
	}
}
