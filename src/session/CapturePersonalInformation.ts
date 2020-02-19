import { Request, Response, NextFunction, } from "express";
import { user_info_controller as UserInfoController } from "../controller/user_info_controller";

/* eslint-disable @typescript-eslint/no-explicit-any */

type BaseErrorMessage = "invail request body" | "operator fail" | "unkonw operator";
type IncreaseErrorMessage = BaseErrorMessage | "addition fail";
type DeleteErrorMessage = BaseErrorMessage | "delete fail";
type UpdateErrorMessage = BaseErrorMessage | "update fail";
type FindErrorMessage = BaseErrorMessage | "Find fail";

interface BasicMessageInterface<T extends string = string>
{
    status: number;
    message: T;
}

interface BasicMessageTakeawayDataInterface<Y= any, T extends string = string> extends BasicMessageInterface<T>
{
    data: Y;
}

type BasicErrorInterface<T extends string = BaseErrorMessage> = BasicMessageInterface<T>

abstract class ExternalInterface<T2 extends BasicMessageInterface = BasicMessageInterface,
    T1 extends BasicErrorInterface = BasicErrorInterface>
{
    abstract async Verify(...args: any[]): Promise<T1| boolean>;
    abstract async Process(...args: any[]): Promise<T2>;
    public async Run (...args: any[]): Promise<T1| T2>
    {
        const res = await this.Verify(...args);
        if(typeof(res) !== "boolean") return res;
        return await this.Process(...args);
    }
}

interface RequestUserInfo
{
    target: string;
    type: 0 | 1 | 2; /*0: self 1: owner 2: find*/
    token: string;
}

export class CapturePersonalInformation extends ExternalInterface<BasicMessageTakeawayDataInterface>
{
    private uic: UserInfoController = new UserInfoController();

    async Verify (request: Request, _response: Response, _next: NextFunction): Promise<BasicErrorInterface<BaseErrorMessage> | boolean>
    {
        const re = request.body as RequestUserInfo;
        if (re.target && re.token && re.type)
        {
            return true;
        }
        return { status: 0, message: "invail request body" };
    }
    async Process  (request: Request, _response: Response, _next: NextFunction): Promise<BasicMessageTakeawayDataInterface>
    {
        const re = request.body as RequestUserInfo;
        const res = await this.uic.find_user(re.target);
        return ({status: 0, message: "find Success", data: res});
    }
}