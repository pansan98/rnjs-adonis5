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
		const ids: number[] = []
		const results: {morphs_id: number}[] = await Database.from(AdminCmsView.table)
			.select('morphs_id')
			.where('user_id', user_id)
			.where('morphs_type', type)
			.exec()
		
		if(results.length) {
			results.map((result: {morphs_id: number}) => {
				ids.push(result.morphs_id)
			})
		}
		return ids
	}

	public static async morphs_viewed(user_id: number, morphs_id: number, morphs_type: string) {
		const morphs = await AdminCmsView.query()
			.where('user_id', user_id)
			.where('morphs_id', morphs_id)
			.where('morphs_type', morphs_type)
			.first()
		if(!morphs) {
			await AdminCmsView.create({
				user_id: user_id,
				morphs_id: morphs_id,
				morphs_type: morphs_type
			})
		}
	}
}
