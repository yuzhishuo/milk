import { Request, Response, NextFunction, } from "express";
import { user_info_controller as UserInfoController } from "../controller/user_info_controller";
import { ExternalInterface, BasicMessageTakeawayDataInterface, BasicErrorInterface, Trouble } from "./utility/ExternalInterface";

/* eslint-disable @typescript-eslint/no-explicit-any */

interface RequestUserInfo
{
    target: string;
    type: 0 | 1 | 2; /*0: self 1: owner 2: find*/
    token: string;
}

export class CapturePersonalInformation extends ExternalInterface<BasicMessageTakeawayDataInterface>
{
    private uic: UserInfoController = new UserInfoController();

    async Verify (request: Request, _response: Response, _next: NextFunction): Promise<BasicErrorInterface | boolean>
    {
        const re = request.body as RequestUserInfo;
        if (re.target && re.token && re.type)
        {
            return true;
        }
        return { status: 0, message: "invail request body" };
    }
    async Process  (request: Request, _response: Response, _next: NextFunction): Promise<Trouble<BasicMessageTakeawayDataInterface>>
    {
        const re = request.body as RequestUserInfo;
        const res = await this.uic.find_user(re.target);
        return ({
            status: "solve",
            data: {status: 0, message: "find Success", data: res }
        });
    }
}