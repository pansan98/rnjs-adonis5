import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
	Route.post('/login', 'AuthController.login')
	Route.post('/logout', 'AuthController.logout')
	Route.post('/register', 'AuthController.register')
	Route.post('/forgot', 'AuthController.forgot')
	Route.post('/profile', 'AuthController.profile')
	Route.post('/profile/thumbnail/destroy', 'AuthController.thumbnail_destroy')
	Route.get('/user', 'AuthController.user')
	Route.get('/user/labels', 'AuthController.labels')

	Route.post('/sharing/use', 'SharingController.use')
}).prefix('/api/auth').namespace('App/Controllers/Api')

Route.group(() => {
	Route.post('/add/:idf', 'FollowsController.add')
		//.where('idf', /^[a-zA-Z0-9]$/)
	Route.post('/remove/:idf', 'FollowsController.remove')
		//.where('idf', /^[a-zA-Z0-9]$/)
	Route.get('/list', 'FollowsController.list')
	Route.get('/search', 'FollowsController.search')
	// 相手側からのフォロー数
	Route.get('/conf', 'FollowsController.conf')
}).prefix('/api/follow').namespace('App/Controllers/Api')

Route.group(() => {
	Route.post('/confirm', 'ContactController.confirm')
	Route.post('/send', 'ContactController.send')
	Route.post('/back', 'ContactController.back')
}).prefix('/api/contact').namespace('App/Controllers/Api')