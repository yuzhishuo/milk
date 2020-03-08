import { ExternalInterface } from "./ExternalInterface";

export class ExternalInterfaceManager
{
    public externalInterfaceHand: ExternalInterface = null;
    public externalInterfaceTail: ExternalInterface = null;
    public async Run (...args: any[]): Promise<any>
    {
        try
        {
            return await this.externalInterfaceHand.Run(...args);
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