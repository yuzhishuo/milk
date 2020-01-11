import {Entity, Column, PrimaryColumn, Generated, JoinColumn, OneToOne} from "typeorm";

@Entity()
class chat_record
{
    @Column()
    chat_record: number;

    send_user: number;

    receive_user: number;

    mesg:string;

    mesg_type: number;
}