import * as crypto from "crypto";

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

export class Signal
{

    private static instance: Signal = null;
    private option: ISignal = null;
    private signalMap = new Map<string, ITokenStruct>();

    public set Option ( option: ISignal)
    {
        this.option = option;
    }

    public Create (id: string): string
    {
        if(this.option === null)
        {
            throw new Error("must be configured before creating a token");
        }
        if(id === undefined) return "";
        const baseTokenStruct: ITokenStruct =
        {
            id: id,
            createTime: Date.now().valueOf(),
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
        if(this.instance == null)
        {
            this.instance = new Signal();
            return this.instance;
        }
        return this.instance;
    }

    public IsAvailability (token: string): IBaseTokenStruct | null
    {
        const tokenarry: string[] = token.split('.');
        
        if(tokenarry.length < 2)
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
        
        if(cache.token === token) return token_data as IBaseTokenStruct;
        
        return null;
    }


    private _IsAvailability (token: string): ITokenStruct | null
    {
        const tokenarry: string[] = token.split('.');
        
        if(tokenarry.length < 2)
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
        
        if(cache.token === token) return token_data as ITokenStruct;
        
        return null;
    }

    public Check (token: string): string
    {
        const tokenStruct = this._IsAvailability(token);
        return Signal.instance.Create(tokenStruct.id);
    }
}