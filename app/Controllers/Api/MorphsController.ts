import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import BaseController from './BasesController'
import AdminCmsViewModel from 'App/Models/AdminCmsView'
import AdminCmsView from 'App/Models/AdminCmsView'

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

		const morphs_id = await ctx.request.input('morphs_id')
		const morphs_type = await ctx.request.input('morphs_type')
		AdminCmsView.morphs_viewed(ud.id, morphs_id, morphs_type)
		
		return this.success(ctx)
	}
}
