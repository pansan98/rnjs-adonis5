import ModuleOAuth from 'App/Modules/OAuth'
import Env from '@ioc:Adonis/Core/Env'
import {google} from 'googleapis'

import SnsOAuthToken from 'App/Models/SnsOAuthToken'

export default class GoogleOAuth extends ModuleOAuth {
	private client_id: string
	private secret_id: string

	constructor() {
		super()
		this.client_id = Env.get('OAUTH_GOOGLE_CLIENT_ID')
		this.secret_id = Env.get('OAUTH_GOOGLE_SECRET_ID')
	}

	public async auth(user_id: number) {
		return this.checkToken(user_id)
	}

	public async redirect_oauth() {
		const redirect_uri = Env.get('OATUH_GOOGLE_REDIRECT_URI')
		const googleOAuth = new google.auth.OAuth2(this.client_id, this.secret_id, redirect_uri)
		const oauth_url = googleOAuth.generateAuthUrl({
			access_type: 'offline',
			scope: ['https://www.googleapis.com/auth/calendar.readonly', 'https://www.googleapis.com/auth/calendar.events']
		})

		return oauth_url
	}

	protected async checkToken(user_id: number) {
		const snsToken = await SnsOAuthToken.query()
			.where('user_id', user_id)
			.where('sns', 'google')
			.first()
		if(snsToken) {
			if(SnsOAuthToken.expire(snsToken)) return true
			const token = await this.refreshToken(snsToken)
			if(token) {
				return true
			}
		}

		return false
	}

	protected async refreshToken(token: SnsOAuthToken) {

		return 'a'
	}
}