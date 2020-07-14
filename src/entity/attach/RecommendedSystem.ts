/* eslint-disable @typescript-eslint/no-unused-vars-experimental */ // for type
/* eslint-disable @typescript-eslint/no-unused-vars */ // for type
import { Entity, OneToOne, JoinColumn, PrimaryGeneratedColumn, Column } from "typeorm";
import { UserInfo } from "../UserInfo";
import { ChatRecord } from "../ChatRecord";

@Entity({name: "recommended_system"})
export class RecommendedSystem
{
    @PrimaryGeneratedColumn("uuid")
    RecommendId: number;
    

    @Column({type: "tinyint", name: "send_user"})
    SendUser: number;

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    // @OneToOne(_type=>UserInfo)
    // @JoinColumn({name: "receive_user",
    //     referencedColumnName: "user_id",
    // })
    @Column({type: "tinyint", name: "receive_user"})
    ReceiveUser: number;

    @OneToOne(type=>ChatRecord)
    @JoinColumn({name: "chat_record_id",
        referencedColumnName: "chat_record_id",
    })
    ChatRecordId: ChatRecord;

    @Column({type: "bool",
        name: "is_visible",
        default: true,
    })
    IsVisible: boolean;
}