import log4js from 'log4js'
import fs from 'node:fs'
import path from 'node:path'

class Logger {
	public static async info(trace: any) {
		// const log: string = Logger.getpath('info')
		// Logger.logexists(log)
		log4js.configure('./.log4js-config.json')
		const logger = log4js.getLogger()
		//logger.addContext('logpath', log)
		logger.info(trace)
	}

	public static async logexists(f: string) {
		if(!fs.existsSync(f)) {
			fs.writeFileSync(f, '')
		}
	}

	public static getpath(type: string) {
		const root = path.dirname(__filename)+'/../../../'
		const now = new Date()
		const y = now.getFullYear()
		const m = now.getMonth() + 1
		const d = now.getDay()
		const storage = root+'logs/'
		if(!fs.existsSync(storage)) {
			fs.mkdirSync(storage, {
				recursive: true
			})
		}
		const log = storage+y+'-'+m+'-'+d+'-'+type+'.log'
		return log
	}
}

export default Logger