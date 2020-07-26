import {ItokenStruct, IloginInfo, IdecodeTokenStruct, } from "./TokenType";
import * as crypto from "crypto";
import { assert } from "console";

/* eslint-disable @typescript-eslint/no-namespace */
declare global
{
    namespace Express
    {
        // eslint-disable-next-line @typescript-eslint/interface-name-prefix
        interface Request
        {
            tokenId: number | string;
        }
    }
}

export class singleton_token<T extends IloginInfo>
{
    constructor (private tokenreference: Token<T>,  private token: IdecodeTokenStruct<T>| null)
    {}

    public is_create_token (): string
    {
        if( Date.now() - this.token.token_info.created_time > this.token.token_info.effective_time )
        {
            return this.tokenreference.create(this.token.token_info.token_data);
        }
        return this.token.signature;
    }

    public get TokenId (): string
    {
        return this.token.token_info.token_data.id
    }
}

export class Token<T extends IloginInfo>
{
    private tokensend = new Map<string, ItokenStruct<T>>();
    private static instance = null;
    public static readonly timeout_millisecond_const = 5 *1000;

    private constructor (private readonly secret: string, private readonly min_timeout_millisecond_const = 1000) {}
    
    static make_token (key = "defualt"): Token<IloginInfo>
    {
        if(this.instance == null)
        {
            this.instance = new Token(key);
            return this.instance;
        }
        return this.instance;
    }

    public exist (key: string): boolean
    {
        return this.tokensend.delete(key);
    }

    public create (obj: T, timeout: number= Token.timeout_millisecond_const): string
    {
        assert(timeout > this.min_timeout_millisecond_const,
            `timeout: ${timeout.toString()} must more than min_timeout_millisecond_const: ${this.min_timeout_millisecond_const.toString()}`);
        
        const rst: ItokenStruct<T> = {
            token_data: obj,
            created_time: Date.now().valueOf(),
            effective_time: timeout,
        };
        const base64str = Buffer.from(JSON.stringify(rst), "utf8").toString("base64");
        const hash = crypto.createHmac('sha256', this.secret);
        hash.update(base64str);
        const signature = hash.digest('base64');

        this.tokensend.set(obj.id, rst);
        return `${base64str}.${signature}`;
    }

    public clear_timeout_token (): string[]
    {
        const current_time = new Date().valueOf();
        const rst = new Array<string>();
        for(const [key, value] of this.tokensend )
        {
            if(current_time - value.created_time < value.effective_time)
            {
                continue;
            }
            this.tokensend.delete(key);
            rst.push(key);
        }
        return rst;
    }

    public decodeToken_t (tokenmessage: string): singleton_token<T> | null
    {
        const tokenarry: string[] = tokenmessage.split('.');
        
        if(tokenarry.length < 2)
        {
            return null
        }

        let token_data = {};
        try
        {
            token_data = JSON.parse(Buffer.from(tokenarry[0], "base64").toString("utf8"));
        }
        catch(e)
        {
            return null
        }
        // verify signature
        const hash = crypto.createHmac('sha256', this.secret);
        hash.update(Buffer.from(JSON.stringify(token_data), "utf8").toString("base64"));
        const checkSignature = hash.digest('base64');

        return new singleton_token(this, {
            token_info: token_data as ItokenStruct<T>,
            signature: tokenarry[1],
            checkedsignature: checkSignature,
        })
    }

    private decodeToken (tokenmessage: string): undefined | IdecodeTokenStruct<T>
    {
        const tokenarry: string[] = tokenmessage.split('.');
        if(tokenarry.length !== 2)
        {
            return undefined;
        }

        let token_data = {};
        try
        {
            token_data = JSON.parse(Buffer.from(tokenarry[0], "base64").toString("utf8"));
        }
        catch(e)
        {
            return undefined;
        }
        // verify signature
        const hash = crypto.createHmac('sha256', this.secret);
        hash.update(Buffer.from(JSON.stringify(token_data), "utf8").toString("base64"));
        const checkSignature = hash.digest('base64');

        return {
            token_info: token_data as ItokenStruct<T>,
            signature: tokenarry[1],
            checkedsignature: checkSignature,
        }
    }

    public istimeout (tokenmessage: string): boolean | IdecodeTokenStruct<T>
    {
        const deToken = this.decodeToken(tokenmessage);

        if( Date.now() - deToken.token_info.created_time > deToken.token_info.effective_time )
        {
            return deToken;
        }
        else
        {
            return true;
        }
    }

    // public CheckToken(tokenmessage: string): singleton_token<T> | null
    // {
    //     const dts = this.decodeToken_t(tokenmessage);
    // }

    public checkToken (tokenmessage: string): boolean
    {
        const dts = this.decodeToken(tokenmessage);
        if(dts === null || dts === undefined )
        {
            return false;
        }
        if(dts.checkedsignature === dts.signature)
        {
            return true;
        }
        return false;
    }
}

export function sendtoken (option: { index: number; position: any[]} = { index: 0, position: ["body"]})
{
    return function (target: any, propertyKey: string, descriptor: TypedPropertyDescriptor<Function>)
    {
        const raw = descriptor.value;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        descriptor.value = async function (...args: any[]): Promise<any>
        {
            const tokenstr = args[option.index][option.position[0]].token;
            const t = Token.make_token();
            let tokenstr_t = t.decodeToken_t(tokenstr).is_create_token();
            if(tokenstr_t === "undefined") tokenstr_t = tokenstr;
            const res = await raw.apply(this, args)
            Object.defineProperties(res,
                {token: {value: tokenstr_t,
                    configurable: true,
                    enumerable: true,
                    writable: true
                }});
            return res;
        };
    }
}