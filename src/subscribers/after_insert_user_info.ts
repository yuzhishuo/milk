import { EventSubscriber, EntitySubscriberInterface, InsertEvent, getConnection } from "typeorm";
import { user_info } from "../entity/user_info";

import { user_status } from "../entity/user_status";

import { UserRight } from "../entity/UserRights"
@EventSubscriber()
export class after_insert_user_info_Subscriber implements EntitySubscriberInterface<user_info>
{
    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    // eslint-disable-next-line @typescript-eslint/no-untyped-public-signature
    public listenTo ()
    {
        return user_info;
    }

    public async afterInsert (event: InsertEvent<user_info>): Promise<void>
    {
        const t = new user_status();
        t.to_email = event.entity.user_email;
        t.status_id = 0;
        await  getConnection().manager.getRepository(user_status).insert(t);

        const t1 = new UserRight();
        t1.to_email = event.entity.user_email;
        await  getConnection().manager.getRepository(UserRight).insert(t1);
    }
}
