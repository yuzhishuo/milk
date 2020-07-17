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
    chat_record_id: number;

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    // @OneToOne(_type=>UserInfo)
    // @JoinColumn({name: "send_user",
    //     referencedColumnName: "user_id",
    // })
    @Column({type: "int", name: "send_user"})
    SendUser: number;

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    // @OneToOne(_type=>UserInfo)
    // @JoinColumn({name: "receive_user",
    //     referencedColumnName: "user_id",
    // })
    @Column({type: "int", name: "receive_user"})
    ReceiveUser: number;

    @Column({type: "smallint",
        name: "receiver_mesg_exit",
        default: true,
    })
    ReceiverMesgExit: boolean;

    @Column({type: "smallint",
        name: "sender_mesg_exit",
        default: true,
    })
    SenderMesgExit: boolean;

    @Column({name: "mesg"})
    Mesg: string;

    @Column({type: "enum",
        enum: message_type,
        name: "mesg_type",
        nullable: false,
        default: [message_type.text],
    })
    MesgType: message_type[];

    // If the message for the group, the receiver for group no.
    @Column({type: "enum",
        enum: message_relationship,
        nullable: false,
        name: "message_relationship",
        default: message_relationship.person
    })
    MessageRelationship: message_relationship;

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