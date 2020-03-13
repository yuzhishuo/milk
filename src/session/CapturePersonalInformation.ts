import { Request, } from "express";
import { user_info_controller as UserInfoController } from "../controller/user_info_controller";
import { ExternalInterface, BasicMessageTakeawayDataInterface, BasicErrorInterface, Trouble, SolveConstructor } from "./utility/ExternalInterface";

import { InjectionRouter } from "../routes/RoutersManagement";

/* eslint-disable @typescript-eslint/no-explicit-any */

interface RequestUserInfo
{
    target: string;
    type: 0 | 1 | 2; /*0: self, 1: owner, 2: find*/
    token: string;
}

class CapturePersonalInformation extends ExternalInterface<BasicMessageTakeawayDataInterface>
{
    private uic: UserInfoController = new UserInfoController();

    async Verify (request: Request,): Promise<void>
    {
        const {target, token, type} = request.body as RequestUserInfo;
        if (target && token && type)
        {
            return;
        }
        return Promise.reject({ status: 0, message: "invail request body" });
    }
    async Process  (request: Request): Promise<Trouble<BasicMessageTakeawayDataInterface>>
    {
        try
        {
            const {target, type} = request.body as RequestUserInfo;
            // right verify

            // verification successful
            if(type != 0)
            {
                // verify the user relationship
            }
            const res = await this.uic.find_user(target);
            return SolveConstructor({status: 0, message: "find Success", data: res });
        }
        catch
        {
            return SolveConstructor({ status: 1, message: "find Fail" });
        }
    }
}

InjectionRouter({method: "post", route: "/CapturePersonalInformation", controller: new CapturePersonalInformation()});