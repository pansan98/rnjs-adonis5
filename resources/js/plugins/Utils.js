class Utils {
	constructor(){}

	dateformat(date, format) {
		if(typeof format === 'undefined') {
			format = 'yyyy年mm月dd日'
		}
		const d = new Date(date)

		format = format.replace(/yyyy/g, d.getFullYear())
		format = format.replace(/mm/g, (d.getMonth() + 1))
		format = format.replace(/dd/g, d.getDate())

		return format;
	}

	numberformat(number) {
		const formatter = new Intl.NumberFormat('ja-jp')
		return formatter.format(number)
	}

	static random(len) {
		const str = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_-'
		let s = ''
		for(let i = 0; i < len; i++) {
			s += str.charAt(Math.floor(Math.random() * str.length))
		}

		return s
	}

	async apiHandler(method, endpoint, params, final) {
		method = method.toUpperCase()
		const d_params = {credentials: 'same-origin'}
		let p = {}
		if(typeof params === 'object') {
			p = Object.assign(d_params, params)
		} else {
			p = d_params
		}
		
		return new Promise((resolve, reject) => {
			if(method === 'POST') {
				axios.post(endpoint, p).then((res) => {
					if(typeof res.data.login !== 'undefined') {
						if(!res.data.login) {
							reject({error: 'regenerate login'})
						}
					}
					resolve(res)
				}).catch((e) => {
					reject(e)
					this.errorHandler(e)
				}).finally(() => {
					if(typeof final === 'function') {
						final()
					}
				})
			} else {
				axios.get(endpoint, p).then((res) => {
					if(typeof res.data.login !== 'undefined') {
						if(!res.data.login) {
							reject({error: 'regenerate login'})
						}
					}
					resolve(res)
				}).catch((e) => {
					reject(e)
					this.errorHandler(e)
				}).finally(() => {
					if(typeof final === 'function') {
						final()
					}
				})
			}
		})
	}

	errorHandler(e) {
		throw new Error(e.message)
	}

	static async wait(sec) {
		return new Promise((resolve) => {
			setTimeout(() => {
				resolve()
			}, sec)
		})
	}
}

export default Utils