export default class String {
	public static random(len: number) {
		const str = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
		let s = ''
		for(let i = 0; i < len; i++) {
			s += str.charAt(Math.floor(Math.random() * str.length))
		}

		return s
	}
}