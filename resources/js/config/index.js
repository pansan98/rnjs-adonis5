'use strict'

const admin_content_manager_host = 'http://strapi.local'

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
		},
		cms: {
			topics: '/cms/topics'
		},
		google: {
			calendar: '/google/calendar'
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
		follow: {
			list: '/api/follow/list',
			search: '/api/follow/search',
			add: '/api/follow/add',
			remove: '/api/follow/remove',
			conf: '/api/follow/conf'
		},
		contact: {
			confirm: '/api/contact/confirm',
			send: '/api/contact/send',
			back: '/api/contact/back'
		},
		chat: {
			log: '/api/chat/log/',
			start: '/api/chat/start/',
			read: '/api/chat/read/',
			bulkread: '/api/chat/bulkread/'
		},
		morphs: {
			admin: {
				topics: {
					views: '/api/morphs/admin/topics',
					viewed: '/api/morphs/admin/topics/viewed'
				}
			}
		},
		external: {
			cms: {
				topics: admin_content_manager_host+'/api/topics'
			}
		}
	},
	noimage: '/assets/img/no-image.jpg',
	link: (name) => {
		
	}
}

export default Config