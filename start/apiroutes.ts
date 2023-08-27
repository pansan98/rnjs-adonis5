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