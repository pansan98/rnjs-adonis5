import path from 'path'
import Env from '@ioc:Adonis/Core/Env'

const mediaConfig = {
	basepath: path.dirname(__dirname)+'/media/',
	allows: {
		// アップロードする際に許可するもの
		uploads: {
			// 1ファイルにつきMAX MBサイズ
			max_size: Env.get('MEDIA_UPLOAD_MAX_FILE_SIZE', 30),
			// 拡張子
			extensions: Env.get('MEDIA_UPLOAD_EXTENSIONS' , 'jpg,jpeg,JPG,JPEG,png,PNG,gif,GIF'),
			// mime-type
			mimetypes: Env.get('MEDIA_UPLOAD_MIMETYPES', 'image/jpg,image/png,image/gif')
		}
	}
}

export default mediaConfig