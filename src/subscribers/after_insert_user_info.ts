import { EventSubscriber, EntitySubscriberInterface, InsertEvent, getRepository } from "typeorm";
import { UserInfo } from "../entity/UserInfo";
import { UserStatus } from "../entity/UserStatus";
import { UserRight } from "../entity/UserRights";


@EventSubscriber()
export class after_insert_user_info_Subscriber implements EntitySubscriberInterface<UserInfo>
{
    public listenTo () : any
    {
        return UserInfo;
    }

    public async afterInsert (event: InsertEvent<UserInfo>): Promise<void>
    {
        const t = new UserStatus();
        t.SourceId = event.entity;
        t.status_id = 0;
        await  getRepository(UserStatus).insert(t);

        const t1 = new UserRight();
        t1.SourceId = event.entity;
        await  getRepository(UserRight).insert(t1);
    }
}
