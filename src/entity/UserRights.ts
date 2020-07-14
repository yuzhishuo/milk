import { Entity, Column, JoinColumn, OneToOne, PrimaryGeneratedColumn, } from "typeorm";
import { UserInfo } from "./UserInfo";


@Entity("user_right")
export class UserRight
{
    @PrimaryGeneratedColumn("uuid", {name: "user_right_id"})
    Id: string;

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    @OneToOne((_type) => UserInfo)
    @JoinColumn({name: "source_id"})
    ToTelephoneNumber: UserInfo;

    @Column({ type: "int",
        name: "be_search_right",
        nullable: false,
        default: -1, /* ervery one */
    })
    BeSearchRight: number;

    @Column({ type: "int",
        name: "be_search_method",
        nullable: false,
        default: -1, /* email or phonenember */ })
    BeSearchMethod: number;

    @Column({ type: "int",
        name: "be_addition_method",
        nullable: false,
        default: -1, /* request then confirm */ })
    BeAdditionMethod: number;
}