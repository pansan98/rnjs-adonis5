// import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import Controller from 'App/Controllers/Api/BasesController'
import GoogleOAuth from 'App/Modules/OAuth/Google/GoogleOAuth'

export default class BasesController extends Controller {
	protected googleOAuth: GoogleOAuth
	
	constructor(OAuth: GoogleOAuth) {
		super()
		this.googleOAuth = OAuth
	}
}
