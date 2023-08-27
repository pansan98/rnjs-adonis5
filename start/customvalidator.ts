/*
|--------------------------------------------------------------------------
| Preloaded File
|--------------------------------------------------------------------------
|
| Any code written inside this file will be executed during the application
| boot.
|
*/
import Database from '@ioc:Adonis/Lucid/Database'
import { validator } from '@ioc:Adonis/Core/Validator'

validator.rule('dbexists', async (value, [table, column], options) => {
	if(!value) return

	const row = await Database.from(table).select('*').where(column, value).first()
	if(row) {
		options.errorReporter.report(
			options.pointer,
			'dbexists',
			'db exists faild.',
			options.arrayExpressionPointer
		)
	}
})

validator.rule('thumbnail', async (value: [{
	identify_code: string
}], args, options) => {
	if(!value) return

	const thumbnail = value[0]
	if(false) {
		options.errorReporter.report(
			options.pointer,
			'thumbnail',
			'識別できないファイルです。',
			options.arrayExpressionPointer
		)
	}
})