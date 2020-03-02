import { getRepository, InsertResult } from "typeorm";
import { NextFunction, Request, Response } from "express";
import { user_info } from "../entity/user_info";

export class user_info_controller
{
    private user_info_repository = getRepository(user_info);

    async findByEmail (email: string): Promise<user_info>
    {
        return this.user_info_repository.findOne(email, { select: ["password"] });
    }

    async construct (new_user_info: user_info): Promise<InsertResult>
    {
        return this.user_info_repository.insert(new_user_info);
    }

    async find_user (user_id: string| number): Promise<user_info>
    {
        if(typeof(user_id) == 'string')
        {
            return await this.user_info_repository.findOneOrFail(user_id)
        }

        return await this.user_info_repository.findOneOrFail(user_id)
    }
}