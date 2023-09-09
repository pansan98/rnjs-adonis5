import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'
import { compose } from '@ioc:Adonis/Core/Helpers'
import Common from 'App/Models/Traits/Common'

export default class Mail extends compose(BaseModel, Common) {
	public static table = 'mails'

	@column({ isPrimary: true })
	public id: number

	@column()
	public pagename: string

	@column()
	public to: string

	@column()
	public body: string

	@column()
	public system_message?: {}

	@column.dateTime({ autoCreate: true })
	public createdAt: DateTime

	@column.dateTime({ autoCreate: true, autoUpdate: true })
	public updatedAt: DateTime

	public static async log(page: string, to: string, body: string, system?: {}) {
		return await Mail.create({
			pagename: page,
			to: to,
			body: body,
			system_message: system
		})
	}
}
