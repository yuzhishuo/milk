import { Connection } from "typeorm";
import { User } from "../../entity/User";

import { test_data_switch } from "./data_test_switch";

import { user_info } from "../../entity/user_info"
import { user_status } from "../../entity/user_status"

import * as md5 from "md5"


export async function user_test_account (connection: Connection): Promise<void>
{
    if(test_data_switch)
    {
        await connection.manager.save(connection.manager.create(User, {
            firstName: "Timber",
            lastName: "Saw",
            age: 27
        }));
        await connection.manager.save(connection.manager.create(User, {
            firstName: "Phantom",
            lastName: "Assassin",
            age: 24
        }));

        await connection.manager.save(connection.manager.create(user_info,{
            user_email: "990183536@qq.com",
            nickname: "chat_1",
            gender: 0,
            birthday: `{ new Date().valueOf() }`,
            birthplace: "123",
            password: md5("aoumeior")
        }))
    }

}
