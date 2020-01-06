import {getRepository} from "typeorm";
import {NextFunction, Request, Response} from "express";
import {user_info} from "../entity/user_info";

export class user_info_controller
{
    private user_info_repository = getRepository(user_info);

    async one(request: Request, response: Response, next: NextFunction)
    {
        return this.user_info_repository.findOne(request.param("email"));
    }
}