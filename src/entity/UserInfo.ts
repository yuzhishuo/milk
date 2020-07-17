import { Entity, Column, } from "typeorm";

@Entity({name: "user_info"})
export class UserInfo
{
    @Column({
        type:  "int",
        primary: true,
        generated: true
    })
    user_id: number;

    @Column("varchar", { unique: true ,length: 50})
    telephone_number: string;

    @Column("varchar", {nullable: false, length:200,  default: "", name: "person_picture", })
    PersonPicture: string;

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
        type: "varchar",
        length: 100,
        nullable: true,
    })
    birthplace: string;

    @Column({
        type: "varchar",
        length: 200,
        nullable: true,
    })
    signature: string;

    @Column({
        type: "varchar",
        length: 40,
        default: "",
        nullable: false,
    })
    password: string;
}
