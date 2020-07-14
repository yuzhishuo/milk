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

type IEditPersonalInformation = Partial<UserInfo> & {token: string};

interface IEditPersonalInformationMessage
{
    status: 1| 0;
    message: string;
}


// eslint-disable-next-line @typescript-eslint/no-explicit-any
function assert (val: any, msg?: string): asserts val is IEditPersonalInformation
{ 
    if(!(val.token && val.telephone_number))
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
        info.password = undefined;
        info.PersonPicture = undefined;
        info.email = undefined;
        // info.telephone_number = undefined; /* temporary Comments */
        info.user_id = undefined;
        
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
            let user = await this.userInfoController.findUser(info.telephone_number);
            user = info as UserInfo;
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