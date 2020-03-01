import { Request, Response, NextFunction, } from "express";
import { user_info_controller as UserInfoController } from "../controller/user_info_controller";
import { ExternalInterface, BasicMessageTakeawayDataInterface, BasicErrorInterface, Trouble } from "./utility/ExternalInterface";

import { InjectionRouter } from "../routes/RoutersManagement";

/* eslint-disable @typescript-eslint/no-explicit-any */

interface RequestUserInfo
{
    target: string;
    type: 0 | 1 | 2; /*0: self 1: owner 2: find*/
    token: string;
}

class CapturePersonalInformation extends ExternalInterface<BasicMessageTakeawayDataInterface>
{
    private uic: UserInfoController = new UserInfoController();

    async Verify (request: Request, _response: Response, _next: NextFunction): Promise<BasicErrorInterface | boolean>
    {
        const {target, token, type} = request.body as RequestUserInfo;
        if (target && token && type)
        {
            return true;
        }
        return { status: 0, message: "invail request body" };
    }
    async Process  (request: Request, _response: Response, _next: NextFunction): Promise<Trouble<BasicMessageTakeawayDataInterface>>
    {
        try
        {
            const { target } = request.body as RequestUserInfo;
            // right verify

            // verification successful
            const res = await this.uic.find_user(target);
            return {
                status: "solve",
                data: {status: 0, message: "find Success", data: res }
            };
        }
        catch
        {
            return { status:"fail", message: "find Fail" };
        }
    }
}


InjectionRouter({method: "post", route: "/CapturePersonalInformation", controller: CapturePersonalInformation});