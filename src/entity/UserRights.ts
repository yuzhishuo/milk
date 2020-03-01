import { Entity, Column, JoinColumn, OneToOne, PrimaryGeneratedColumn, CreateDateColumn, Generated } from "typeorm";
import { user_info } from "./user_info";


@Entity("user_right")
export class UserRight
{
    @PrimaryGeneratedColumn("uuid", {name: "user_right_id"})
    Id: string;

    @OneToOne((_type) => user_info)
    @JoinColumn({name: "to_email"})
    to_email: string;

    @Column({ type: "int",
        name: "be_search_right",
        default: -1, /* ervery one */
    })
    BeSearchRight: number;

    @Column({ type: "int",
        name: "be_search_method",
        default: -1, /* email or phonenember */ })
    BeSearchMethod: number;
}