import { Connection } from "typeorm";
import { TestDataSwitch } from "./Option";
import { UserInfo } from "../../entity/UserInfo"
import * as md5 from "md5"


export async function UserTestAccount (connection: Connection): Promise<void>
{
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if(TestDataSwitch)
    {
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
