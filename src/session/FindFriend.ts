import { ExternalInterface, } from "./utility/ExternalInterface";
import { Request, } from "express";
import { UserInfoController } from "../controller/UserInfoController";
import { UserRightsController } from "../controller/UserRightsController";
import { InjectionRouter } from "../routes/RoutersManagement";
import { IBasicMessageCarryDataInterface, ITrouble, SolveConstructor, BasicErrorInterface, IBasicMessageInterface, } from "./utility/BassMessage";
import { SignalCheck } from "./utility/signal";
import { isNullOrUndefined} from "util";
import { Error } from "../utility";
import { IsTest } from "../unit_test/data/Option";

interface IFindFriend
{
    id?: string | number;
    target: string | number;
    token: string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function asserts (val: any, msg?: string): asserts val is IFindFriend
{

    const coverValue = val /* as IOneWayFriendRelationship */ ;

    if(!(IsTest && (isNullOrUndefined(coverValue.id)
    && Error(SolveConstructor<IBasicMessageInterface>({status: 0, message: msg })))))
    {
        return;
    }

    if(!(coverValue.target && coverValue.token))
    {
        throw SolveConstructor<IBasicMessageInterface>({status: 0, message: msg });
    }
}

/* final */ class FindFriend extends ExternalInterface<IBasicMessageCarryDataInterface>
{
    private userInfoController: UserInfoController = new UserInfoController();
    private userRightsController: UserRightsController = new UserRightsController();
    async Verify (request: Request): Promise<void>
    {
        const body = request.body;
        
        asserts(body, "invail request body");

        if(!IsTest)
        {
            body.id = SignalCheck(body.token);
        }

        if(isNullOrUndefined(body.id))
        {
            return Promise.reject({ status: 0, message: "invail token" });
        }
    }

    async Process (request: Request): Promise<ITrouble<IBasicMessageCarryDataInterface>>
    {
        const { target } = request.body as IFindFriend;

        const verifyCondition = await this.userRightsController.CanableFind(target);

        if (isNullOrUndefined(verifyCondition) || verifyCondition.BeSearchRight !== -1 /* can be anyone search */)
        {
            return SolveConstructor<BasicErrorInterface>({ status: 1, message: "can't find this user" });
        }

        const beowner_user = await this.userInfoController.findUser(target);

        if (isNullOrUndefined(beowner_user))
        {
            return SolveConstructor<BasicErrorInterface>({ status: 1, message: "can't find this user" });
        }
        return SolveConstructor<IBasicMessageCarryDataInterface>({ status: 0, message: "Find Success", data: beowner_user });
    }
}

InjectionRouter({ method: "post", route: "/FindFriend", controller: new FindFriend, });