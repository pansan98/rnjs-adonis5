import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Env from '@ioc:Adonis/Core/Env'
import querystring from 'querystring'

import GoogleOAuth from 'App/Modules/OAuth/Google/GoogleOAuth'

import UserModel from 'App/Models/User'
import SnsOAuthToken from 'App/Models/SnsOAuthToken'

export default class GoogleOAuthController {
	public async redirect(ctx: HttpContextContract) {
		const domain = Env.get('MY_DOMAIN')
		const query = querystring.stringify(ctx.request.qs())
		return ctx.response.redirect(domain+'/oauth/verify/google?'+query)
	}

	public async verify(ctx: HttpContextContract) {
		const idf = await ctx.session.get('identify', null)
		if(idf) {
			const user = await UserModel.get(idf)
			if(user) {
				const oauth = new GoogleOAuth()
				const code = ctx.request.qs()?.code
				const tokens = await oauth.oauthVerify(code)
				if(tokens?.access_token && tokens?.refresh_token && tokens?.expiry_date) {
					const dataOAuth = await SnsOAuthToken.exists(user.id, 'google')
					const event_id = await oauth.myEventId(tokens.access_token)
					if(!dataOAuth) {
						await SnsOAuthToken.create({
							user_id: user.id,
							event_id: event_id,
							sns: 'google',
							token: tokens.access_token,
							refresh_token: tokens.refresh_token,
							created_token_at: new Date().getTime(),
							expire: tokens.expiry_date
						})
					} else {
						dataOAuth.merge({
							event_id: event_id,
							token: tokens.access_token,
							refresh_token: tokens.refresh_token,
							created_token_at: new Date().getTime(),
							expire: tokens.expiry_date
						})
						await dataOAuth.save()
					}
					return await ctx.view.render('app', {
						app_name: Env.get('APP_NAME'),
						jsdata: {
							sns: 'Google'
						}
					})
				}
			}
		}

		ctx.response.status(400)
	}
}
