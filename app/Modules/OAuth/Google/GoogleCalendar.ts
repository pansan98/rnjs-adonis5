import Env from '@ioc:Adonis/Core/Env'
import {google} from 'googleapis'

import ModuleOAuth from 'App/Modules/OAuth'
import Logger from 'App/Modules/Logger'

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
	public async list(OAuthToken: SnsOAuthToken, options: {
		expireMin?: number,
		expireMax?: number
	}) {
		const googleOAuth = new google.auth.OAuth2(this.client_id, this.secret_key, this.redirect_uri)
		googleOAuth.setCredentials({
			access_token: OAuthToken.token
		})
		let expire_min: string | undefined
		let expire_max: string | undefined
		if(options?.expireMin) {
			const expire_min_date = new Date(options.expireMin)
			expire_min_date.toLocaleString("ja-JP", { timeZone: "Asia/Tokyo" })
			expire_min = expire_min_date.toISOString()
		}
		if(options?.expireMax) {
			const expire_max_date = new Date(options.expireMax)
			expire_max_date.toLocaleString("ja-JP", { timeZone: "Asia/Tokyo" })
			expire_max = expire_max_date.toISOString()
		}
		
		const calendar = google.calendar({version: 'v3', auth: googleOAuth})
		const res = await calendar.events.list({
			calendarId: OAuthToken.event_id,
			timeMin: expire_min,
			timeMax: expire_max,
			timeZone: 'Asia/Tokyo'
		})

		const events = res.data.items
		return (events) ? events : []
	}

	// イベント追加
	public async create(OAuthToken: SnsOAuthToken, event: {
		summary: string,
		location?: string,
		description?: string,
		start: {
			dateTime: string,
			timeZone: string
		},
		end?: {
			dateTime: string,
			timeZone: string
		},
		attendees?: [
			{email: string}
		]
	}) {
		const googleOAuth = new google.auth.OAuth2(this.client_id, this.secret_key, this.redirect_uri)
		googleOAuth.setCredentials({
			access_token: OAuthToken.token
		})
		const calendar = google.calendar('v3')
		const res = await calendar.events.insert({
			auth: googleOAuth,
			calendarId: OAuthToken.event_id,
			requestBody: event
		}).then((response) => {
			Logger.info(response)
			return response
		}).catch((e) => {
			Logger.info(e)
		})

		if(res?.status === 200) {
			return true
		}
		return false
	}
}