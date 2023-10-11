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
}
