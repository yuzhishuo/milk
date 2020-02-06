/**
 *  version 0.1
 *  for sample register user
 */
import { NextFunction, Request, Response } from "express";

import { register_info_by_email } from "./type/request/register_request"
import { register_message } from "./type/handle/register_message"
import { user_info_controller } from "../controller/user_info_controller";
import { user_info } from "../entity/user_info";


export class user_register
{
    private uic: user_info_controller = new user_info_controller();

    async register(requset: Request, response: Response, nextfunction: NextFunction)
    {
        const reg_info = requset.body as register_info_by_email;
        if (!(reg_info.user_email && reg_info.nickname && reg_info.password))
        {
            const r: register_message = { status: 0, message: "register fail" }
            return r;
        }
        await this.uic.construct(reg_info as user_info);
        return { status: 1, message: "register success" }
    }
}