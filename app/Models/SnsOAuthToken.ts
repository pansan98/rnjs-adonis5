import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class SnsOAuthToken extends BaseModel {
	@column({ isPrimary: true })
	public id: number

	@column()
	public user_id: number

	@column()
	public sns: string

	@column()
	public token: string

	@column()
	public refresh_token: string

	@column()
	public created_token_at: number

	@column()
	public expire: number

	@column.dateTime({ autoCreate: true })
	public createdAt: DateTime

	@column.dateTime({ autoCreate: true, autoUpdate: true })
	public updatedAt: DateTime

	public static expire(OAuthToken?: SnsOAuthToken) {
		if(!OAuthToken) return false

		const now = new Date()
		const expire = OAuthToken.created_token_at + OAuthToken.expire
		return expire > now.getTime()
	}
}
