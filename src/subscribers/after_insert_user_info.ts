import {EventSubscriber, EntitySubscriberInterface, InsertEvent, getRepository} from "typeorm";
import {user_info} from "../entity/user_info";

import {user_status} from "../entity/user_status";

@EventSubscriber()
export class after_insert_user_info_Subscriber implements EntitySubscriberInterface<user_info> {

    private  user_status_repository = getRepository(user_status);
    listenTo()
    {
        return user_info;
    }

    async beforeInsert(event: InsertEvent<user_info>)
    {
        let t = new user_status();
        t.to_email = event.entity.user_email;
        this.user_status_repository.save(t);
    }
}