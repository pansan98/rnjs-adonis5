import type { SessionContract } from '@ioc:Adonis/Addons/Session';

import UserModel from 'App/Models/User'

export default class Auth {
    public static async retension(session: SessionContract, identify: string) {
        const user = await UserModel.query()
            .where('identify_code', identify)
            .first()
        if(user) {
            user.merge({
                active_flag: 1
            })
            await user.save()
            await session.put('identify', identify)
        }
    }
}