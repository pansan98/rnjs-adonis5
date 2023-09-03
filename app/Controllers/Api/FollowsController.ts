import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import BaseController from './BasesController'
import UserModel from 'App/Models/User'
import FollowModel from 'App/Models/Follow'

export default class FollowsController extends BaseController {
	public async add(ctx: HttpContextContract) {
		const user = await this.ud(ctx)
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
		const user = await this.ud(ctx)
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

	public async list(ctx: HttpContextContract) {
		const user = await this.ud(ctx)
		if(!user) return this.fail(ctx, {errors: {
			sysmte: ['ログインしてください。']
		}})
		
		// フォロー済みユーザーを取得
		const follows = await FollowModel.myfollows(user.id)
		return this.success(ctx, {follows: follows})
	}
}
