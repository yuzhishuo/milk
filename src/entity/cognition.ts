import { Entity, Column, OneToOne, JoinColumn, Generated, PrimaryColumn, SelectQueryBuilder } from "typeorm";
import { UserInfo } from "./UserInfo";

@Entity({name: "cognition"})
export class Cognition
{
    @PrimaryColumn()
    @Generated("increment")
    cognition_id: number;

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    @OneToOne(type=>UserInfo)
    @JoinColumn({name: "owner_user",
        referencedColumnName: "user_id",
    })
    @Column()
    owner_user: UserInfo;

    /* eslint-disable @typescript-eslint/no-unused-vars */
    @OneToOne(type=>UserInfo)
    @JoinColumn({name: "beowner_user",
        referencedColumnName: "user_id",
    })
    @Column()
    beowner_user: UserInfo;

    @Column({type: "timestamp",
        default: ()=>"NOW()",
    })
    addtion_time: Date;

    @Column({type: "bool",
        default: false,
    })
    exist_status: boolean;
}