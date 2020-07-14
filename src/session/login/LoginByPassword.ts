import { ExternalInterface, } from "../utility/ExternalInterface";
import { Request, } from "express";
import { IloginByPassword } from "../type/request/IloginByPassword";
import { Token } from "../utility/token";
import { IloginInfo } from "../utility/TokenType";
import { IBasicMessageCarryDataInterface, SolveConstructor, BaseErrorMessage, ITrouble, IBasicMessageInterface } from "../utility/BassMessage";
import { UserInfoController } from "../../controller/UserInfoController";


/* final */ export class LoginByPassword extends ExternalInterface<IBasicMessageCarryDataInterface>
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
                SolveConstructor<IBasicMessageInterface<BaseErrorMessage>>({status: 1, message: "invail request body"})
            );
        }
    }

    async Process (request: Request): Promise<ITrouble<IBasicMessageCarryDataInterface>>
    {
        try
        {
            const requestParameter = request.body as IloginByPassword;
            const t = await this.uic.FindById(Number(requestParameter.id));

            if(t === undefined)
            {
                return SolveConstructor<IBasicMessageInterface>({status:1, message: "user not exist", });
            }

            if (t.password === requestParameter.password)
            {
                return SolveConstructor<IBasicMessageCarryDataInterface>({ status: 0, message: "login success", data: { token: this.tokenManager.create({id: requestParameter.id})} });
            }
            else
            {
                return SolveConstructor<IBasicMessageInterface>({status:1, message: "password error", });
            }
        }
        catch
        {
            return SolveConstructor<IBasicMessageInterface>({ status:1, message: "login fail", });
        }
    }
}

// InjectionRouter({method: "post", route: "/login_by_password", controller: new LoginByPassword});