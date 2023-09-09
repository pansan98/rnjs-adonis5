import fs from 'fs'

import mediaConfig from 'Config/media'
import {MediaContract} from 'contracts/media'
import MediaModel from 'App/Models/Media'
import MediaGroupModel from 'App/Models/MediaGroup'

export default class Media {
	public async addpath(path: string) {
		const basepath = mediaConfig.basepath+path
		if(!fs.existsSync(basepath)) {
			fs.mkdirSync(basepath, {
				recursive: true,
				mode: 777
			})
		}
		return this
	}

	public async save(thumbnail: MediaContract) {
		const params = {
			identify_code: thumbnail.identify_code,
			name: thumbnail.name,
			size: thumbnail.size,
			type: thumbnail.type,
			path: thumbnail.value,
			ext: this.extension(thumbnail.name),
			mime: this.ext_for_mime(this.extension(thumbnail.name)),
			media_group_id: (thumbnail.media_group_id) ? thumbnail.media_group_id : null
		}
		const media = await MediaModel.create(MediaModel.filter(params, MediaModel.fillable))
		return media
	}

	// public async multiple_save(thumbnails: MediaArrayContract, media_group_id: number|null) {

	// }

	protected extension(f_name: string) {
		const extensions = f_name.split('.')
		return extensions[extensions.length]
	}

	protected ext_for_mime(mime: string) {
		let ext = ''
		switch(mime) {
			case 'image/jpg':
			case 'image/jpeg':
				ext = 'jpg'
				break
			case 'image/png':
				ext = 'png'
				break
			case 'image/gif':
				ext = 'gif'
				break
		}

		return ext
	}

	public async destroy(id: number) {
		const media = await MediaModel.findOrFail(id)
		await media.delete()
	}

	public async multiple_destroy(id: number) {
		const mediaGroup = await MediaGroupModel.findOrFail(id)
		await mediaGroup.delete()
	}
}