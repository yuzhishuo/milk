import { NextFunction, Request, Response } from "express";

import { token, login_info } from "./utility/token";
import { user_info_controller } from "../controller/user_info_controller";
import { login_message, logout_message } from "./type/handle/online_message";
import { InjectionRouter } from "../routes/RoutersManagement";
import { express_body_verification } from "./utility/verification";



function loginByEmailUserServiceRequest (body: any): boolean
{
    return ("password" in body && ("telephone_number" in body || "telephone" in body));
}

export class UserService
{
    private tokenmanger: token<login_info> = token.make_token();
    private uic: user_info_controller = new user_info_controller();



    @express_body_verification<login_message>(loginByEmailUserServiceRequest)
    public async loginByEmail (request: Request, response: Response, next: NextFunction): Promise<login_message>
    {
        try
        {
            const t = await this.uic.findByEmail(request.body.email);

            if (t.password === request.body["password"])
            {
                return { status: 0, message: "login success", token: this.tokenmanger.create({unique: request.body["email"] as string}) };
            }
            else
            {
                return { status:1, message: "login fail", }
            }
        }
        catch
        {
            return { status:1, message: "login fail", }
        }

    }

    public logout (request: Request, response: Response, next: NextFunction): logout_message
    {

        /* header request process */
        if( !("token" in request.body || "telephone_number" in request.body))
        {
            return {
                status: 0,
                message: "Missing necessary request message",
            }
        }

        /*  */
        if(!this.tokenmanger.checkToken(request.body["token"]))
        {
            return {
                status: 0,
                message: "invail token",
            }
        }
        /* remove user token */
        if(!this.tokenmanger.exist(request.body["email"]))
        {
            return {
                status: 0,
                message: "invail operator",
            }
        }

        return {
            status:  1,
            message: "logout success",
        }
    }
}


InjectionRouter({method: "post", route: "/user_login_by_email", controller: new UserService, action: "loginByEmail"});
InjectionRouter({method: "post", route: "/user_logout", controller: new UserService, action: "logout"});