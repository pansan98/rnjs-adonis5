import { DateTime } from 'luxon'
import { BaseModel, column, hasOne, HasOne } from '@ioc:Adonis/Lucid/Orm'
import { compose } from '@ioc:Adonis/Core/Helpers'
import Hash from '@ioc:Adonis/Core/Hash'
import String from 'App/Helpers/String'
import Common from 'App/Models/Traits/Common'
import Media from 'App/Models/Media'
import SharingLogin from 'App/Models/SharingLogin'

export default class User extends compose(BaseModel, Common) {
	public static table = 'users'

	public static fillable = ['username', 'login_id', 'email', 'password', 'profession', 'gender', 'identify_code', 'social_uniq', 'thumbnail_id', 'active_sharing_id', 'two_authorize_flag', 'active_flag', 'delete_flag']

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

	@hasOne(() => Media, {
		localKey: 'thumbnail_id',
		foreignKey: 'id'
	})
	public thumbnail: HasOne<typeof Media>

	@hasOne(() => SharingLogin, {
		localKey: 'active_sharing_id',
		foreignKey: 'id'
	})
	public active_sharing: HasOne<typeof SharingLogin>

	@column()
	public two_authorize_flag: number

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
		params = User.assign(params, {identify_code: String.random(20)})
		return await User.create(User.filter(params, User.fillable))
	}
}
