import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class BasesController {
    public async success(ctx: HttpContextContract, params?: {}) {
        ctx.response.status(200).json(Object.assign({result: true}, params))
    }

    public async fail(ctx: HttpContextContract, params?: {}) {
        ctx.response.status(400).json(Object.assign({result: false}, params))
    }
}
