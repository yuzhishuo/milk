import { ExternalInterface, } from "./utility/ExternalInterface";
import { Request, } from "express";

import { UserInfoController } from "../controller/UserInfoController";
import { UserRightsController } from "../controller/UserRightsController";
import { InjectionRouter } from "../routes/RoutersManagement";
import { IBasicMessageCarryDataInterface, ITrouble, SolveConstructor, BasicErrorInterface, IBasicMessageInterface, } from "./utility/BassMessage";
import { Signal } from "./utility/signal";
import { isNull } from "util";

interface IFindFriend
{
    source: string;
    target: string;
    token: string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function asserts (val: any, msg?: string): asserts val is IFindFriend
{
    if(!(val.source && val.target && val.token))
    {
        throw SolveConstructor<IBasicMessageInterface>({status: 0, message: msg });
    }
}

/* final */ class FindFriend extends ExternalInterface<IBasicMessageCarryDataInterface>
{
    private uic: UserInfoController = new UserInfoController();
    private userRightsController: UserRightsController = new UserRightsController();
    async Verify (request: Request): Promise<void>
    {
        const findFriend =  request.body;

        asserts(findFriend, "invail request body");

        const singleToken = Signal.Unique();

        const  baseTokenStruct  = singleToken.IsAvailability(findFriend.token);
        
        if (isNull(baseTokenStruct))
        {
            throw SolveConstructor<IBasicMessageInterface>({status: 0, message: "invail token" });
        }
        request.tokenId = baseTokenStruct.id;
    }
    async Process (request: Request): Promise<ITrouble<IBasicMessageCarryDataInterface>>
    {
        const { target } = request.body as IFindFriend;

        const verifyCondition = await this.userRightsController.CanableFind(target);

        if (verifyCondition === undefined || verifyCondition.BeSearchRight !== -1 /* can be anyone search */)
        {
            return SolveConstructor<BasicErrorInterface>({ status: 1, message: "can't find this user" });
        }

        const beowner_user = await this.uic.findUser(target);

        if (!beowner_user)
        {
            SolveConstructor<BasicErrorInterface>({ status: 1, message: "can't find this user" });
        }
        return SolveConstructor<IBasicMessageCarryDataInterface>({ status: 0, message: "Find Success", data: beowner_user });
    }
}

InjectionRouter({ method: "post", route: "/FindFriend", controller: new FindFriend, });