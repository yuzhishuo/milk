import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from "typeorm";

import { UserInfo } from "./UserInfo"

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
    @OneToOne((type)=> UserInfo)
    @JoinColumn()
    userinfo: UserInfo;
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
