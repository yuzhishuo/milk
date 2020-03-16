import { NextFunction, Request, Response } from "express";
import { user_info_controller } from "../controller/user_info_controller";
import { UserInfo } from "../entity/UserInfo";
import { find_friend_request } from "./type/request/find_friends_request";
import { Token, sendtoken } from "./utility/token";
import { CognitionController } from "../controller/CognitionController";
import { find_friend_message } from "./type/handle/find_friend_message";
import { express_body_verification } from "./utility/verification";

interface find_t_interface
{
    source: string;
    target: string;
    token: string;
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any

export class find_friend
{
    private uic: user_info_controller = new user_info_controller();
    private cc: CognitionController = new CognitionController();


    // eslint-disable-next-line @typescript-eslint/no-untyped-public-signature
    public static AssertIs_find_friend_request (val: any): asserts val is find_friend_request
    {
        if(!(val.source && val.target && val.token))
        {
            throw new TypeError("is not find_friend_request");
        }
    }

    @sendtoken<find_friend_message>()
    async find (request: Request, response: Response, next: NextFunction): Promise<find_friend_message>
    {
        find_friend.AssertIs_find_friend_request(request.body);
        const body = request.body;
        if(!(body.target && body.source && body.token))
        {
            return {
                status: 0,
                message: "invail variable",
            };
        }
        const t = Token.make_token();
        if(!t.checkToken(body.token))
        {
            return {
                status: 0,
                message: "invail token",
            };
        }

        const it = t.istimeout(body.token);

        const owner_user = await this.uic.find_user(body.source);
        const beowner_user = await this.uic.find_user(body.target);

        let newtoken: string = body.token;
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

        const res = await this.cc.insert(owner_user, beowner_user);

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

    @express_body_verification<UserInfo| find_friend_message>(find_friend.find_t_verification)
    async find_t (request: Request, _response: Response, _next: NextFunction): Promise<UserInfo | find_friend_message>
    {
        const body = request.body;

        const beowner_user = await this.uic.find_user(body.target);

        if(!beowner_user)
        {
            return {
                status: 0,
                message: "invail token"
            }
        }
        return beowner_user;

    }
    public static find_t_verification (fti: find_t_interface): boolean
    {
        if(fti.source && fti.target && fti.token)
        {
            return true;
        }
        return false;
    }
}