import { ExternalInterface, } from "../utility/ExternalInterface";
import { Request, } from "express";
import { IBasicMessageCarryDataInterface, SolveConstructor, BaseErrorMessage, ITrouble, IBasicMessageInterface } from "../utility/BassMessage";
import { UserInfoController } from "../../controller/UserInfoController";
import { Signal } from "../utility/signal";


interface ILogin
{
    id: string | number;
    password: string;
}

/* final */ export class LoginByPassword extends ExternalInterface<IBasicMessageCarryDataInterface>
{
    private userInfoController: UserInfoController = new UserInfoController();
    private signal : Signal = Signal.Unique();

    async Verify (request: Request): Promise<void>
    {   
        const requestParameter = request.body as ILogin;
        if(requestParameter && requestParameter.id && requestParameter.password)
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
            const requestParameter = request.body as ILogin;
            const user = await this.userInfoController.findUser(requestParameter.id);

            if(user === undefined)
            {
                return SolveConstructor<IBasicMessageInterface>({status:1, message: "user not exist", });
            }

            if (user.password === requestParameter.password)
            {
                return SolveConstructor<IBasicMessageCarryDataInterface>({ status: 0, message: "login success",
                data: { token: this.signal.Create( requestParameter.id )} });
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