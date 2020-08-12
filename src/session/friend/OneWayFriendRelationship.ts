import { ExternalInterface } from "../utility/ExternalInterface";
import { IBasicMessageCarryDataInterface, ITrouble, SolveConstructor, IBasicMessageInterface } from "../utility/BassMessage";
import { Request } from "express";
import { SignalCheck } from "../utility/signal";
import { CognitionController } from "../../controller/CognitionController";
import { UserInfoController } from "../../controller/UserInfoController";
import { InjectionRouter } from "../../routes/RoutersManagement";
import { IsTest } from "../../unit_test/data/Option";
import { isNullOrUndefined } from "util";
import { Error } from "../../utility";

interface IOneWayFriendRelationship
{
    token: string;
    targetId: string;
    id?: number | string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function asserts (val: any, msg?: string): asserts val is IOneWayFriendRelationship
{
    const coverValue = val /* as IOneWayFriendRelationship */ ;

    if(!(IsTest && (isNullOrUndefined(coverValue.id)
    && Error(SolveConstructor<IBasicMessageInterface>({status: 0, message: msg })))))
    {
        return;
    }

    if(!(coverValue.token && coverValue.targetId))
    {
        throw SolveConstructor<IBasicMessageInterface>({status: 0, message: msg });
    }
}

class OneWayFriendRelationship extends ExternalInterface<IBasicMessageCarryDataInterface>
{
    private cognitionController = new CognitionController();
    private userInfoController = new UserInfoController();

    protected async Verify (request: Request): Promise<void>
    { 
        const body = request.body as IOneWayFriendRelationship;

        asserts(body, "invail request header");

        if(!IsTest)
        {
            body.id = SignalCheck(body.token);
        }
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        if(!body.id)
        {
            return Promise.reject({ status: 0, message: "invail token" });
        }
    }

    protected async Process (request: Request): Promise<ITrouble<IBasicMessageCarryDataInterface>> 
    {
        const info = request.body as IOneWayFriendRelationship;
        const owner = await this.userInfoController.findUser(info.targetId,);
        const beowner = await this.userInfoController.findUser(info.id);
        await this.cognitionController.insert(owner, beowner);
        return SolveConstructor<IBasicMessageCarryDataInterface>({ status: 0, message: "add Success" });
    }
}

InjectionRouter({ method: "post", route: "/OneWayFriendRelationship", controller: new OneWayFriendRelationship, });