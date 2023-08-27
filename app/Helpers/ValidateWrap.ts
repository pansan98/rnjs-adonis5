type ErrorsArgsApi = {
	errors: [
		{
			field: string,
			rule: string,
			message: string
		}
	]
}

export default class ValidateWrap {
	public static apiwrap(arg: ErrorsArgsApi) {
		const messages = {}
		arg.errors.map((error) => {
			messages[error.field] = error.message
		})
		return messages
	}
}