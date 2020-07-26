import { getRepository } from "typeorm";
import { UserRight } from "../entity/UserRights";
import { UserInfoController } from "./UserInfoController";


export class UserRightsController
{
    private userRightRepository = getRepository(UserRight);
    private userInfoController = new UserInfoController;
    public async CanableFind (id: string | number, option: "email"| "telephone" | "id" = "id"): Promise<UserRight>
    {
        return this.userRightRepository.findOne({
            SourceId:  await this.userInfoController.findUser(id, option)
        });
    }
}