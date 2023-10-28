import ModuleOAuth from 'App/Modules/OAuth'
import Env from '@ioc:Adonis/Core/Env'
import {google} from 'googleapis'
import {Credentials} from 'google-auth-library/build/src/auth/credentials'

import SnsOAuthToken from 'App/Models/SnsOAuthToken'
import Logger from 'App/Modules/Logger'

export default class GoogleOAuth extends ModuleOAuth {
	protected scopes: string[]
	constructor() {
		super()
		this.client_id = Env.get('OAUTH_GOOGLE_CLIENT_ID')
		this.secret_key = Env.get('OAUTH_GOOGLE_SECRET_KEY')
		this.scopes = [
			'https://www.googleapis.com/auth/calendar.readonly',
			'https://www.googleapis.com/auth/calendar.events',
			'https://www.googleapis.com/auth/userinfo.email'
		]
	}

	public async auth(user_id: number) {
		return this.checkToken(user_id)
	}

	public async redirect_oauth() {
		const redirect_uri = Env.get('OAUTH_GOOGLE_REDIRECT_URI')
		const googleOAuth = new google.auth.OAuth2(this.client_id, this.secret_key, redirect_uri)
		const oauth_url = googleOAuth.generateAuthUrl({
			access_type: 'offline',
			scope: this.scopes,
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
		// gmailが必要(リフレッシュトークン時も)
		googleOAuth.getTokenInfo('')
		return tokens
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

	protected async refreshToken(OAuthToken: SnsOAuthToken) {
		const redirect_uri = Env.get('OAUTH_GOOGLE_REDIRECT_URI')
		const googleOAuth = new google.auth.OAuth2(this.client_id, this.secret_key, redirect_uri)
		googleOAuth.setCredentials({
			refresh_token: OAuthToken.refresh_token,
			access_token: OAuthToken.token,
			token_type: 'offline'
		})
		const tokens: Credentials | null = await googleOAuth.refreshAccessToken().then((refreshTokenResponse) => {
			return refreshTokenResponse?.credentials
		}).catch((e) => {
			Logger.info(e)
			return null
		})

		if(tokens?.access_token && tokens?.expiry_date) {
			OAuthToken.merge({
				token: tokens.access_token,
				expire: tokens.expiry_date,
				created_token_at: new Date().getTime()
			})
			await OAuthToken.save()
			return true
		}
		return false
	}
}