import { ExternalInterface } from "../utility/ExternalInterface";
import { IBasicMessageCarryDataInterface, ITrouble, SolveConstructor, IBasicMessageInterface } from "../utility/BassMessage";
import { Request } from "express";
import { isNullOrUndefined } from "util";
import { SignalCheck } from "../utility/signal";
import { CognitionController } from "../../controller/CognitionController";
import { UserInfoController } from "../../controller/UserInfoController";
import { UserInfo } from "../../entity/UserInfo";
import { IsTest } from "../../unit_test/data/Option";


interface IGetFriendsList
{
    id?: number | string;
    token: string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function asserts (val: any, msg?: string): asserts val is IGetFriendsList
{

    if(!(IsTest && (isNullOrUndefined(val.id)
    && Promise.reject(SolveConstructor<IBasicMessageInterface>({status: 0, message: msg })))))
    {
        return;
    }

    if(isNullOrUndefined(val.token))
    {
        throw SolveConstructor<IBasicMessageInterface>({status: 0, message: msg });
    }
}

export class GetFriendsList extends ExternalInterface<IBasicMessageCarryDataInterface>
{
    private cognitionController = new CognitionController();
    private userInfoController = new UserInfoController();
    
    public constructor (private IsInterior: boolean = false)
    {
        super();
    }
    
    protected async Verify (request: Request): Promise<void>
    {
        if(this.IsInterior) { request.tokenId = request.body.id; return; }

        const getFriendsList = request.body;
        asserts(getFriendsList, "invail request body");

        
        if(!IsTest)
        {
            getFriendsList.id = SignalCheck(getFriendsList.token);
        }

    }
    
    protected async Process (request: Request): Promise<ITrouble<IBasicMessageCarryDataInterface>> 
    {
        const user = await this.userInfoController.findUser(request.body.id);
        const friends = await this.cognitionController.FindAll(user);

        const friendInfos = new Array<UserInfo>();
        for(const friend of friends)
        {
            // TO DO: Typeorm BUG
            const f = friend.beowner_user as unknown as number == user.user_id ? friend.owner_user:friend.beowner_user;

            const f1 = await this.userInfoController.findUser(f as number);
            friendInfos.push(f1);
        }
        return SolveConstructor<IBasicMessageCarryDataInterface>({status: 0, message: "Find Success", data: friendInfos });
    }
}

