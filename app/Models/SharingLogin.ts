import { DateTime } from 'luxon'
import { BaseModel, column, hasOne, HasOne } from '@ioc:Adonis/Lucid/Orm'
import { compose } from '@ioc:Adonis/Core/Helpers'
import Common from 'App/Models/Traits/Common'
import User from 'App/Models/User'

export default class SharingLogin extends compose(BaseModel, Common) {
	public static table = 'sharing_logins'

	public static fillable = ['user_id', 'os', 'ip']
	
	@column({ isPrimary: true })
	public id: number

	@hasOne(() => User, {
		foreignKey: 'usersId',
		localKey: 'user_id'
	})
	public user: HasOne<typeof User>

	@column()
	public os: string

	@column()
	public ip: string

	@column.dateTime({ autoCreate: true })
	public createdAt: DateTime

	@column.dateTime({ autoCreate: true, autoUpdate: true })
	public updatedAt: DateTime
}
