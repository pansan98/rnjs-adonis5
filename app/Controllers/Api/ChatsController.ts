import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import BaseController from 'App/Controllers/Api/BasesController'

import RoomModel from 'App/Models/Room'
import UserInRoomModel from 'App/Models/UserInRoom'
import ChatModel from 'App/Models/Chat'
import ChatViewModel from 'App/Models/ChatView'

export default class ChatsController extends BaseController {
	public async start(ctx: HttpContextContract) {
		const user_id = await ctx.request.param('user_id', null)
		if(!user_id) return this.fail(ctx)

		const user = await this.ud(ctx)
		if(!user) return this.fail(ctx)

		let room = await RoomModel.exists(user.id, user_id)
		if(!room) {
			// 部屋がない場合は作る
			room = await RoomModel.create({
				created_user_id: user.id,
				receive_user_id: user_id
			})
		}

		if(!await UserInRoomModel.inUser(user.id, room.id)) {
			// 部屋に入室
			await UserInRoomModel.create({
				user_id: user.id,
				room_id: room.id
			})
		}
		const unreads = await ChatViewModel.roomUnreads(user.id, room.id)
		return this.success(ctx, {
			room_id: room.id,
			unreads: unreads
		})
	}

	public async read(ctx: HttpContextContract) {
		const user_id = await ctx.request.param('user_id', null)
		if(!user_id) return this.fail(ctx)

		const user = await this.ud(ctx)
		if(!user) return this.fail(ctx)

		const trx_id = await ctx.request.input('trx_id')
		this.readupdate(user.id, trx_id)
		return this.success(ctx)
	}

	public async bulkread(ctx: HttpContextContract) {
		const user_id = await ctx.request.param('user_id', null)
		if(!user_id) return this.fail(ctx)

		const user = await this.ud(ctx)
		if(!user) return this.fail(ctx)

		const view_id = await ctx.request.input('view_id')
		this.readupdate(user.id, view_id)
		return this.success(ctx)
	}

	protected async readupdate(myid: number, p_id: string|number) {
		return new Promise(async (resolve) => {
			if(typeof p_id === 'string') {
				const chat = await ChatModel.query()
				.where('trx_id', p_id)
				.first()
				if(chat) {
					const chatview = await ChatViewModel.query()
						.where('chat_id', chat.id)
						.where('receive_user_id', myid)
						.first()
					if(chatview) {
						// 既読に更新
						chatview.merge({
							viewed: true
						})
						await chatview.save()
					}
				}
			} else {
				const chatview = await ChatViewModel.query()
					.where('id', p_id)
					.first()
				if(chatview) {
					// 既読に更新
					chatview.merge({
						viewed: true
					})
					await chatview.save()
				}
			}
			resolve(true)
		})
	}
}
