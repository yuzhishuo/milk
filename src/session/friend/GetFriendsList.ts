import { ExternalInterface } from "../utility/ExternalInterface";
import { IBasicMessageCarryDataInterface, ITrouble, SolveConstructor, IBasicMessageInterface } from "../utility/BassMessage";
import { Request } from "express";
import { InjectionRouter } from "../../routes/RoutersManagement";
import { isNullOrUndefined, isNull } from "util";
import { Signal } from "../utility/signal";
import { CognitionController } from "../../controller/CognitionController";
import { UserInfoController } from "../../controller/UserInfoController";


interface IGetFriendsList
{
    token: string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function asserts (val: any, msg?: string): asserts val is IGetFriendsList
{
    if(isNullOrUndefined(val.token))
    {
        throw SolveConstructor<IBasicMessageInterface>({status: 0, message: msg });
    }
}

class GetFriendsList extends ExternalInterface<IBasicMessageCarryDataInterface>
{
    private cognitionController = new CognitionController();
    private userInfoController = new UserInfoController();

    protected async Verify (request: Request): Promise<void>
    {
        const getFriendsList = request.body;
        asserts(getFriendsList, "invail request body");

        const baseTokenStruct = Signal.Unique().IsAvailability(getFriendsList.token);

        if(isNull(baseTokenStruct))
        {
            throw SolveConstructor<IBasicMessageInterface>({status: 0, message: "invail token" });
        }

        request.tokenId = baseTokenStruct.id;
    }
    
    protected async Process (request: Request): Promise<ITrouble<IBasicMessageCarryDataInterface>> 
    {
        const user = await this.userInfoController.findUser(request.tokenId);
        const friends = await this.cognitionController.FindAll(user);
        return SolveConstructor<IBasicMessageCarryDataInterface>({status: 0, message: "Find Success", data: friends });
    }
}

InjectionRouter({ method: "post", route: "/GetFriendsList", controller: new GetFriendsList, });