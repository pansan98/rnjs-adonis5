import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class Chat extends BaseModel {
	public static table = 'chats'

	@column({ isPrimary: true })
	public id: number

	@column()
	public room_id: number

	@column()
	public send_user_id: number

	@column()
	public message: string

	@column()
	public is_edit: boolean

	@column()
	public is_cancel: boolean

	@column()
	public reply_to: number

	@column()
	public trx_id: string

	@column.dateTime({ autoCreate: true })
	public createdAt: DateTime

	@column.dateTime({ autoCreate: true, autoUpdate: true })
	public updatedAt: DateTime
}
