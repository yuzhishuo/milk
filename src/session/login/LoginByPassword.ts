import { ExternalInterface, } from "../utility/ExternalInterface";
import { Request, } from "express";
import { IloginByPassword } from "../type/request/IloginByPassword";
import { Token } from "../utility/token";
import { IloginInfo } from "../utility/TokenType";
import { InjectionRouter } from "../../routes/RoutersManagement";

// fix
import { UserInfoController } from "../../controller/UserInfoController";
import { BasicMessageTakeawayDataInterface, SolveConstructor, BaseErrorMessage, Trouble } from "../utility/BassMessage";
// fix

export interface ILoginMessage<T= string>
{
    status:  1 | 0; /*1: success, 0: other */
    message: T;
    token?: T;
}

/* final */ class LoginByPassword extends ExternalInterface<BasicMessageTakeawayDataInterface>
{
    private tokenManager: Token<IloginInfo> = Token.make_token();
    private uic: UserInfoController = new UserInfoController();

    async Verify (request: Request): Promise<void>
    {
        const requestParameter = request.body as IloginByPassword;
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        if(requestParameter?.id === undefined && requestParameter?.password === undefined)
        {
            return Promise.reject(
                SolveConstructor<ILoginMessage<BaseErrorMessage>>({status: 1, message: "invail request body"})
            );
        }
    }

    async Process (request: Request): Promise<Trouble<BasicMessageTakeawayDataInterface>>
    {
        try
        {
            const requestParameter = request.body as IloginByPassword;
            const t = await this.uic.findByTelephone(requestParameter.id);

            if(t === undefined)
            {
                return SolveConstructor<ILoginMessage>({status:1, message: "user not exist", });
            }

            if (t.password === requestParameter.password)
            {
                return SolveConstructor<ILoginMessage>({ status: 0, message: "login success", token: this.tokenManager.create({id: requestParameter.id}) });
            }
            else
            {
                return SolveConstructor<ILoginMessage>({status:1, message: "password error", });
            }
        }
        catch
        {
            return SolveConstructor<ILoginMessage>({ status:1, message: "login fail", });
        }
    }
}

InjectionRouter({method: "post", route: "/login_by_password", controller: new LoginByPassword});