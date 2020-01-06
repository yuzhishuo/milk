import {Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from "typeorm";
import {user_info} from "./user_info"

@Entity()
export class User {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    firstName: string;

    @Column()
    lastName: string;

    @Column()
    age: number;

    @OneToOne((type)=> user_info)
    @JoinColumn()
    userinfo: user_info; 
}
