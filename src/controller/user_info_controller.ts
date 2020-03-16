import { getRepository, InsertResult } from "typeorm";
import { UserInfo } from "../entity/UserInfo";

export class user_info_controller
{
    private user_info_repository = getRepository(UserInfo);

    async findByEmail (email: string): Promise<UserInfo>
    {
        return this.user_info_repository.findOne(email, { select: ["password"] });
    }

    async findByTelephone (telephone: string): Promise<UserInfo>
    {
        return this.user_info_repository.findOne(telephone, { select: ["password"] });
    }

    async construct (new_user_info: UserInfo): Promise<InsertResult>
    {
        return this.user_info_repository.insert(new_user_info);
    }

    async find_user (user_id: string| number): Promise<UserInfo>
    {
        if(typeof(user_id) == 'string')
        {
            return await this.user_info_repository.findOneOrFail(user_id)
        }

        return await this.user_info_repository.findOneOrFail(user_id)
    }
}