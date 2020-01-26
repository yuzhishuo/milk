import {Entity, Column, OneToOne, JoinColumn, Generated, PrimaryColumn } from "typeorm";
import {user_info} from "./user_info";

@Entity()
export class cognition
{
    @PrimaryColumn()
    @Generated("increment")
    cognition_id: number;

    @OneToOne(type=>user_info)
    @JoinColumn({name: "owner_user",
                referencedColumnName: "user_id",
                })
    owner_user: user_info;

    @OneToOne(type=>user_info)
    @JoinColumn({name: "beowner_user",
                referencedColumnName: "user_id",
                })
    beowner_user: user_info;

    @Column({type: "timestamp",
            default: ()=>"NOW()",
            })
    addtion_time: Date;

    @Column({type: "bool",
            default: true,
            })
    exist_status: boolean;
}