import { getRepository, Equal } from "typeorm";
import { UserRight } from "../entity/UserRights";


export class UserRightsController
{
    private userRepository = getRepository(UserRight);

    public async CanableFind (id: string): Promise<UserRight>
    {
        return this.userRepository.findOne({
            ToTelephoneNumber: Equal(id)
        });
    }
}