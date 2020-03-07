import { Entity, Column, JoinColumn, OneToOne, PrimaryGeneratedColumn, CreateDateColumn } from "typeorm";
import { UserInfo } from "./UserInfo";
export enum message_type
    {
    text  = 1,
    audio = 0,
    video =2,
    file  =3,
}
@Entity()
export class chat_record
{

    @PrimaryGeneratedColumn("uuid")
    chat_record: number;

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    @OneToOne(_type=>UserInfo)
    @JoinColumn({name: "send_user",
        referencedColumnName: "user_id",
    })
    send_user: UserInfo;

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    @OneToOne(_type=>UserInfo)
    @JoinColumn({name: "receive_user",
        referencedColumnName: "user_id",
    })
    receive_user: UserInfo;

    @Column({type: "smallint"})
    receive_mesg_exit: boolean;
    @Column({type: "smallint"})
    sender_mesg_exit: boolean;
    @Column()
    mesg: string;

    @Column({type: "enum",
        enum: message_type,
        default: [message_type.text],
    })
    mesg_type: message_type[];

    @CreateDateColumn()
    send_time: Date;

    @Column({type: "bool",
        default: true,
    })
    is_visible: boolean;
}