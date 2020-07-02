import { ExternalInterface, } from "../utility/ExternalInterface";
import { Request } from "express";
import { UserInfoController, } from "../../controller/UserInfoController";
import { InjectionRouter } from "../../routes/RoutersManagement";
import { SolveConstructor, IBasicMessageInterface, IBasicMessageCarryDataInterface, ITrouble } from "../utility/BassMessage";

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
        throw SolveConstructor<IBasicMessageInterface>({status: 0, message: msg });
    }
}

class CapturePersonalInformation extends ExternalInterface<IBasicMessageCarryDataInterface>
{
    private userInfoController = new UserInfoController;

    protected async Verify (request: Request): Promise<void>
    {
        asserts(request.body, `invail request body`);

        // // check token
    }

    protected async Process (request: Request): Promise<ITrouble<IBasicMessageCarryDataInterface>>
    {
        try
        {
            const info = request.body as ICapturePersonalInformation;
            const user = await this.userInfoController.findUser(info.id);
            return SolveConstructor<IBasicMessageCarryDataInterface>({status: 0, message: "find Success", data: user });
        }
        catch(e)
        {
            return SolveConstructor(e);
        }
    }
}

InjectionRouter({ method: "post", route: "/CapturePersonalInformation", controller: new CapturePersonalInformation, });