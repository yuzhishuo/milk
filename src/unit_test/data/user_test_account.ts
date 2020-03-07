import { Connection } from "typeorm";

import { User } from "../../entity/User";
import { test_data_switch } from "./data_test_switch";
import { UserInfo } from "../../entity/UserInfo"
import * as md5 from "md5"


export async function user_test_account (connection: Connection): Promise<void>
{
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
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

        await connection.manager.save(connection.manager.create(UserInfo, {
            telephone_number: "18630977388",
            nickname: "chat_1",
            gender: 0,
            birthday: `{ new Date().valueOf() }`,
            birthplace: "123",
            password: md5("aoumeior")
        }))
    }

}
