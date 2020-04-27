import { ExternalInterface, BasicMessageTakeawayDataInterface, Trouble, SolveConstructor, } from "../utility/ExternalInterface";
import { UserInfo } from "../../entity/UserInfo";
import { Request } from "express";
import { Token } from "../utility/token";
import { UserInfoController } from "../../controller/UserInfoController";
import { InjectionRouter } from "../../routes/RoutersManagement";

type Partial<T> = 
{
    [P in keyof T]?: T[P];
};

type IEditPersonalInformation = Partial<UserInfo> & {token: string};

interface IEditPersonalInformationMessage
{
    status: 1| 0;
    message: string;
}

class EditPersonalInformation extends ExternalInterface<BasicMessageTakeawayDataInterface>
{
    private uic: UserInfoController = new UserInfoController();
    protected async Verify (request: Request): Promise<void>
    {
        const info = request.body as IEditPersonalInformation;

        // Modified fields are not allowed through this class
        info.password = undefined;
        info.HeadPortraitSrc = undefined;
        info.email = undefined;
        // info.telephone_number = undefined;
        info.user_id =undefined;

        // check token
        // const singleToken = Token.make_token();
        // if (!singleToken.checkToken(info.token))
        // {
        //     return Promise.reject({ status: 0, message: "invail token" });
        // }
    }

    protected async Process (request: Request): Promise<Trouble<BasicMessageTakeawayDataInterface>>
    {
        const info = request.body as IEditPersonalInformation;
        let user = await this.uic.findByTelephone(info.telephone_number);
        user = request.body as UserInfo;
        await this.uic.modify(user);
        return SolveConstructor<IEditPersonalInformationMessage>({ status: 1, message: "updata success", });
    }
}

InjectionRouter({ method: "post", route: "/EditPersonalInformation", controller: new EditPersonalInformation, });