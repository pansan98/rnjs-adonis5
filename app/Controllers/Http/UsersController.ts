import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class UsersController {
    public async index(ctx: HttpContextContract) {
        const p = await ctx.request.all()
    }
}
