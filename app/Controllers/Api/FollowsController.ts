import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import BaseController from './BasesController'
import UserModel from 'App/Models/User'
import FollowModel from 'App/Models/Follow'

export default class FollowsController extends BaseController {
	public async add(ctx: HttpContextContract) {
		const idf = await ctx.session.get('identify', null)
		const user = await UserModel.get(idf)
		if(!user) return this.fail(ctx, {errors: {
			system: ['フォローするためにはログインしてください。']
		}})

		const follow_idf = await ctx.request.param('idf')
		const follow_user = await UserModel.get(follow_idf)
		if(!follow_user) return this.fail(ctx, {errors: {
			system: ['ユーザーが見つかりません。']
		}})
		await FollowModel.add(user.id, follow_user.id)
		return this.success(ctx)
	}

	public async remove(ctx: HttpContextContract) {
		const idf = await ctx.session.get('identify', null)
		const user = await UserModel.get(idf)
		if(!user) return this.fail(ctx, {errors: {
			system: ['フォローを外すためにはログインしてください。']
		}})

		const followed_idf = await ctx.request.param('idf')
		const followed_user = await UserModel.get(followed_idf)
		if(!followed_user) return this.fail(ctx, {errors: {
			system: ['ユーザーが見つかりません。']
		}})
		await FollowModel.remove(user.id, followed_user.id)
		return this.success(ctx)
	}
}
