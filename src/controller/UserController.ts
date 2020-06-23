import { getRepository } from "typeorm";
import { NextFunction, Request, Response } from "express";
import { User } from "../entity/User";

export class UserController
{

    private userRepository = getRepository(User);

    async all (request: Request,): Promise<User[]>
    {
        return this.userRepository.find();
    }

    async one (request: Request,): Promise<User>
    {
        return this.userRepository.findOne(request.params.id);
    }

    async save (request: Request,): Promise<any>
    {
        return this.userRepository.save(request.body);
    }

    async remove (request: Request,): Promise<void>
    {
        const userToRemove = await this.userRepository.findOne(request.params.id);
        await this.userRepository.remove(userToRemove);
    }

}