import {Column, Entity, OneToOne, JoinColumn, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn} from "typeorm";
import {user_info} from "./user_info";

@Entity()
export class user_status
{

    @PrimaryGeneratedColumn()
    status_id: number;

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    @OneToOne((type) => user_info)
    @JoinColumn({name: "to_email"})
    to_email: string;

    @CreateDateColumn()
    create_time: Date;

    @UpdateDateColumn()
    last_revise_time: Date;

    @Column({type: "bit",
        default: 0,
        nullable: false})
    user_status: number;
}