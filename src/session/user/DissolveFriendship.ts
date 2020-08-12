import { ExternalInterface } from "../utility/ExternalInterface";

import { IBasicMessageCarryDataInterface, ITrouble, SolveConstructor, IBasicMessageInterface } from "../utility/BassMessage";
import { Request } from "express";
import { InjectionRouter } from "../../routes/RoutersManagement";
import { Signal, SignalCheck } from "../utility/signal";
import { IsTest } from "../../unit_test/data/Option";

interface IDissolveFriendship
{
    id?: string | number;
    token: string;
    targetId: string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
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
        
        if(!IsTest)
        {
            request.body.id = SignalCheck(request.body.token);
        }
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        if(!request.body.id)
        {
            return Promise.reject({ status: 0, message: "invail token" });
        }
    }    
    protected async Process (_request: Request): Promise<ITrouble<IBasicMessageCarryDataInterface>> 
    {
        throw new Error("Method not implemented.");
    }
}

InjectionRouter({ method: "post", route: "/DissolveFriendship", controller: new DissolveFriendship, });