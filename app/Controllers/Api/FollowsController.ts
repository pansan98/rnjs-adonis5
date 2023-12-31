import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import BaseController from './BasesController'
import UserModel from 'App/Models/User'
import FollowModel from 'App/Models/Follow'
import ChatViewModel from 'App/Models/ChatView'

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
			system: ['ログインしてください。']
		}})
		
		// フォロー済みユーザーを取得
		const follows = await FollowModel.myfollows(user.id)
		const unfollows = await FollowModel.unmyfollows(user.id)
		return this.success(ctx, {follows: follows, unfollows: unfollows})
	}

	public async search(ctx: HttpContextContract) {
		const user = await this.ud(ctx)
		if(!user) return this.fail(ctx, {errors: {
			system: ['ログインしてください。']
		}})

		const word = await ctx.request.qs()?.word
		if(word) {
			const users = await UserModel.username_search(user.id, user.identify_code, word)
			return this.success(ctx, {list: users})
		}
		return this.success(ctx, {list: []})
	}

	public async conf(ctx: HttpContextContract) {
		const user = await this.ud(ctx)
		if(!user) return this.notLogged(ctx)

		const unfollow_count = await FollowModel.countunfollower(user.id)
		const unread = await ChatViewModel.totalUnread(user.id)

		return this.success(ctx, {
			fetches: {
				follow_conf: unfollow_count,
				unread: unread
			}
		})
	}
}
