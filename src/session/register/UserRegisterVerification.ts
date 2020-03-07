import { NextFunction, Request, Response} from "express";

import { register_info_by_email, register_info_by_telephone } from "../type/request/register_request"
import { user_info_controller } from "../../controller/user_info_controller";
import { UserInfo } from "../../entity/UserInfo";
import { verification } from "../utility/sms";

import { ExternalInterface, BasicMessageTakeawayDataInterface, Trouble, BasicErrorInterface, BaseErrorMessage } from "../utility/ExternalInterface";
import { InjectionRouter } from "../../routes/RoutersManagement";


export class UserRegisterVerification extends ExternalInterface<BasicMessageTakeawayDataInterface>
{
    private uic: user_info_controller = new user_info_controller();

    public async Verify (request: Request, _response: Response, _nextfunction: NextFunction): Promise<boolean | BasicErrorInterface>
    {
        const {telephone_number} = request.body as register_info_by_telephone;
        if (telephone_number)
        {
            return true;
        }
        return { status: 0, message: "invail request body" };
    }

    public async _ (requset: Request, _response: Response, _nextfunction: NextFunction): Promise<Trouble<BasicMessageTakeawayDataInterface>>
    {
        const reg_info = requset.body as register_info_by_telephone;
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
    public async Process (requset: Request, _response: Response, _nextfunction: NextFunction): Promise<Trouble<BasicMessageTakeawayDataInterface>>
    {
        const reg_info = requset.body as register_info_by_telephone;
        try
        {
            await this.uic.findByTelephone(reg_info.telephone_number);
            return  { status: "solve",  data:{status: 0, message:"", data: reg_info.telephone_number  } }
        }
        catch(error)
        {
            console.log(error.code);
        }
        return { status: "normal",  data:{status: 0, message:"", data: reg_info.telephone_number  } }
    }
}

InjectionRouter({method: "post", route: "/user_register_verification", controller: UserRegisterVerification});