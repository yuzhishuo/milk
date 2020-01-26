import { getRepository } from "typeorm";

import {cognition} from "../entity/cognition";
import { user_info } from "../entity/user_info";

export class cognition_controller
{
    private cognition_repository = getRepository(cognition);

    async insert(owner: user_info, beowner: user_info)
    {
        let new_cognition = new cognition();
        new_cognition.owner_user = owner
        new_cognition.beowner_user = beowner;
        let res = await this.cognition_repository.insert(new_cognition);
    }
}