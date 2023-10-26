import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import GoogleController from 'App/Controllers/Api/Google/BasesController'
import EventsCreateValidator from 'App/Validators/Google/EventsCreate'

export default class EventsController extends GoogleController {
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
			const redirect_url = this.googleOAuth.redirect_oauth()
			return this.success(ctx, {
				auth: false,
				data: {
					redirect_url: redirect_url
				}
			})
		}

		return this.success(ctx, {
			auth: true
		})
	}

	public async 
}
