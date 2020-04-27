import { getRepository, InsertResult } from "typeorm";
import { UserInfo } from "../entity/UserInfo";

export class UserInfoController
{
    private user_info_repository = getRepository(UserInfo);

    async findByEmail (email: string): Promise<UserInfo>
    {
        return this.user_info_repository.findOne(email, { select: ["password"] });
    }

    async modify (user: UserInfo): Promise<void>
    {
        await this.user_info_repository.save(user);
    }

    async findByTelephone (telephone: string): Promise<UserInfo>
    {
        return this.user_info_repository.findOne(telephone, { select: ["password"] });
    }

    async construct (new_user_info: UserInfo): Promise<InsertResult>
    {
        return this.user_info_repository.insert(new_user_info);
    }

    async find_user (user_id: string): Promise<UserInfo>
    {
        return await this.user_info_repository.findOneOrFail(user_id)
    }
}