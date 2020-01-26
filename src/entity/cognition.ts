import {Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, Generated } from "typeorm";
import { user_info } from "./user_info";

@Entity()
class cognition
{
    @Column({
        type: "tinyint",
        unique: true,
    })
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