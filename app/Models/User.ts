import { DateTime } from 'luxon'
import Database from '@ioc:Adonis/Lucid/Database'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'
import { compose } from '@ioc:Adonis/Core/Helpers'
import Hash from '@ioc:Adonis/Core/Hash'
import String from 'App/Helpers/String'
import Common from 'App/Models/Traits/Common'
import MediaModel from 'App/Models/Media'
import FollowModel from 'App/Models/Follow'

export default class User extends compose(BaseModel, Common) {
	public static table = 'users'

	public static fillable = ['username', 'login_id', 'email', 'password', 'profession', 'gender', 'identify_code', 'social_uniq', 'thumbnail_id', 'active_sharing_id', 'two_authorize_flag', 'active_flag', 'delete_flag']

	public static gender = {
		1: '男性',
		2: '女性',
		3: 'カスタム'
	}

	@column({ isPrimary: true })
	public id: number

	@column()
	public username: string

	@column()
	public login_id: string

	@column()
	public email: string | null

	// JSONにシリアル化するときにプロパティを削除する
	@column({ serializeAs: null })
	public password: string

	@column()
	public profession: string | null

	@column()
	public gender: number | null

	@column()
	public identify_code: string

	@column({ serializeAs: null })
	public social_uniq: string | null

	@column({ serializeAs: null })
	public thumbnail_id: number|null

	@column({ serializeAs: null })
	public active_sharing_id: number|null

	@column()
	public two_authorize_flag: boolean

	@column()
	public active_flag: number

	@column()
	public delete_flag: number

	@column.dateTime({ autoCreate: true })
	public createdAt: DateTime

	@column.dateTime({ autoCreate: true, autoUpdate: true })
	public updatedAt: DateTime

	public static boot() {
		if(this.booted) {
			return
		}
		super.boot()
		this.before('create', async (inst) => {
			if(inst.$dirty.password) {
				inst.password = await Hash.make(inst.password)
			}
		})
	}

	public static async newUser(params: {
		username: string,
		login_id: string,
		password: string,
		email: string|null
	}) {
		const inputs = User.assign(params, {identify_code: String.random(20)})
		return await User.create(User.filter(inputs, User.fillable))
	}

	public static async verify(ipw: string, user: User) {
		return await Hash.verify(user.password, ipw)
	}

	public static async profile(idf: string) {
		return await Database.from(User.table)
			.select(
				'users.username',
				'users.profession',
				'users.gender',
				'users.two_authorize_flag',
				'users.active_flag',
				'users.thumbnail_id',
				MediaModel.table+'.path AS thumbnail_path'
			)
			.leftJoin(MediaModel.table, 'users.thumbnail_id', '=', MediaModel.table+'.id')
			.where('users.identify_code', idf)
			.where('users.delete_flag', 0)
			.first()
	}

	public static async get(idf: string) {
		return await User.query()
			.where('identify_code', idf)
			.where('users.delete_flag', 0)
			.first()
	}

	public static async labels(label: string) {
		let labels = {}
		switch(label) {
			case 'gender':
				labels = User.gender
				break
		}

		return labels
	}

	public static async username_search(myid: number, idf:string, word: string) {
		return await Database.from(User.table)
			.select(
				User.table+'.username',
				User.table+'.identify_code',
				User.table+'.active_flag',
				MediaModel.table+'.path AS thumbnail_path'
			)
			.leftJoin(MediaModel.table, User.table+'.thumbnail_id', '=', MediaModel.table+'.id')
			.where(User.table+'.identify_code', '!=', idf)
			.where(User.table+'.delete_flag', 0)
			.whereILike(User.table+'.username', '%'+word+'%')
			.whereNotIn(User.table+'.id', (query) => {
				query.from(FollowModel.table)
					.select('followed_id')
					.where('user_id', myid)
			})
			.orderBy(User.table+'.created_at', 'asc')
			.exec()
	}
}
