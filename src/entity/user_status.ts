import {Column, Entity, PrimaryColumn, OneToOne,JoinColumn, PrimaryGeneratedColumn} from "typeorm";
import {user_info} from "./user_info";

@Entity()
export class user_status
{

    @PrimaryGeneratedColumn()
    status_id: number;

    @OneToOne((type)=>user_info)
    @JoinColumn()
    to_email: string;

    @Column({type: "timestamp", default:'20070523091528' , nullable: false})
    create_time: Date;

    @Column({type: "timestamp", default:'20070523091528', nullable: false})
    last_revise_time: Date;

    @Column({type: "bit", default: 0, nullable: false})
    user_status: number;

}