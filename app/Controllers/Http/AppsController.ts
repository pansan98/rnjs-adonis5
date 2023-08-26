import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Env from '@ioc:Adonis/Core/Env'

export default class AppsController {
    public async index({view}: HttpContextContract) {
        return await view.render('app', {
            app_name: Env.get('APP_NAME')
        })
    }
}
