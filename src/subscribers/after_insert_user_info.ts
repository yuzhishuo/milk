import {EventSubscriber, EntitySubscriberInterface, InsertEvent, getConnection} from "typeorm";
import {user_info} from "../entity/user_info";

import {user_status} from "../entity/user_status";

@EventSubscriber()
export class after_insert_user_info_Subscriber implements EntitySubscriberInterface<user_info>
{
    listenTo()
    {
        return user_info;
    }

    async afterInsert(event: InsertEvent<user_info>)
    {
        let t = new user_status();
        t.to_email = event.entity.user_email;
        t.status_id = 0;
        await  getConnection().manager.getRepository(user_status).insert(t);
    }
}