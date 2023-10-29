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

		// イベント情報を取得
		const OAuthToken = await SnsOAuthToken.exists(user.id, 'google')
		if(!OAuthToken) return this.fail(ctx)
		const calendar = new GoogleCalendar()
		const queries = ctx.request.qs()
		const events = await calendar.list(OAuthToken, {
			expireMax: (queries?.expire_max) ? parseInt(queries.expire_max) : undefined,
			expireMin: (queries?.expire_min) ? parseInt(queries.expire_min) : undefined
		})

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

		const OAuthToken = await SnsOAuthToken.exists(user.id, 'google')
		if(!OAuthToken) return this.fail(ctx)

		const summary = await ctx.request.input('title')
		const description = await ctx.request.input('description')
		const date = await ctx.request.input('date')
		if(date?.year && date?.month && date?.day) {
			const calendar = new GoogleCalendar()
			const start = new Date(date.year, date.month, date.day)
			start.toLocaleString("ja-JP", { timeZone: "Asia/Tokyo" })
			const end = new Date(date.year, date.month, date.day)
			end.toLocaleString("ja-JP", { timeZone: "Asia/Tokyo" })
			const res = await calendar.create(OAuthToken, {
				summary: summary,
				description: description,
				start: {
					dateTime: start.toISOString(),
					timeZone: 'Asia/Tokyo'
				},
				end: {
					dateTime: end.toISOString(),
					timeZone: 'Asia/Tokyo'
				}
			})
			if(res) {
				return this.success(ctx)
			}
		}

		return this.fail(ctx, {
			errors: {
				system: ['イベントの作成に失敗しました。']
			}
		})
	}
}
