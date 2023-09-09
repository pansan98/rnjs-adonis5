import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'
import { compose } from '@ioc:Adonis/Core/Helpers'
import Common from 'App/Models/Traits/Common'

export default class Media extends compose(BaseModel, Common) {
	public static table = 'medias'

	public static fillable = ['mime', 'type', 'ext', 'size', 'path', 'name', 'identify_code', 'media_group_id']

	@column({ isPrimary: true })
	public id: number

	@column()
	public mime: string|null

	@column()
	public type: string|null

	@column()
	public ext: string|null

	@column()
	public size: number|null

	@column()
	public path: string|null

	@column()
	public name: string|null

	@column()
	public identify_code: string

	@column()
	public media_group_id: number|null

	@column.dateTime({ autoCreate: true })
	public createdAt: DateTime

	@column.dateTime({ autoCreate: true, autoUpdate: true })
	public updatedAt: DateTime
}
