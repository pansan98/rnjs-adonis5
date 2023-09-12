import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import BaseController from 'App/Controllers/Api/BasesController'

import RoomModel from 'App/Models/Room'
import UserInRoomModel from 'App/Models/UserInRoom'

export default class ChatsController extends BaseController {
	public async start(ctx: HttpContextContract) {
		const user_id = await ctx.request.param('user_id', null)
		if(!user_id) return this.fail(ctx)

		const user = await this.ud(ctx)
		if(!user) return this.fail(ctx)

		let room = await RoomModel.exists(user.id, user_id)
		if(!room) {
			room = await RoomModel.create({
				created_user_id: user.id,
				receive_user_id: user_id
			})
			await UserInRoomModel.create({
				user_id: user.id,
				room_id: room.id
			})
		}
		return this.success(ctx, {
			room_id: room.id
		})
	}
}
