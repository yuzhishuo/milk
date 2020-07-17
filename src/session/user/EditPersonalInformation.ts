import { ExternalInterface, } from "../utility/ExternalInterface";
import { UserInfo } from "../../entity/UserInfo";
import { Request } from "express";
import { UserInfoController } from "../../controller/UserInfoController";
import { InjectionRouter } from "../../routes/RoutersManagement";
import { SolveConstructor, IBasicMessageCarryDataInterface, ITrouble } from "../utility/BassMessage";

type Partial<T> = 
{
    [P in keyof T]?: T[P];
};

// type t = Omit<UserInfo, "password"> & {token: string};

type IEditPersonalInformation = {token: string; findMethod: "id" | "telephone" | "email"; id: string | number; data: Partial<UserInfo>;};

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
        // // check user exist
        // ...
        

        // // check token
        // const singleToken = Token.make_token();
        // if (!singleToken.checkToken(info.token))
        // {
        //     return Promise.reject({ status: 0, message: "invail token" });
        // }
    }

    protected async Process (request: Request): Promise<ITrouble<IBasicMessageCarryDataInterface>>
    {
        try
        {
            const info = request.body as IEditPersonalInformation;
            // fix
            let user = await this.userInfoController.findUser(info.id, info.findMethod);
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