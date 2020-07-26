import { ExternalInterface, } from "./utility/ExternalInterface";
import { Request, } from "express";

import { UserInfoController } from "../controller/UserInfoController";
import { UserRightsController } from "../controller/UserRightsController";
import { InjectionRouter } from "../routes/RoutersManagement";
import { IBasicMessageCarryDataInterface, ITrouble, SolveConstructor, BasicErrorInterface, IBasicMessageInterface, } from "./utility/BassMessage";
import { Signal } from "./utility/signal";
import { isNull } from "util";
import { IsTest } from "../unit_test/data/Option";

interface IFindFriend
{
    target: string | number;
    token: string;
    findMethod: "id" | "telephone" | "email";
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function asserts (val: any, msg?: string): asserts val is IFindFriend
{
    if(!(val.target && val.token && 
        val.findMethod && (val.findMethod === "id" || val.findMethod === "telephone" || val.findMethod === "email")))
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
        
        if(IsTest)
        {
            if (isNull(baseTokenStruct))
            {
                throw SolveConstructor<IBasicMessageInterface>({status: 0, message: "invail token" });
            }
        }
    }
    async Process (request: Request): Promise<ITrouble<IBasicMessageCarryDataInterface>>
    {
        const { target, findMethod } = request.body as IFindFriend;

        const verifyCondition = await this.userRightsController.CanableFind(target, findMethod);

        if (verifyCondition === undefined || verifyCondition.BeSearchRight !== -1 /* can be anyone search */)
        {
            return SolveConstructor<BasicErrorInterface>({ status: 1, message: "can't find this user" });
        }

        const beowner_user = await this.uic.findUser(target, findMethod);

        if (!beowner_user)
        {
            SolveConstructor<BasicErrorInterface>({ status: 1, message: "can't find this user" });
        }
        return SolveConstructor<IBasicMessageCarryDataInterface>({ status: 0, message: "Find Success", data: beowner_user });
    }
}

InjectionRouter({ method: "post", route: "/FindFriend", controller: new FindFriend, });