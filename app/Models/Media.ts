import { DateTime } from 'luxon'
import { BaseModel, column, hasOne, HasOne } from '@ioc:Adonis/Lucid/Orm'
import MediaGroup from 'App/Models/MediaGroup'

export default class Media extends BaseModel {
	public static table = 'medias'

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

	@hasOne(() => MediaGroup, {
		localKey: 'media_group_id',
		foreignKey: 'id'
	})
	public media_group: HasOne<typeof MediaGroup>

	@column.dateTime({ autoCreate: true })
	public createdAt: DateTime

	@column.dateTime({ autoCreate: true, autoUpdate: true })
	public updatedAt: DateTime
}
