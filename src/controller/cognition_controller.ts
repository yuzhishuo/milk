import { getRepository } from "typeorm";

import { cognition } from "../entity/cognition";
import { UserInfo } from "../entity/UserInfo";

export class cognition_controller
{
    private cognition_repository = getRepository(cognition);

    async insert (owner: UserInfo, beowner: UserInfo): Promise<boolean| string>
    {
        const new_cognition = new cognition();
        new_cognition.owner_user = owner
        new_cognition.beowner_user = beowner;
        try
        {
            const res = await this.cognition_repository.insert(new_cognition);
        }
        catch
        {
            return "insert fail";
        }
        return true;
    }
}