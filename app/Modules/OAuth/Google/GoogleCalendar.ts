import Env from '@ioc:Adonis/Core/Env'
import {google} from 'googleapis'

import ModuleOAuth from 'App/Modules/OAuth'

import SnsOAuthToken from 'App/Models/SnsOAuthToken'

export default class GoogleCalendar extends ModuleOAuth {
	protected redirect_uri: string

	constructor() {
		super()
		this.client_id = Env.get('OAUTH_GOOGLE_CLIENT_ID')
		this.secret_key = Env.get('OAUTH_GOOGLE_SECRET_KEY')
		this.redirect_uri = Env.get('OAUTH_GOOGLE_REDIRECT_URI')
	}

	// イベント取得
	list(OAuthToken: SnsOAuthToken, options: {
		expireMin?: number,
		expireMax?: number
	}) {
		const googleOAuth = new google.auth.OAuth2(this.client_id, this.secret_key, this.redirect_uri)
		googleOAuth.setCredentials({
			access_token: OAuthToken.token
		})

	}

	// イベント追加
	create(OAuthToken: SnsOAuthToken) {
		const googleOAuth = new google.auth.OAuth2(this.client_id, this.secret_key, this.redirect_uri)
		googleOAuth.setCredentials({
			access_token: OAuthToken.token
		})
		const calendar = google.calendar('v3')
		calendar.events.insert({
			auth: googleOAuth
		})
	}
}