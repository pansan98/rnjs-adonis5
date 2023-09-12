import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class UserInRoom extends BaseModel {
	public static table = 'users_in_rooms'
	@column({ isPrimary: true })
	public id: number

	@column()
	public user_id: number

	@column()
	public room_id: number

	@column.dateTime({ autoCreate: true })
	public createdAt: DateTime

	@column.dateTime({ autoCreate: true, autoUpdate: true })
	public updatedAt: DateTime
}
