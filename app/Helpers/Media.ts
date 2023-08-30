import fs from 'fs'

import mediaConfig from 'Config/media'
import MediaModel from 'App/Models/Media'
import MediaGroupModel from 'App/Models/MediaGroup'

export default class Media {
	public async addpath(path: string) {
		const basepath = mediaConfig.basepath+path
		if(!fs.existsSync(basepath)) {
			fs.mkdirSync(basepath)
		}
		return this
	}
}