'use strict'

const Config = {
	links : {
		home: '/',
		auth: {
			login: '/auth/login',
			register: '/auth/register',
			forgot: '/auth/forgot',
			authorize: '/auth/authorize/:identify/:token',
			password: '/auth/password/:identify/:token'
		},
		contact: '/contact',
		stopWatch: 'stop-watch',
		profile: '/my/profile',
		follow: '/my/follows',
		shop: {
			home: '/shop',
			create: '/shop/create',
			edit: '/shop/edit/:code',
			views: '/shop/views/:code'
		},
		ec: {
			home: '/ec',
			product: '/ec/product/:code',
			cart: '/ec/cart',
			favorites: '/ec/favorites',
			history: '/ec/history',
			review: '/ec/review/:code'
		}
	},
	api: {
		auth: {
			login: '/api/auth/login',
			register: '/api/auth/register',
			logout: '/api/auth/logout',
			user: ' /api/auth/user',
			userlabels: '/api/auth/user/labels',
			sharinguse: '/api/auth/sharing/use',
			profile: '/api/auth/profile'
		},
		follow: '/api/follow/list'
	},
	noimage: '/assets/img/no-image.jpg',
	link: (name) => {
		
	}
}

export default Config