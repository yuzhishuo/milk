import { ExternalInterface, } from "./utility/ExternalInterface";
import { Request } from "express";
import { InjectionRouter } from "../routes/RoutersManagement";
import { UserInfoController } from "../controller/UserInfoController";
import { CognitionController } from "../controller/CognitionController";
import { IBasicMessageCarryDataInterface, ITrouble, SolveConstructor, IBasicMessageInterface } from "./utility/BassMessage";


interface IRegistrationFriendRelation
{
    token: string;
    id: number;
    targetId: string;
    findMethod: "id" | "telephone" | "email"; // for targetId
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function asserts (val: any, msg?: string): asserts val is IRegistrationFriendRelation
{
    if(val.token && val.sourceId && val.targetId)
    {
        throw SolveConstructor<IBasicMessageInterface>({status: 0, message: msg });
    }
}

// ** discard
class RegistrationFriendRelation extends ExternalInterface<IBasicMessageCarryDataInterface>
{
    private uic: UserInfoController = new UserInfoController();
    private Cc: CognitionController = new CognitionController();
    
    async Verify (request: Request,): Promise<void>
    {
        asserts(request.body, "invail request body");

    }
    async Process (request: Request,): Promise<ITrouble<IBasicMessageCarryDataInterface>>
    {
        try
        {
            const {targetId, id, findMethod} = request.body as IRegistrationFriendRelation;
            const ownerUser = await this.uic.findUser(id);
            const beownerUser = await this.uic.findUser(targetId, findMethod);
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