import { getRepository, InsertResult } from "typeorm";
import { UserInfo } from "../entity/UserInfo";
import { BasicErrorInterface } from "../session/utility/BassMessage";

export type IFindUserErrorMessage = BasicErrorInterface;
export class UserInfoController
{
    private userInfoRepository = getRepository(UserInfo);

    async findByEmail (email: string): Promise<UserInfo>
    {
        return this.userInfoRepository.findOne(email, { select: ["password"] });
    }

    async modify (user: UserInfo): Promise<void>
    {
        await this.userInfoRepository.save(user);
    }

    async findByTelephone (telephone: string): Promise<UserInfo>
    {
        return this.userInfoRepository.findOne(telephone, { select: ["password"] });
    }


    async construct (new_user_info: UserInfo): Promise<InsertResult>
    {
        return this.userInfoRepository.insert(new_user_info);
    }

    async find_user (user_id: string): Promise<UserInfo>
    {
        return this.userInfoRepository.findOneOrFail(user_id);
    }

    async findUser (user_id: string): Promise<UserInfo>
    {
        const telephone = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
        const email = /^1(3|4|5|6|7|8|9)\d{9}$/;

        if( !telephone.test(user_id) && !email.test(user_id))
        {
            return Promise.reject({ status: 0, message: "invail request body" } as IFindUserErrorMessage);
        }

        try
        {
            const user = await this.userInfoRepository.findOneOrFail(user_id, { select:
                // fix simplify
                ["user_id", "PersonPicture", "alias", "birthday", "email", "gender", "nickname", "signature", "telephone_number", ]
            });
            return user;
        }
        catch(e)
        {
            return Promise.reject({ status: 0, message: "operator fail" } as IFindUserErrorMessage);
        }
    }
}