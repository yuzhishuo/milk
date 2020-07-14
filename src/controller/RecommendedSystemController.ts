import { getRepository, Equal } from "typeorm";
import { RecommendedSystem } from "../entity/attach/RecommendedSystem";
import { UserInfo } from "../entity/UserInfo";
import { ChatRecord } from "../entity/ChatRecord";

export class RecommendedSystemController
{

    private userRepository = getRepository(RecommendedSystem);

    async NewRecommendedSystem (send: UserInfo, receive: UserInfo,  chatRecord: ChatRecord): Promise<void>
    {
        const recommendedSystem = new RecommendedSystem(); 
        recommendedSystem.SendUser = send.user_id;
        recommendedSystem.ReceiveUser = receive.user_id;
        recommendedSystem.IsVisible = true;
        recommendedSystem.ChatRecordId = chatRecord;
        await this.userRepository.save(recommendedSystem);
    }

    async SearchOwnerMessage (userInfo: UserInfo): Promise<RecommendedSystem[]>
    {
        const recommendedSystems = await this.userRepository.find({ IsVisible: Equal(true), 
            ReceiveUser: Equal(userInfo.user_id) });

        for(const re of  recommendedSystems)
        {
            re.IsVisible = false;
        }

        return recommendedSystems;
    }
}