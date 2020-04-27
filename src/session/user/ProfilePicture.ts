import { ExternalInterface, BasicMessageTakeawayDataInterface, Trouble, SolveConstructor } from "../utility/ExternalInterface";
import { Request } from "express";
import { UpLoad } from "../utility/oss/UpLoad";
import { InjectionRouter } from "../../routes/RoutersManagement";
import { UserInfoController } from "../../controller/UserInfoController";


interface IProfilePicture
{
    status: 0| 1;
    message: string;
}

class ProfilePicture extends ExternalInterface<BasicMessageTakeawayDataInterface>
{
    private userInfoController = new UserInfoController();
    protected async Verify (request: Request): Promise<void>
    {
        // Some portion of the survey by the other classes
    }

    protected async Process (request: Request): Promise<Trouble<BasicMessageTakeawayDataInterface>> 
    {
        try
        {
            const user = await this.userInfoController.findByTelephone(request.tokenId);
            user.HeadPortraitSrc = request.fileaddress;
            await this.userInfoController.modify(user);
            return SolveConstructor<IProfilePicture>({ status: 1, message: "update success", });
        }
        catch(e)
        {
            return SolveConstructor<IProfilePicture>({ status: 0, message: "unknow error", });
        }
    }
}

const upLoad = new UpLoad("ProfilePicture", "single", "/ProfilePicture");
upLoad.Next = new ProfilePicture;

InjectionRouter({ method: "post", route: "/ProfilePicture", controller: upLoad, });