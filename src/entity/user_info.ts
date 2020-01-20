import {Entity, Column, PrimaryColumn, Generated, JoinColumn, OneToOne, BeforeInsert} from "typeorm";

@Entity()
export class user_info
{
    @Column({
        type: "tinyint",
        unique: true,
    })
    @Generated("increment")
    user_id: number;

    @PrimaryColumn("varchar", {length: 50})
    user_email: string;

    @Column({
        length: 20,
        nullable: false,
    })
    nickname: string;

    @Column({type: "tinyint",
            default: -1, /* unkonw */
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
        nullable: false,
    })
    password: string;
}
