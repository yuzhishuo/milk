import { ExternalInterface } from "../utility/ExternalInterface";
import { IBasicMessageCarryDataInterface, ITrouble, SolveConstructor, IBasicMessageInterface } from "../utility/BassMessage";
import { Request } from "express";
import { isNullOrUndefined, isNull } from "util";
import { Signal } from "../utility/signal";
import { CognitionController } from "../../controller/CognitionController";
import { UserInfoController } from "../../controller/UserInfoController";
import { UserInfo } from "../../entity/UserInfo";


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

        const baseTokenStruct = Signal.Unique().IsAvailability(getFriendsList.token);

        if(isNull(baseTokenStruct))
        {
            throw SolveConstructor<IBasicMessageInterface>({status: 0, message: "invail token" });
        }

        request.tokenId = baseTokenStruct.id;
    }
    
    protected async Process (request: Request): Promise<ITrouble<IBasicMessageCarryDataInterface>> 
    {
        const user = await this.userInfoController.find_user(request.tokenId);
        const friends = await this.cognitionController.FindAll(user);

        const friendInfos = new Array<UserInfo>();
        for(const friend of friends)
        {
            // TO DO: Typeorm BUG
            const f = friend.beowner_user as unknown as number == user.user_id ? friend.owner_user:friend.beowner_user;

            const f1 = await this.userInfoController.find_user(f as unknown as number);
            friendInfos.push(f1);
        }
        return SolveConstructor<IBasicMessageCarryDataInterface>({status: 0, message: "Find Success", data: friendInfos });
    }
}

