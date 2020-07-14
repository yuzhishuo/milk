import { Request} from "express";

import { register_info_by_telephone } from "../type/request/register_request"
import { UserInfoController } from "../../controller/UserInfoController";
import { Sms } from "../utility/sms";

import { ExternalInterface, } from "../utility/ExternalInterface";
import { InjectionRouter } from "../../routes/RoutersManagement";
import { ExternalInterfaceManager } from "../utility/ExternalInterfaceManager";
import { IBasicMessageCarryDataInterface, ITrouble } from "../utility/BassMessage";


export class UserRegisterVerification extends ExternalInterface<IBasicMessageCarryDataInterface>
{
    private uic: UserInfoController = new UserInfoController();

    public async Verify (request: Request, ): Promise<void>
    {
        if("telephone_number" in request.body)
        {
            return;
        }
        return Promise.reject({ status: 0, message: "invail request body" });
    }

    public async Process (requset: Request, ): Promise<ITrouble<IBasicMessageCarryDataInterface>>
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

const EIF = new ExternalInterfaceManager();
EIF.Add(new UserRegisterVerification());
EIF.Add(new Sms());

InjectionRouter({method: "post", route: "/user_register_verification", controller: EIF});