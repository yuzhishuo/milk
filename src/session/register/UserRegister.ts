import { NextFunction, Request, Response} from "express";

import { register_info_by_telephone } from "../type/request/register_request"
import { UserInfoController } from "../../controller/UserInfoController";
import { UserInfo } from "../../entity/UserInfo";
import { verification, Check } from "../utility/sms";

import { ExternalInterface, BasicMessageTakeawayDataInterface, Trouble } from "../utility/ExternalInterface";
import { InjectionRouter } from "../../routes/RoutersManagement";


export class UserRegister extends ExternalInterface<BasicMessageTakeawayDataInterface>
{
    private uic: UserInfoController = new UserInfoController();

    public async Verify (request: Request, _response: Response, _nextfunction: NextFunction): Promise<void>
    {
        const {telephone_number, code} = request.body as register_info_by_telephone;
        if (telephone_number && code)
        {
            return;
        }
        return Promise.reject({ status: 0, message: "invail request body" });
    }

    public async Process (requset: Request, _response: Response, _nextfunction: NextFunction): Promise<Trouble<BasicMessageTakeawayDataInterface>>
    {
        const reg_info = requset.body as register_info_by_telephone;

        if(!Check({ id: reg_info.telephone_number, type: "verification"}, reg_info.code))
        {
            return {status: "solve", data: {status: 0, message: "code is error"} }
        }

        try
        {
            await this.uic.construct(reg_info as unknown as UserInfo);
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
        return {status:0, message: "register fail"};
    }
}

InjectionRouter({method: "post", route: "/user_register", controller: new UserRegister});