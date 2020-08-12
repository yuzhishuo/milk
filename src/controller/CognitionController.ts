import { getRepository } from "typeorm";
import { Cognition } from "../entity/Cognition";
import { UserInfo } from "../entity/UserInfo";

export class CognitionController
{
    private cognitionRepository = getRepository(Cognition);

    async insert (owner: UserInfo, beowner: UserInfo): Promise<void>
    {

        try
        {
            const c0 = await this.cognitionRepository.createQueryBuilder("cognition")
                .where("cognition.owner_user = :id AND cognition.beowner_user = :bid", { id: owner.user_id, bid: beowner.user_id }).getOne();
            
            if(c0 !== undefined)
            {
                return;
            }
            
            const c1 = await this.cognitionRepository.createQueryBuilder("cognition")
                .where("cognition.owner_user = :id AND cognition.beowner_user = :bid", { id: beowner.user_id, bid: owner.user_id }).getOne();
            
            if(c1 != undefined)
            {
                if(c1.exist_status)
                {
                    return;
                }
                c1.exist_status = true;
                await this.cognitionRepository.save(c1);
                return;
            }
            const newCognition = new Cognition;
            newCognition.beowner_user = beowner.user_id;
            newCognition.owner_user = owner.user_id;
            await this.cognitionRepository.save(newCognition);
        }
        catch(e)
        {
            return  Promise.reject("operator fail");
        }
    }

    async FindAll (owner: UserInfo): Promise<Cognition[]>
    {
        return this.cognitionRepository.createQueryBuilder("cognition")
            .where("cognition.owner_user = :id OR cognition.beowner_user = :bid", { id: owner.user_id, bid: owner.user_id }).cache(true).getMany();
    }
}