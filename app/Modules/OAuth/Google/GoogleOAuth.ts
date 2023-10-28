import ModuleOAuth from 'App/Modules/OAuth'
import Env from '@ioc:Adonis/Core/Env'
import {google} from 'googleapis'
import {Credentials} from 'google-auth-library/build/src/auth/credentials'

import SnsOAuthToken from 'App/Models/SnsOAuthToken'
import Logger from 'App/Modules/Logger'

export default class GoogleOAuth extends ModuleOAuth {
	constructor() {
		super()
		this.client_id = Env.get('OAUTH_GOOGLE_CLIENT_ID')
		this.secret_key = Env.get('OAUTH_GOOGLE_SECRET_KEY')
	}

	public async auth(user_id: number) {
		return this.checkToken(user_id)
	}

	public async redirect_oauth() {
		const redirect_uri = Env.get('OAUTH_GOOGLE_REDIRECT_URI')
		const googleOAuth = new google.auth.OAuth2(this.client_id, this.secret_key, redirect_uri)
		const oauth_url = googleOAuth.generateAuthUrl({
			access_type: 'offline',
			scope: ['https://www.googleapis.com/auth/calendar.readonly', 'https://www.googleapis.com/auth/calendar.events'],
			prompt: 'consent'
		})

		return oauth_url
	}

	public async oauthVerify(code: string) {
		const redirect_uri = Env.get('OAUTH_GOOGLE_REDIRECT_URI')
		const googleOAuth = new google.auth.OAuth2(this.client_id, this.secret_key, redirect_uri)
		const tokens: Credentials | null = await googleOAuth.getToken(code).then((tokenResponse) => {
			return tokenResponse?.tokens
		}).catch((e) => {
			Logger.info(e)
			return null
		})
		return tokens
	}

	public async getRefreshToken(access_token: string) {
		const redirect_uri = Env.get('OAUTH_GOOGLE_REDIRECT_URI')
		const googleOAuth = new google.auth.OAuth2(this.client_id, this.secret_key, redirect_uri)
		const refresh_token = await googleOAuth.getTokenInfo(access_token).then((tokenInfo) => {
			Logger.info(tokenInfo)
		})
		return refresh_token
	}

	protected async checkToken(user_id: number) {
		const snsToken = await SnsOAuthToken.query()
			.where('user_id', user_id)
			.where('sns', 'google')
			.first()
		if(snsToken) {
			if(SnsOAuthToken.expire(snsToken)) return true
			// const token = await this.refreshToken(snsToken)
			// if(token) {
			// 	return true
			// }
		}

		return false
	}

	protected async refreshToken(token: SnsOAuthToken) {
		const redirect_uri = Env.get('OAUTH_GOOGLE_REDIRECT_URI')
		const googleOAuth = new google.auth.OAuth2(this.client_id, this.secret_key, redirect_uri)
		googleOAuth.refreshAccessToken()
		return 'a'
	}
}