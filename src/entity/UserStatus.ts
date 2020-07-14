import {Column, Entity, OneToOne, JoinColumn, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn} from "typeorm";
import {UserInfo} from "./UserInfo";

@Entity({name: "user_status"})
export class UserStatus
{

    @PrimaryGeneratedColumn()
    status_id: number;

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    @OneToOne((_type) => UserInfo)
    @JoinColumn({name: "source_id"})
    ToTelephoneNumber: UserInfo;

    @CreateDateColumn()
    create_time: Date;

    @UpdateDateColumn()
    last_revise_time: Date;

    @Column({type: "bit",
        default: 0,
        nullable: false})
    user_status: number;
}