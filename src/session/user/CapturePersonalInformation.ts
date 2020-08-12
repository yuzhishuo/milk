import { ExternalInterface, } from "../utility/ExternalInterface";
import { Request } from "express";
import { UserInfoController, } from "../../controller/UserInfoController";
import { InjectionRouter } from "../../routes/RoutersManagement";
import { SolveConstructor, IBasicMessageInterface, IBasicMessageCarryDataInterface, ITrouble } from "../utility/BassMessage";
import { Error } from "../../utility";
import { IsTest } from "../../unit_test/data/Option";
import { isNullOrUndefined } from "util";
import { SignalCheck } from "../utility/signal";


interface ICapturePersonalInformation
{
    id?: string | number;
    token: string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function asserts (val: any, msg?: string): asserts val is ICapturePersonalInformation
{
    const coverValue = val /* as IOneWayFriendRelationship */ ;

    if(!(IsTest && (isNullOrUndefined(coverValue.id)
    && Error(SolveConstructor<IBasicMessageInterface>({status: 0, message: msg })))))
    {
        return;
    }

    if(!(coverValue.id && coverValue.token))
    {
        throw SolveConstructor<IBasicMessageInterface>({status: 0, message: msg });
    }
}

class CapturePersonalInformation extends ExternalInterface<IBasicMessageCarryDataInterface>
{
    private userInfoController = new UserInfoController;

    protected async Verify (request: Request): Promise<void>
    {
        const body = request.body;
        
        asserts(body, 'invail request body');

        if(!IsTest)
        {
            body.id = SignalCheck(body.token);
        }

        if(isNullOrUndefined(body.id))
        {
            return Promise.reject({ status: 0, message: "invail token" });
        }
    }

    protected async Process (request: Request): Promise<ITrouble<IBasicMessageCarryDataInterface>>
    {
        try
        {
            const info = request.body as ICapturePersonalInformation;
            const user = await this.userInfoController.findUser(info.id,);
            return SolveConstructor<IBasicMessageCarryDataInterface>({status: 1, message: "find Success", data: user });
        }
        catch(e)
        {
            return SolveConstructor(e);
        }
    }
}

InjectionRouter({ method: "post", route: "/CapturePersonalInformation", controller: new CapturePersonalInformation, });