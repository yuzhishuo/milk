
import * as crypto from "crypto"

type timestamp = number; 

interface token_struct<T>
{
    token_data: T;
    created_time: timestamp /* timestamp */;
    effective_time: timestamp /*timestamp*/;
}

interface decode_token_struct<T>
{
    token_data: token_struct<T>;
    signature: string;
    checkedsignature: string;
}

export interface login_info
{
    login_name : string;
}

export class token<T extends login_info>
{
    private tokensendarray : Map<string, token_struct<T>>;
    private static  instance = null;
    public static readonly timeout_millisecond_const = 5 *1000;
    constructor(private readonly secret : string,) 
    {    
        this.tokensendarray = new Map<string, token_struct<T>>();
    }
    static make_token(): token<login_info>
    {
        if( this.instance == null)
        {
            this.instance = new token("default");
            return this.instance;
        }
        return this.instance;
    }
    public exist(login_name : string): boolean
    {
        let r = this.tokensendarray.delete(login_name);
        return r;
    }

    public create(obj: T, timeout: number= token.timeout_millisecond_const): string
    {
        
        let rst : token_struct<T> = {
            token_data: obj, 
            created_time: Date.now().valueOf(),
            effective_time: timeout,
        }
        let base64str = Buffer.from(JSON.stringify(rst), "utf8").toString("base64");
        let hash = crypto.createHmac('sha256', this.secret);
            hash.update(base64str);
        let signature = hash.digest('base64');

        this.tokensendarray.set(obj.login_name, rst);
        return `${base64str}.${signature}`;
    }

    public clear_timeout_token() : Array<string>
    {
        let current_time = new Date().valueOf();
        let rst = new Array<string>();
        for(let [key, value] of this.tokensendarray )
        {
            if(current_time - value.created_time < value.effective_time)
            {
                continue
            }
            this.tokensendarray.delete(key);
            rst.push(key)
        
        }
        return rst;
    }
    
    private decodeToken(tokenmessage: string): decode_token_struct<T>
    {
        let tokenarry : string[] = tokenmessage.split('.');
        if(tokenarry.length < 2)
        {
            return null;
        }

        let token_data = {};
        try{
            token_data = JSON.parse(Buffer.from(tokenarry[0],"base64").toString("utf8"));
        }catch(e){
            return null;
        }
        //检验签名        
        let hash = crypto.createHmac('sha256', this.secret);
            hash.update(Buffer.from(JSON.stringify(token_data), "utf8").toString("base64"));
        let checkSignature = hash.digest('base64');

        return {
            token_data: token_data as token_struct<T>,
            signature: tokenarry[1],
            checkedsignature: checkSignature,
        } 
    }

    public checkToken(tokenmessage: string) : boolean
    {
        let t = this.decodeToken(tokenmessage);
        if(t == null)
        {
            return false;
        }

        let dts = t as decode_token_struct<T>; 
        
        if(dts.checkedsignature === dts.signature)
        {
            return true;
        }
        return false;
    }
}
