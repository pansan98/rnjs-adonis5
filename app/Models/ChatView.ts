import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'
import { compose } from '@ioc:Adonis/Core/Helpers'
import Common from 'App/Models/Traits/Common'
import Database from '@ioc:Adonis/Lucid/Database'

export default class ChatView extends compose(BaseModel, Common) {
	public static table = 'chat_views'

	@column({ isPrimary: true })
	public id: number

	@column()
	public chat_id: number

	@column()
	public receive_user_id: number

	@column()
	public viewed: boolean

	public static async totalUnread(myid: number) {
		const result = await ChatView.query()
			.count('id AS total')
			.where('receive_user_id', myid)
			.where('viewed', false)
			.exec()

		return parseInt(result[0].$extras.total)
	}

	public static async totalUnreads(myid: number) {
		const results: {id: number}[] = await Database.from(ChatView.table)
			.select('id')
			.where('receive_user_id', myid)
			.where('viewed', false)
			.exec()

		const unviews: number[] = []
		if(results.length) {
			results.map((result: {id: number}) => {
				unviews.push(result.id)
			})
		}
		return unviews
	}

	public static async roomUnreads(myid: number, room_id: number) {
		const results: {id: number}[] = await Database.from(ChatView.table)
			.select('id')
			.where('receive_user_id', myid)
			.where('room_id', room_id)
			.where('viewed', false)
			.exec()
		const unviews: number[] = []
		if(results.length) {
			results.map((result: {id: number}) => {
				unviews.push(result.id)
			})
		}
		return unviews
		// return await ChatView.query()
		// 	.select('id')
		// 	.where('receive_user_id', myid)
		// 	.where('room_id', room_id)
		// 	.where('viewed', false)
		// 	.exec()
	}
}
