import { getRepository } from "typeorm";
import { UserRight } from "../entity/UserRights";
import { UserInfo } from "../entity/UserInfo";


export class UserRightsController
{
    private userRightRepository = getRepository(UserRight);
    private userInfoRepository = getRepository(UserInfo)
    public async CanableFind (id: string): Promise<UserRight>
    {
        return this.userRightRepository.findOne({
            ToTelephoneNumber:  await this.userInfoRepository.findOne(id)
        });
    }
}