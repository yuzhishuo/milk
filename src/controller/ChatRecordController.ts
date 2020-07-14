import { ChatRecord, message_relationship, message_type } from "../entity/ChatRecord";
import { getRepository } from "typeorm";
import { UserInfo } from "../entity/UserInfo";


export class ChatRecordController
{
    private chatRecordRepository = getRepository(ChatRecord);


    public async NewChatRecord (send: UserInfo, receive: UserInfo,
        message: string, messageType: message_type[] = [message_type.text],
        messageRelationship: message_relationship = message_relationship.person): Promise<ChatRecord>
    {
        const chatRecord = new ChatRecord();

        chatRecord.SendUser = send.user_id;
        chatRecord.ReceiveUser = receive.user_id;
        chatRecord.Mesg = message;
        chatRecord.MessageRelationship = messageRelationship;
        chatRecord.MesgType = messageType;

        return this.chatRecordRepository.save(chatRecord);
    }
}