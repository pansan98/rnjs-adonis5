import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
    Route.get('/google', 'GoogleOAuthController.redirect')
}).prefix('/oauth/redirect')

Route.group(() => {
    Route.get('/google', 'GoogleOAuthController.verify')
}).prefix('/oauth/verify')