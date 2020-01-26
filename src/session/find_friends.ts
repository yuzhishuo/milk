import {NextFunction, Request, Response} from "express";
import {user_info_controller } from "../controller/user_info_controller";
import {user_info} from "../entity/user_info";
import {find_friend_request} from "./type/request/find_friends_request";
import {token} from "./utility/token";
import {cognition_controller} from "../controller/cognition_controller";

type user_info_request = {
    [p in keyof user_info]? : user_info[p];
}


export class find_friend
{
    private uic : user_info_controller = new user_info_controller();
    private cc : cognition_controller = new cognition_controller();
    async find(request: Request, response: Response, next: NextFunction)
    {
        let body = request.body as find_friend_request;
        if(!(body.target && body.source && body.token))
        {
            return
        }
        let t = token.make_token()
        if(!t.checkToken(body.token))
        {
            return {fail : "over"}
        }

        let owner_user = await this.uic.find_user(body.source);
        let beowner_user = await this.uic.find_user(body.target);
        if(!(owner_user || beowner_user))
        {
            return {
                status: 0,
                mesg: "fail",
            }
        }

        this.cc.insert(owner_user, beowner_user);
        return {mesg : "addition success"};
    }
}