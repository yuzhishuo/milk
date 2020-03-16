import { Entity, Column, JoinColumn, OneToOne, PrimaryGeneratedColumn, CreateDateColumn } from "typeorm";

import { UserInfo } from "./UserInfo";

export enum message_type
    {
    text  = 1,
    audio = 0,
    video = 2,
    file  = 3,
}

export enum message_relationship
    {
    person = 0,
    group = 1,
}

@Entity({name: "chat_record"})
export class ChatRecord
{

    @PrimaryGeneratedColumn("uuid")
    chat_record: number;

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    @OneToOne(_type=>UserInfo)
    @JoinColumn({name: "send_user",
        referencedColumnName: "user_id",
    })
    SendUser: UserInfo;

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    @OneToOne(_type=>UserInfo)
    @JoinColumn({name: "receive_user",
        referencedColumnName: "user_id",
    })
    ReceiveUser: UserInfo;

    @Column({type: "smallint",
        name: "receiver_mesg_exit",
    })
    ReceiverMesgExit: boolean;

    @Column({type: "smallint",
        name: "sender_mesg_exit",
    })
    SenderMesgExit: boolean;

    @Column()
    mesg: string;

    @Column({type: "enum",
        enum: message_type,
        nullable: false,
        default: [message_type.text],
    })
    mesg_type: message_type[];

    // If the message for the group, the receiver for group no.
    @Column({type: "enum",
        enum: message_relationship,
        nullable: false,
        default: message_relationship.person
    })
    message_relationship: message_relationship;

    @CreateDateColumn({
        name: "send_time",
    })
    SendTime: Date;

    @Column({type: "bool",
        name: "is_visible",
        default: true,
    })
    IsVisible: boolean;
}