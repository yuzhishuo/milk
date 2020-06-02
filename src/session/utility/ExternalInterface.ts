/* eslint-disable @typescript-eslint/no-explicit-any */
import { IBasicMessageInterface, BasicErrorInterface, ITrouble } from "./BassMessage";
import { isNullOrUndefined } from "util";

export abstract class ExternalInterface<T1 extends IBasicMessageInterface = IBasicMessageInterface,
    T2 extends BasicErrorInterface = BasicErrorInterface>
{
    private NextHandler: ExternalInterface<T1, T2>| null = null;
    protected CanNext (): boolean
    {
        return !isNullOrUndefined(this.NextHandler);
    }
    protected abstract async Verify(...args: any[]): Promise<void>;
    protected abstract async Process(...args: any[]): Promise<ITrouble<T1>>;
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
                    const [a3, a2, a1, ...remain] = args.reverse();
                    remain; // not pass
                    if(isNullOrUndefined( processres.data?.next))
                    {
                        return this.NextHandler.Run(a1, a2, a3);
                    }
                    return this.NextHandler.Run(processres.data?.next, a1, a2, a3);
                }
                else
                {
                    this.Fail(processres.data);
                }
            }
            else
            {
                this.Fail(processres.data);
            }
        }
        catch(error)
        {
            const  t = {status: 0, message: "Find fail"} as T2;
            return t ;
        }
    }

    protected Fail (t: T1): never
    {
        throw console.log(t.message);
    }

    public set Next (handler: ExternalInterface<T1, T2>)
    {
        this.NextHandler = handler;
    }
}