import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import UserModel from 'App/Models/User'

export default class MyMember {
	public async handle({session, response}: HttpContextContract, next: () => Promise<void>) {
		// code for middleware goes here. ABOVE THE NEXT CALL
		const identify = await session.get('identify', null)
		if(identify) {
			const user = await UserModel.query()
				.where('identify_code', identify)
				.where('delete_flag', 0)
				.first()
			if(user) {
				response.redirect('/')
				return
			}
		}
		await next()
	}
}
