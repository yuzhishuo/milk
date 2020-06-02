import { Entity, Column, PrimaryColumn, Generated } from "typeorm";

@Entity({name: "user_info"})
export class UserInfo
{
    @Column({
        type: "tinyint",
        unique: true,
    })
    @Generated("increment")
    user_id: number;

    @PrimaryColumn("varchar", {length: 50})
    telephone_number: string;

    @Column({type: "varchar", default: "", name: "head_portrait_src"})
    HeadPortraitSrc: string;

    @Column("varchar", {length: 50, default: "", nullable: false, })
    alias: string;

    @Column("varchar", {length: 50, default: "", nullable: false, })
    email: string;

    @Column({
        length: 20,
        default: "",
        nullable: false,
    })
    nickname: string;

    @Column({type: "tinyint",
        default: -1, /* unkonw */
        nullable: false,
    })
    gender: number;

    @Column({type: "timestamp",
        default: ()=>"NOW()",
    })
    birthday: Date;

    @Column({
        length: 100,
        nullable: true,
    })
    birthplace: string;

    @Column({
        length: 200,
        nullable: true,
    })
    signature: string;

    @Column({
        length: 40,
        default: "",
        nullable: false,
    })
    password: string;
}
