'use strict'

const Config = {
	links : {
		auth: {
			login: '/auth/login',
			register: '/auth/register',
			forgot: '/auth/forgot'
		},
		home: '/',
		contact: '/contact',
		stopWatch: 'stop-watch',
		profile: '/my/profile',
		shop: {
			home: '/shop'	
		},
		ec: {
			home: '/ec'
		}
	},
	api: {
		auth: {
			login: '/api/auth/login',
			register: '/api/auth/register',
			logout: '/api/auth/logout',
			user: ' /api/auth/user',
			userlabels: '/api/auth/user/labels',
			sharinguse: '/api/auth/sharing/use'
		}
	},
	link: (name) => {
		
	}
}

export default Config