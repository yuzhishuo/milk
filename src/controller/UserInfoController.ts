import { getRepository, InsertResult } from "typeorm";
import { UserInfo } from "../entity/UserInfo";
import { BasicErrorInterface } from "../session/utility/BassMessage";

export type IFindUserErrorMessage = BasicErrorInterface;
export class UserInfoController
{
    private userInfoRepository = getRepository(UserInfo);

    async modify (user: UserInfo): Promise<void>
    {
        await this.userInfoRepository.save(user);
    }



    // Compatible with previous code  equals FindUser(telephone, "telephone")
    async findByTelephone (telephone: string): Promise<UserInfo>
    {
        return this.findUser(telephone, "telephone");
    }
    // Compatible with previous code
    async FindById (userId: number): Promise<UserInfo>
    {
        return this.findUser(userId);
    }

    async BulkImport(newUserInfoArray: UserInfo[]): Promise<InsertResult>
    {
        return await this.userInfoRepository.insert(newUserInfoArray);
    }

    async Construct (newUserInfo: UserInfo): Promise<InsertResult>
    {
        return await this.userInfoRepository.insert(newUserInfo);
    }

    async find_user (user_id: string | number): Promise<UserInfo>
    {
        return this.userInfoRepository.findOneOrFail(user_id, {cache: true});
    }

    async findUser (user_id: string | number, /* complate */ option: "email"| "telephone" | "id" = "id"): Promise<UserInfo>
    {
        try
        {
            // eslint-disable-next-line no-useless-escape
            const telephone = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
            const email = /^1(3|4|5|6|7|8|9)\d{9}$/;
            

            if(typeof(user_id) === "string")
            {
                function GetLoginType(id: string): string
                {
                    if(telephone.test(id))
                    {
                        return "searchId.email = :id";
                    }
    
                    if(email.test(id))
                    {
                        return "searchId.telephone_number = :id";
                    }
    
                    throw { status: 0, message: "operator fail" } as IFindUserErrorMessage;
                }

                return this.userInfoRepository.createQueryBuilder("searchId").where(GetLoginType(user_id), {id: user_id}).cache(true).getOne();
            }

            return this.userInfoRepository.findOne(user_id, {cache: true});
        }
        catch(e)
        {
            return Promise.reject({ status: 0, message: "operator fail" } as IFindUserErrorMessage);
        }
    }
}