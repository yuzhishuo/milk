import { ExternalInterface, } from "./utility/ExternalInterface";
import { Request } from "express";
import { InjectionRouter } from "../routes/RoutersManagement";
import { Token } from "./utility/token";
import { UserInfoController } from "../controller/UserInfoController";
import { CognitionController } from "../controller/CognitionController";
import { BasicMessageTakeawayDataInterface, Trouble, SolveConstructor } from "./utility/BassMessage";


interface IRegistrationFriendRelation
{
    token: string;
    sourceId: string;
    targetId: string;
}

class RegistrationFriendRelation extends ExternalInterface<BasicMessageTakeawayDataInterface>
{
    private uic: UserInfoController = new UserInfoController();
    private Cc: CognitionController = new CognitionController();
    async Verify (request: Request,): Promise<void>
    {
        const {token, sourceId, targetId} = request.body as IRegistrationFriendRelation;
        if(!(token && targetId && sourceId))
        {
            return Promise.reject({ status: 0, message: "invail request body" });
        }
        const singleToken = Token.make_token();
        if (!singleToken.checkToken(token))
        {
            return Promise.reject({ status: 0, message: "invail token" });
        }
    }
    async Process (request: Request,): Promise<Trouble<BasicMessageTakeawayDataInterface>>
    {
        try
        {
            const {targetId, sourceId} = request.body as IRegistrationFriendRelation;
            const ownerUser = await this.uic.find_user(sourceId);
            const beownerUser = await this.uic.find_user(targetId);
            await this.Cc.insert(ownerUser, beownerUser);

            return SolveConstructor({
                status : 0,
                message: "addition success",
            });
        }
        catch(error)
        {
            return SolveConstructor({
                status : 1,
                message: error,
            });
        }
    }
}

InjectionRouter({ method: "post", route: "/RegistrationFriendRelation", controller: new RegistrationFriendRelation, });