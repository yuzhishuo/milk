import { ExternalInterface, } from "../utility/ExternalInterface";
import { UserInfo } from "../../entity/UserInfo";
import { Request } from "express";
import { UserInfoController } from "../../controller/UserInfoController";
import { InjectionRouter } from "../../routes/RoutersManagement";
import { SolveConstructor, IBasicMessageCarryDataInterface, ITrouble, IBasicMessageInterface } from "../utility/BassMessage";
import { IsTest } from "../../unit_test/data/Option";
import { Signal } from "../utility/signal";
import { isNull } from "util";

type Partial<T> = 
{
    [P in keyof T]?: T[P];
};

// type t = Omit<UserInfo, "password"> & {token: string};

type IEditPersonalInformation = {token: string; id?: string | number; data: Partial<UserInfo>;};

interface IEditPersonalInformationMessage
{
    status: 1| 0;
    message: string;
}


// eslint-disable-next-line @typescript-eslint/no-explicit-any
function assert (val: any, msg?: string): asserts val is IEditPersonalInformation
{ 
    if(!(val.token && val.id))
    {
        throw SolveConstructor<IEditPersonalInformationMessage>({status: 0, message: msg });
    }
}

class EditPersonalInformation extends ExternalInterface<IBasicMessageCarryDataInterface>
{
    private userInfoController = new UserInfoController();
    protected async Verify (request: Request): Promise<void>
    {
        assert(request.body, "invail request header");

        const info = request.body;
        
        // Modified fields are not allowed through this class
        info.data.password = undefined;
        info.data.PersonPicture = undefined;
        info.data.email = undefined;
        info.data.user_id = undefined;
        info.data.telephone_number = undefined;
        
        if(!IsTest)
        {
            const baseTokenStruct = Signal.Unique().IsAvailability(info.token);

            if(isNull(baseTokenStruct))
            {
                throw SolveConstructor<IBasicMessageInterface>({status: 0, message: "invail token" });
            }

            info.id = baseTokenStruct.id;
            return;
        }
    }

    protected async Process (request: Request): Promise<ITrouble<IBasicMessageCarryDataInterface>>
    {
        try
        {
            const info = request.body as IEditPersonalInformation;
            // fix
            let user = await this.userInfoController.findUser(info.id,);
            info.data.telephone_number = user.telephone_number;
            info.data.user_id = user.user_id;
            user = info.data as UserInfo;
            await this.userInfoController.modify(user);
            return SolveConstructor<IEditPersonalInformationMessage>({ status: 1, message: "updata success", });
        }
        catch(e)
        {
            return SolveConstructor<IEditPersonalInformationMessage>({ status: 1, message: "unknow error", });
        }
    }
}

InjectionRouter({ method: "post", route: "/EditPersonalInformation", controller: new EditPersonalInformation, });