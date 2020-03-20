import { ExternalInterface, BasicMessageTakeawayDataInterface, Trouble, SolveConstructor } from "./utility/ExternalInterface";
import { Request, } from "express";
import { Token } from "./utility/token";

import { UserInfoController } from "../controller/UserInfoController";
import { CognitionController } from "../controller/CognitionController";
import { UserRightsController } from "../controller/UserRightsController";
import { InjectionRouter } from "../routes/RoutersManagement";

interface IFindFriend
{
    source: string;
    target: string;
    token: string;
}

/* final */ class FindFriend extends ExternalInterface<BasicMessageTakeawayDataInterface>
{
    private uic: UserInfoController = new UserInfoController();
    private userRightsController: UserRightsController = new UserRightsController();
    async Verify (request: Request): Promise<void>
    {
        const findFriend = request.body as IFindFriend;
        if (!(findFriend.source && findFriend.target && findFriend.token))
        {
            return Promise.reject({ status: 0, message: "invail request body" });
        }
        const singleToken = Token.make_token();
        if (!singleToken.checkToken(findFriend.token))
        {
            return Promise.reject({ status: 0, message: "invail token" });
        }
    }
    async Process (request: Request): Promise<Trouble<BasicMessageTakeawayDataInterface>>
    {
        const { target } = request.body as IFindFriend;

        const verifyCondition = await this.userRightsController.CanableFind(target);

        if (verifyCondition === undefined || verifyCondition.BeSearchRight !== -1 /* can be anyone search */)
        {
            return SolveConstructor({ status: 1, message: "Without this user" });
        }
        const beowner_user = await this.uic.find_user(target);

        if (!beowner_user)
        {
            return SolveConstructor({
                status: 0,
                message: "Without this user"
            })
        }
        return SolveConstructor({ status: 0, message: "Find Success", data: beowner_user });
    }
}

InjectionRouter({ method: "post", route: "/FindFriend", controller: new FindFriend, });