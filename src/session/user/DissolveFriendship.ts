import { ExternalInterface } from "../utility/ExternalInterface";

import { IBasicMessageCarryDataInterface, ITrouble, SolveConstructor, IBasicMessageInterface } from "../utility/BassMessage";
import { Request } from "express";

interface IDissolveFriendship
{
    token: string;
    targetId: string;
}

function asserts (val: any, msg?: string): asserts val is IDissolveFriendship
{
    if(!(val.token && val.targetId))
    {
        throw SolveConstructor<IBasicMessageInterface>({status: 0, message: msg });
    }
}

class DissolveFriendship extends ExternalInterface<IBasicMessageCarryDataInterface>
{
    protected async Verify (request: Request): Promise<void>
    {
        asserts(request.body, "invail request header");
    }    
    protected async Process (...args: any[]): Promise<ITrouble<IBasicMessageCarryDataInterface>> 
    {
        throw new Error("Method not implemented.");
    }
}