import { ChatRecordController } from "../ChatRecordController";
import { UserInfoController } from "../UserInfoController";
import { message_type, message_relationship } from "../../entity/ChatRecord";
import { RecommendedSystemController } from "../RecommendedSystemController";

async function InsertOffOnlineMessageRecord (sendUser: number, receiveUser: number, message: string,
    messageType: message_type[] = [message_type.text],
    messageRelationship: message_relationship = message_relationship.person): Promise<void> 
{
    const userInfoController = new UserInfoController;

    const sendUserInfo = userInfoController.FindById(Number(sendUser));

    const receiveUserInfo = userInfoController.FindById(receiveUser);

    const chatRecordController = new ChatRecordController;


    const chatRecord = chatRecordController.NewChatRecord(await sendUserInfo, await receiveUserInfo,
        message, messageType, messageRelationship);

    const recommendedSystemController = new RecommendedSystemController;
    
    await recommendedSystemController.NewRecommendedSystem(await sendUserInfo, await receiveUserInfo, await chatRecord);

    return;
}


export async function InsertOffOnlineTextMessageRecordPerson (sendUser: number, receiveUser: string, message: string): Promise<void> 
{
    const userInfoController = new UserInfoController;
    const receiverUserEnity = await userInfoController.findUser(receiveUser, "telephone");
    await InsertOffOnlineMessageRecord(sendUser, receiverUserEnity.user_id, message);
    return;
}