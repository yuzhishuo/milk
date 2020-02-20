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

interface Trouble<T>
{
    status: "solve" | "fail" | "normal";
    data?: T;
    message?: string;
}

abstract class ExternalInterface<T2 extends BasicMessageInterface = BasicMessageInterface,
    T1 extends BasicErrorInterface = BasicErrorInterface>
{
    private NextHandler: ExternalInterface<T2, T1>| null = null;

    abstract async Verify(...args: any[]): Promise<T1| boolean>;
    abstract async Process(...args: any[]): Promise<Trouble<T2>>;
    public async Run (...args: any[]): Promise<T1| T2>
    {
        try
        {
            const verifyres = await this.Verify(...args);
            if(typeof(verifyres) !== "boolean") return verifyres;
            const processres = await this.Process(...args);

            if(processres.status === "solve")
            {
                return processres.data;
            }

            if(processres.status === "normal")
            {
                return this.NextHandler?.Run(...args);
            }
            else
            {
                this.Fail(...args);
            }
        }
        catch
        {
            this.Fail(...args);
        }
    }

    public Fail (...args: any[]): never
    {
        throw new Error("Method not implemented.");
    }

    public set Next (handler: ExternalInterface<T2, T1>)
    {
        this.NextHandler = handler;
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