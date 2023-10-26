import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
    Route.get('/google', 'GoogleOAuthController.redirect').middleware('myauth')
}).prefix('/oauth/redirect')