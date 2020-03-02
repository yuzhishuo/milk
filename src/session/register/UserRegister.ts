import { NextFunction, Request, Response} from "express";

import { register_info_by_email, register_info_by_telephone } from "../type/request/register_request"
import { user_info_controller } from "../../controller/user_info_controller";
import { user_info } from "../../entity/user_info";
import { verification } from "../utility/sms";

import { ExternalInterface, BasicMessageTakeawayDataInterface, Trouble, BasicErrorInterface, BaseErrorMessage } from "../utility/ExternalInterface";
import { InjectionRouter } from "../../routes/RoutersManagement";


import { register_message } from "../type/handle/register_message";
export class UserRegister extends ExternalInterface<BasicMessageTakeawayDataInterface>
{
    private uic: user_info_controller = new user_info_controller();

    public async Verify (request: Request, _response: Response, _nextfunction: NextFunction): Promise<boolean | BasicErrorInterface>
    {
        const {user_email, nickname, password} = request.body as register_info_by_email;
        if (user_email && nickname && password)
        {
            return true;
        }
        return { status: 0, message: "invail request body" };
    }

    public async Process (requset: Request, _response: Response, _nextfunction: NextFunction): Promise<Trouble<BasicMessageTakeawayDataInterface>>
    {
        const reg_info = requset.body as register_info_by_email;
        try
        {
            await this.uic.construct(reg_info as user_info);
        }
        catch(error)
        {
            if(error?.code === "ER_DUP_ENTRY")
                return {status: "solve", data: {status: 0, message: "account is already exists"} }
            return { status: "fail",  data:{ status: 0, message: "register service is not available"} };
        }
        return { status: "solve",  data:{ status: 0, message: "register success" } }
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
}

InjectionRouter({method: "post", route: "/user_register", controller: UserRegister});