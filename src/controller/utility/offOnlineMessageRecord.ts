import { ChatRecordController } from "../ChatRecordController";
import { UserInfoController } from "../UserInfoController";
import { message_type, message_relationship } from "../../entity/ChatRecord";
import { RecommendedSystemController } from "../RecommendedSystemController";

async function InsertOffOnlineMessageRecord (sendUser: number | string, receiveUser: number | string, message: string,
    messageType: message_type[] = [message_type.text],
    messageRelationship: message_relationship = message_relationship.person): Promise<void> 
{
    const userInfoController = new UserInfoController;

    const sendUserInfo = userInfoController.findUser(sendUser);

    const receiveUserInfo = userInfoController.findUser(receiveUser);

    const chatRecordController = new ChatRecordController;

    const chatRecord = chatRecordController.NewChatRecord(await sendUserInfo, await receiveUserInfo,
        message, messageType, messageRelationship);

    const recommendedSystemController = new RecommendedSystemController;
    
    await recommendedSystemController.NewRecommendedSystem(await sendUserInfo, await receiveUserInfo, await chatRecord);
}


export async function InsertOffOnlineTextMessageRecordPerson (sendUser: number | string, receiveUser: number | string, message: string): Promise<void> 
{
    const userInfoController = new UserInfoController;
    const receiverUserEnity = await userInfoController.findUser(receiveUser);
    await InsertOffOnlineMessageRecord(sendUser, receiverUserEnity.user_id, message);
}