import { NextFunction, Request, Response } from "express";

import { token, login_info } from "./utility/token";
import { user_info_controller } from "../controller/user_info_controller";
import { login_message, logout_message } from "./type/handle/online_message";

export class user_service
{
    private tokenmanger: token<login_info> = token.make_token();
    private uic: user_info_controller = new user_info_controller();

    public async login (request: Request, response: Response, next: NextFunction): Promise<login_message>
    {
        const t = await this.uic.one(request, response, next);

        if(!("password" in request.body))
        {
            return {status: 1, message: "login fail"};
        }

        if (t.password === request.body["password"])
        {
            return { status: 0, message: "login success", token: this.tokenmanger.create({unique: request.body["email"] as string}) };
        }

        return { status:1, message: "login fail", }
    }

    public logout (request: Request, response: Response, next: NextFunction): logout_message
    {

        /* header request process */
        if( !("token" in request.body || "email" in request.body))
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