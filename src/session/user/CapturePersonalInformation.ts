import { ExternalInterface, } from "../utility/ExternalInterface";
import { Request } from "express";
import { Token } from "../utility/token";
import { UserInfoController, IFindUserErrorMessage } from "../../controller/UserInfoController";
import { InjectionRouter } from "../../routes/RoutersManagement";
import { SolveConstructor, BasicMessageInterface, BasicMessageTakeawayDataInterface, Trouble } from "../utility/BassMessage";

interface ICapturePersonalInformation
{
    id: string;
    token: string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function asserts (val: any, msg?: string): asserts val is ICapturePersonalInformation
{
    if(!(val.id && val.token))
    {
        throw SolveConstructor<BasicMessageInterface>({status: 0, message: msg });
    }
}

class CapturePersonalInformation extends ExternalInterface<BasicMessageTakeawayDataInterface>
{
    private userInfoController = new UserInfoController;

    protected async Verify (request: Request): Promise<void>
    {
        asserts(request.body);

        // // check token
    }

    protected async Process (request: Request): Promise<Trouble<BasicMessageTakeawayDataInterface>>
    {
        try
        {
            const info = request.body as ICapturePersonalInformation;
            const user = await this.userInfoController.findUser(info.id);
            return SolveConstructor({status: 0, message: "find Success", data: user });
        }
        catch(e)
        {
            return SolveConstructor(e);
        }
    }
}

InjectionRouter({ method: "post", route: "/CapturePersonalInformation", controller: new CapturePersonalInformation, });