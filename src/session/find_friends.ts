import {NextFunction, Request, Response} from "express";
import {user_info_controller } from "../controller/user_info_controller";
import {user_info} from "../entity/user_info";
import {find_friend_request} from "./type/request/find_friends_request";
import {token} from "./utility/token";

type user_info_request = {
    [p in keyof user_info]? : user_info[p];
}


export class find_friend
{
    private uic : user_info_controller = new user_info_controller();
    async find(request: Request, response: Response, next: NextFunction)
    {
        let body = request.body as find_friend_request;
        console.log(body.token, body.user_email)
        if(body.user_email && body.token)
        {
            return
        }
        let t = token.make_token()
        if(!t.checkToken(body.token))
        {
            return {fail : "over"}
        }

        return await this.uic.find_user(body.user_email)

    }
}