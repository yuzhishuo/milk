import { EventSubscriber, EntitySubscriberInterface, InsertEvent, getConnection } from "typeorm";
import { UserInfo } from "../entity/UserInfo";

import { UserStatus } from "../entity/UserStatus";

import { UserRight } from "../entity/UserRights"
@EventSubscriber()
export class after_insert_user_info_Subscriber implements EntitySubscriberInterface<UserInfo>
{
    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    // eslint-disable-next-line @typescript-eslint/no-untyped-public-signature
    public listenTo ()
    {
        return UserInfo;
    }

    public async afterInsert (event: InsertEvent<UserInfo>): Promise<void>
    {
        const t = new UserStatus();
        t.ToTelephoneNumber = event.entity;
        t.status_id = 0;
        await  getConnection().manager.getRepository(UserStatus).insert(t);

        const t1 = new UserRight();
        t1.ToTelephoneNumber = event.entity;
        await  getConnection().manager.getRepository(UserRight).insert(t1);
    }
}
