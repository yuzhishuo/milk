/* eslint-disable @typescript-eslint/no-explicit-any */
import { ExternalInterface } from "./ExternalInterface";

/// link list
export class ExternalInterfaceManager
{
    public externalInterfaceHand: ExternalInterface = null;
    public externalInterfaceTail: ExternalInterface = null;
    public async Run (...args: any[]): Promise<any>
    {
        try
        {
            if(this.externalInterfaceHand !== null)
            {
                return await this.externalInterfaceHand.Run(...args);
            }
            else
            {
                return {status: 0, message: "externalInterfaceHand is null"};
            }

        }
        catch(error)
        {
            return error;
        }
    }

    public Add (externalInterface: ExternalInterface): void
    {
        if(this.externalInterfaceHand === null && this.externalInterfaceTail === null)
        {
            this.externalInterfaceHand = externalInterface;
            this.externalInterfaceTail = externalInterface;
            return;
        }
        this.externalInterfaceTail.Next = externalInterface;
        this.externalInterfaceTail = externalInterface;
    }
}