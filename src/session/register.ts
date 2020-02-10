import { NextFunction, Request, Response, request } from "express";

import { register_info_by_email, register_info_by_telephone } from "./type/request/register_request"
import { register_message } from "./type/handle/register_message";
import { user_info_controller } from "../controller/user_info_controller";
import { user_info } from "../entity/user_info";
import { verification } from "./utility/sms";



export class user_register
{
    private uic: user_info_controller = new user_info_controller();

    public async register (requset: Request, _response: Response, _nextfunction: NextFunction): Promise<register_message>
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

    // eslint-disable-next-line @typescript-eslint/no-untyped-public-signature
    @verification()
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public telephone_register (requset: Request, _response: Response, _nextfunction: NextFunction): any
    {
        const reg_info = requset.body as register_info_by_telephone;
        if('telephone_number' in reg_info)
        {
            return {PhoneNumbers: reg_info.telephone_number };
        }
        return {status:0,
            message: "register fail"};
    }

    public telephone_register_recive (requset: Request, _response: Response, _nextfunction: NextFunction): boolean
    {
        return true;
    }
}