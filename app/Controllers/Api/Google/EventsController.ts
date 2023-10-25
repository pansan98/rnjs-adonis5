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
	}
}
