import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import BaseController from './BasesController'
import AdminCmsViewModel from 'App/Models/AdminCmsView'

export default class MorphsController extends BaseController {
	public async topics(ctx: HttpContextContract) {
		const ud = await this.ud(ctx)
		if(!ud) return this.fail(ctx)

		const query = ctx.request.qs()
		const views = await AdminCmsViewModel.findviews(ud.id, query.morphs_type)
		return this.success(ctx, {
			views: views
		})
	}

	public async topicviewed(ctx: HttpContextContract) {
		const ud = await this.ud(ctx)
		if(!ud) return this.fail(ctx)

		const query = ctx.request.qs()
		const viewed = await AdminCmsViewModel.query()
			.where('user_id', ud.id)
			.where('morphs_id', query.morpsh_id)
			.where('morphs_type', query.morphs_type)
			.first()
		if(!viewed) {
			await AdminCmsViewModel.create({
				user_id: ud.id,
				morphs_id: query.morphs_id,
				morphs_type: query.morphs_type
			})
		}
		return this.success(ctx)
	}
}
