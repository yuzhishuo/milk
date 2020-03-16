import { getRepository } from "typeorm";

import { Cognition } from "../entity/Cognition";
import { UserInfo } from "../entity/UserInfo";

export class CognitionController
{
    private cognition_repository = getRepository(Cognition);

    async insert (owner: UserInfo, beowner: UserInfo): Promise<boolean| string>
    {
        const newCognition = new Cognition();
        newCognition.owner_user = owner
        newCognition.beowner_user = beowner;
        try
        {
            await this.cognition_repository.insert(newCognition);
        }
        catch
        {
            return "insert fail";
        }
        return true;
    }
}