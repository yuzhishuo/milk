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
    })
    nickname: string;

    @Column("tinyint")
    gender: number;
    
    @Column("timestamp")
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

    @BeforeInsert()
    public add_user_status_record()
    {
        
    }
}
