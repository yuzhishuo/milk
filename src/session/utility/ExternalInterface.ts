/* eslint-disable @typescript-eslint/no-explicit-any */

export type BaseErrorMessage = "invail request body" | "operator fail" | "unkonw operator";
export type IncreaseErrorMessage = BaseErrorMessage | "addition fail";
export type DeleteErrorMessage = BaseErrorMessage | "delete fail";
export type UpdateErrorMessage = BaseErrorMessage | "update fail";
export type FindErrorMessage = BaseErrorMessage | "Find fail";

export interface BasicMessageInterface<T extends string = string>
{
    status: number;
    message: T;
}

export interface BasicMessageTakeawayDataInterface<Y= any, T extends string = string> extends BasicMessageInterface<T>
{
    data?: Y;
}

export type BasicErrorInterface<T extends string = BaseErrorMessage> = BasicMessageInterface<T>

export interface Trouble<T>
{
    status: "solve" | "fail" | "normal";
    data?: T;
    message?: string;
}

export abstract class ExternalInterface<T2 extends BasicMessageInterface = BasicMessageInterface,
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