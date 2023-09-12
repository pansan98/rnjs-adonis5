import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class Room extends BaseModel {
	public static table = 'rooms'

	@column({ isPrimary: true })
	public id: number

	@column()
	public created_user_id: number

	@column()
	public receive_user_id: number

	@column.dateTime({ autoCreate: true })
	public createdAt: DateTime

	@column.dateTime({ autoCreate: true, autoUpdate: true })
	public updatedAt: DateTime

	public static async exists(myid: number, receiveid: number) {
		return await Room.query()
			.where((query) => {
				query.where('created_user_id', myid)
					.orWhere('created_user_id', receiveid)
			})
			.where((query) => {
				query.where('receive_user_id', myid)
					.orWhere('receive_user_id', receiveid)
			})
			.first()
	}
}
