import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from "typeorm";

import { user_info } from "./user_info"

@Entity()
export class User
{

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    firstName: string;

    @Column()
    lastName: string;

    @Column()
    age: number;

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    @OneToOne((type)=> user_info)
    @JoinColumn()
    userinfo: user_info;
}

interface Person
{
    name?: string;
    age?: number;
    location: string;
}

type Partial<T> = {
    [P in keyof T]?: T[P];
};
type PartialPerson = Partial<User>;
