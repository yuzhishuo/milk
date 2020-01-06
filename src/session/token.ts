
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
    private tokensendarray : Map<string,T>;
    private static  instance = null;
    constructor(private readonly secret : string,) 
    {    
        this.tokensendarray = new Map<string,T>();
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
        console.log(r);
        return r;
    }

    public create(obj: T, timeout: number= 10000): string
    {
        this.tokensendarray[obj.login_name] = obj;
        let rst : token_struct<T> = {
            token_data: obj,
            created_time: Date.now().valueOf(),
            effective_time: timeout,
        }

        let base64str = Buffer.from(JSON.stringify(rst), "utf8").toString("base64");
        let hash = crypto.createHmac('sha256', this.secret);
            hash.update(base64str);
        let signature = hash.digest('base64');

        return `${base64str}}.${signature}`;
    }

    private decodeToken(tokenmessage: string): boolean | decode_token_struct<T>
    {
        let tokenarry : string[] = tokenmessage.split('.');
        if(tokenarry.length < 2)
        {
            return false;
        }

        let token_data = {};
        try{
            token_data = JSON.parse(Buffer.from(tokenarry[0],"base64").toString("utf8"));
        }catch(e){
            return false;
        }

        //检验签名        
        let hash = crypto.createHmac('sha256', this.secret);
            hash.update(tokenarry[0]);
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
        if(!(t as boolean))
        {
            return false;
        }

        let dts = t as decode_token_struct<T>; 
        let timeoutrst = new Date().valueOf()
        -
        dts.token_data.created_time <= dts.token_data.effective_time
        ? true : false;
        
        if(dts.checkedsignature === dts.signature && timeoutrst)
        {
            return true;
        }
        this.tokensendarray.delete(dts.token_data.token_data.login_name);
        return false;
    }
}
