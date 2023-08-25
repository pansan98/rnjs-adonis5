import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class AppsController {
    public async index({view}: HttpContextContract) {
        return view.render('app')
    }
}
