/* eslint-disable @typescript-eslint/no-explicit-any */
import { IBasicMessageInterface, BasicErrorInterface, ITrouble } from "./BassMessage";
import { isNull } from "util";

export abstract class ExternalInterface<T2 extends IBasicMessageInterface = IBasicMessageInterface,
    T1 extends BasicErrorInterface = BasicErrorInterface>
{
    private NextHandler: ExternalInterface<T2, T1>| null = null;
    protected CanNext (): boolean
    {
        return !isNull(this.NextHandler);
    }
    protected abstract async Verify(...args: any[]): Promise<void>;
    protected abstract async Process(...args: any[]): Promise<ITrouble<T2>>;
    public async Run (...args: any[]): Promise<T1| T2>
    {
        try
        {
            try
            {
                await this.Verify(...args);
            }
            catch(error)
            {
                return error;
            }

            const processres = await this.Process(...args);

            if(processres.status === "solve")
            {
                return processres.data;
            }

            if(processres.status === "normal")
            {
                if(this.NextHandler !== null)
                {
                    return this.NextHandler.Run(...args);
                }
                else
                {
                    this.Fail(...args);
                }
            }
            else
            {
                this.Fail(...args);
            }
        }
        catch(error)
        {
            console.log(error);
            this.Fail(...args);
        }
    }

    protected Fail (...args: any[]): never
    {
        throw new Error("Method not implemented.");
    }

    public set Next (handler: ExternalInterface<T2, T1>)
    {
        this.NextHandler = handler;
    }
}