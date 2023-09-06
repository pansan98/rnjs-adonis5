import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'
import { compose } from '@ioc:Adonis/Core/Helpers'
import Common from 'App/Models/Traits/Common'
import Database from '@ioc:Adonis/Lucid/Database'
import UserModel from 'App/Models/User'
import MediaModel from 'App/Models/Media'

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

	public static async myfollows(myid: number) {
		return await Database.from(Follow.table)
			.select(UserModel.table+'.username', UserModel.table+'.identify_code')
			.select(MediaModel.table+'.path AS thumbnail_path')
			.join(UserModel.table, UserModel.table+'.id', '=', Follow.table+'.followed_id')
			.leftJoin(MediaModel.table, MediaModel.table+'.id', '=', UserModel.table+'.thumbnail_id')
			.where(Follow.table+'.user_id', myid)
			.where(UserModel.table+'.id', '!=', myid)
			.where(UserModel.table+'.delete_flag', 0)
			.exec()
	}

	public static async unmyfollows(myid: number) {
		return await Database.from(Follow.table)
			.select(UserModel.table+'.username', UserModel.table+'.identify_code')
			.select(MediaModel.table+'.path AS thumbnail_path')
			.join(UserModel.table, UserModel.table+'.id', '=', Follow.table+'.user_id')
			.leftJoin(MediaModel.table, MediaModel.table+'.id', '=', UserModel.table+'.thumbnail_id')
			.where('followed_id', myid)
			.whereNotIn(Follow.table+'.id', (query) => {
				query.from(Follow.table)
					.select(Follow.table+'.id')
					.where(Follow.table+'.user_id', myid)
			})
			.exec()
	}

	public static async countunfollower(myid: number) {
		const result = await Follow.query()
			.count('id AS un_count')
			.where('followed_id', myid)
			.whereNotIn('id', (query) => {
				query.select('id')
					.where('user_id', myid)
			})
			.exec()
		return BigInt(result[0].$extras.un_count)
	}
}
