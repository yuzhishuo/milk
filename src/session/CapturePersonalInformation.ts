import { Request, } from "express";
import { UserInfoController } from "../controller/UserInfoController";
import { ExternalInterface, BasicMessageTakeawayDataInterface, BasicErrorInterface, Trouble, SolveConstructor } from "./utility/ExternalInterface";

import { InjectionRouter } from "../routes/RoutersManagement";
import { Token } from "./utility/token";

/* eslint-disable @typescript-eslint/no-explicit-any */

interface IRequestUserInfo
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
        const {target, token, type} = request.body as IRequestUserInfo;
        if (!(target && token && type))
        {
            return Promise.reject({ status: 0, message: "invail request body" });
        }

        const singleToken = Token.make_token();
        if(!singleToken.checkToken(token))
        {
            return Promise.reject({ status: 0, message: "invail token" });
        }

        return;
    }
    async Process  (request: Request): Promise<Trouble<BasicMessageTakeawayDataInterface>>
    {
        try
        {
            const {target, type} = request.body as IRequestUserInfo;
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