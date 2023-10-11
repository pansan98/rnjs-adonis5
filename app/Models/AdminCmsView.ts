import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'
import Database from '@ioc:Adonis/Lucid/Database'

export default class AdminCmsView extends BaseModel {
	public static table = 'admin_cms_views'
  
	@column({ isPrimary: true })
	public id: number

	@column()
	public user_id: number

	@column()
	public morphs_id: number

	@column()
	public morphs_type: string

	@column.dateTime({ autoCreate: true })
	public createdAt: DateTime

	@column.dateTime({ autoCreate: true, autoUpdate: true })
	public updatedAt: DateTime

	public static async findviews(user_id: number, type: string) {
		return await Database.from(AdminCmsView.table)
			.select('morphs_id')
			.where('user_id', user_id)
			.where('morphs_type', type)
			.exec()
	}
}
