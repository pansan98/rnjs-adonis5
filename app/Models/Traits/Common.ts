import { BaseModel } from '@ioc:Adonis/Lucid/Orm'
import Database, { DatabaseQueryBuilderContract } from '@ioc:Adonis/Lucid/Database'
import { NormalizeConstructor } from '@ioc:Adonis/Core/Helpers'
import _ from 'lodash'

const Common = <T extends NormalizeConstructor<typeof BaseModel>>(
	CommonTrait: T
) => {
	return class extends CommonTrait {
		public static filter(params: {}, fillables: string[]) {
			if(typeof params === 'object') {
				const nots = []
				for(let k in params) {
					if(!fillables.includes(k)) {
						nots.push(k)
					}
				}

				if(nots.length) {
					nots.map(n => {
						delete params[n]
					})
				}
			}
	
			return params
		}

		public static assign(params?: {}, merge?: {}): {} {
			if(!params) {
				params = {}
			}
			return Object.assign(params, merge)
		}

		public static async overwrapquery(table: string) {
			const query = await Database.from(table)
			return query
		}
	}
}

export default Common