import { NextFunction, Request, Response} from "express";

import { register_info_by_email, register_info_by_telephone } from "../type/request/register_request"
import { user_info_controller } from "../../controller/user_info_controller";
import { UserInfo } from "../../entity/UserInfo";
import { verification, Sms } from "../utility/sms";

import { ExternalInterface, BasicMessageTakeawayDataInterface, Trouble, BasicErrorInterface, BaseErrorMessage } from "../utility/ExternalInterface";
import { InjectionRouter } from "../../routes/RoutersManagement";
import { ExternalInterfaceManager } from "../utility/ExternalInterfaceManager";


export class UserRegisterVerification extends ExternalInterface<BasicMessageTakeawayDataInterface>
{
    private uic: user_info_controller = new user_info_controller();

    public async Verify (request: Request, _response: Response, _nextfunction: NextFunction): Promise<void>
    {
        if("telephone_number" in request.body)
        {
            return;
        }
        return Promise.reject({ status: 0, message: "invail request body" });
    }


    // eslint-disable-next-line @typescript-eslint/no-untyped-public-signature
    public async Process (requset: Request, _response: Response, _nextfunction: NextFunction): Promise<Trouble<BasicMessageTakeawayDataInterface>>
    {
        const reg_info = requset.body as register_info_by_telephone;
        try
        {
            const t = await this.uic.findByTelephone(reg_info.telephone_number);
            if(t !== undefined)
            {
                return { status: "solve",  data:{ status: 0, message:"acconut alearly register"} };
            }
            else
            {
                return { status: "normal"};
            }
        }
        catch(error)
        {
            return { status: "solve", data: {status: 0, message: "unknow error"}};
        }
    }
}

const eim = new ExternalInterfaceManager();
eim.Add(new UserRegisterVerification());
eim.Add(new Sms());

InjectionRouter({method: "post", route: "/user_register_verification", controller: eim});