import { Entity, OneToOne, JoinColumn, PrimaryGeneratedColumn } from "typeorm";
import { UserInfo } from "../UserInfo";

@Entity({name: "recommendedsystem"})
class RecommendedSystem
{
    @PrimaryGeneratedColumn("uuid")
    RecommendId: number;
    
    @OneToOne(_type=>UserInfo)
    @JoinColumn({name: "user_id",
        referencedColumnName: "user_id",
    })
    Userid: UserInfo;
}