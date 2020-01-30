import {NextFunction, Request, Response} from "express";
import {user_info_controller } from "../controller/user_info_controller";
import {user_info} from "../entity/user_info";
import {find_friend_request} from "./type/request/find_friends_request";
import {token, sendtoken} from "./utility/token";
import {cognition_controller} from "../controller/cognition_controller";
import {find_friend_message} from "./type/handle/find_friend_message";

type user_info_request =
{
    [p in keyof user_info]? : user_info[p];
}


export class find_friend
{
    private uic : user_info_controller = new user_info_controller();
    private cc : cognition_controller = new cognition_controller();

    @sendtoken<find_friend_message>()
    async find(request: Request, response: Response, next: NextFunction) :Promise<find_friend_message>
    {
        let body = request.body as find_friend_request;
        if(!(body.target && body.source && body.token))
        {
            return {
                status: 0,
                message: "invail variable",
            };
        }
        let t = token.make_token();
        if(!t.checkToken(body.token))
        {
            return {
                status: 0,
                message: "invail token",
            };
        }

        let it = t.istimeout(body.token);

        let owner_user = await this.uic.find_user(body.source);
        let beowner_user = await this.uic.find_user(body.target);

        let newtoken : string = body.token;
        if(typeof it !== "boolean")
        {
            newtoken = t.create(it.token_info.token_data);
        }

        if(!(owner_user || beowner_user))
        {
            return {
                status: 0,
                message: "invail variable",
                token: newtoken,
            };
        }

        let res = await this.cc.insert(owner_user, beowner_user);

        if(typeof res === "string")
        {
            return {
                status: 0,
                message: "insert fail",
            }
        }

        return {
            status : 0,
            message: "addition success",
            token: newtoken,
        };
    }


}