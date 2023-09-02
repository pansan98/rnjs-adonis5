import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'
import { compose } from '@ioc:Adonis/Core/Helpers'
import Common from 'App/Models/Traits/Common'

export default class Follow extends compose(BaseModel, Common) {
	public static table = 'follows'

	@column({ isPrimary: true })
	public id: number

	@column()
	public user_id: number

	@column()
	public followed_id: number

	@column.dateTime({ autoCreate: true })
	public createdAt: DateTime

	@column.dateTime({ autoCreate: true, autoUpdate: true })
	public updatedAt: DateTime

	public static async add(myid: number, followid: number) {
		return await Follow.create({
			user_id: myid,
			followed_id: followid
		})
	}

	public static async remove(myid: number, followid: number) {
		const follow = await Follow.query()
			.where('user_id', myid)
			.where('followed_id', followid)
			.first()
		if(follow) {
			await follow.delete()
		}

		// 相手側もフォローしていたら外す
		const followed = await Follow.query()
			.where('user_id', followid)
			.where('followed_id', myid)
			.first()
		if(followed) {
			await followed.delete()
		}
	}
}
