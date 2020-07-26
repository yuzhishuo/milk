import * as crypto from "crypto";
import { isUndefined, isNullOrUndefined, isNull } from "util";
import { IsTest } from "../../unit_test/data/Option";
import { SolveConstructor, IBasicMessageInterface } from "./BassMessage";

interface ISignal
{
    secret: string;
    readonly minTimeoutMillisecondConst: number;
    readonly timeoutMillisecondConst: number;
}

interface IBaseTokenStruct
{
    id: string;
}

interface ITokenStruct extends IBaseTokenStruct
{
    createTime: number;
    timeoutMillisecondConst: number;
    token?: string;
}


export function SignalCheck(token: string)
{
    if(!IsTest)
    {
        const baseTokenStruct = Signal.Unique().IsAvailability(token);

        if(isNull(baseTokenStruct))
        {
            throw SolveConstructor<IBasicMessageInterface>({status: 0, message: "invail token" });
        }
        return baseTokenStruct.id;
    }
    return null;
}

export class Signal
{

    private static instance?: Signal = null;
    private option?: ISignal = null;
    private signalMap = new Map<string, ITokenStruct>();

    public set Option (option: ISignal)
    {
        this.option = option;
    }

    public Create (id: string): string
    {        

        const tokenStruct = this.signalMap.get(id);

        if(!isNullOrUndefined(tokenStruct))
        {
            const isValid = this.IsOvertime(tokenStruct);
            if(isValid) return tokenStruct.token;
        }

        if(this.option === null)
        {
            throw new Error("configured before creating a token");
        }

        if(isNullOrUndefined(id)) return "";

        const baseTokenStruct: ITokenStruct =
        {
            id: id,
            createTime: Date.now(),
            timeoutMillisecondConst: this.option.minTimeoutMillisecondConst,
        };

        const base64str = Buffer.from(JSON.stringify(baseTokenStruct), "utf8").toString("base64");
        const hash = crypto.createHmac('sha256', this.option.secret);
        hash.update(base64str);
        const signature = hash.digest('base64');

        // set token
        baseTokenStruct.token = `${base64str}.${signature}`;
        this.signalMap.set(id, baseTokenStruct);
        
        return `${base64str}.${signature}`;
    }

    static Unique (): Signal
    {
        if(isNullOrUndefined(this.instance))
        {
            this.instance = new Signal();
            return this.instance;
        }
        return this.instance;
    }
    
    private IsOvertime (tokenStruct: ITokenStruct): boolean
    {
        return Date.now() -  tokenStruct.createTime > tokenStruct.timeoutMillisecondConst;
    }

    public IsAvailability (token: string): IBaseTokenStruct | null
    {
        const tokenarry: string[] = token.split('.');
        
        if(tokenarry.length != 2)
        {
            return null;
        }

        let token_data = {};
        
        try
        {
            token_data = JSON.parse(Buffer.from(tokenarry[0], "base64").toString("utf8"));
        }
        catch(e)
        {
            return null;
        }
        // verify signature
        const hash = crypto.createHmac('sha256', this.option.secret);
        hash.update(Buffer.from(JSON.stringify(token_data), "utf8").toString("base64"));
        const checkSignature = hash.digest('base64');
        
        const cache = this.signalMap.get((token_data as any).id); 
        
        if(isUndefined(cache)) return null;

        if(cache.token === token) return token_data as IBaseTokenStruct;
        
        return null;
    }


    private _IsAvailability (token: string): ITokenStruct | null
    {

        return this.IsAvailability(token) as ITokenStruct;
    }

    public Check (token: string): string
    {
        const tokenStruct = this._IsAvailability(token);
        return Signal.instance.Create(tokenStruct.id);
    }
}