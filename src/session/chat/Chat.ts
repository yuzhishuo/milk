/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { InjectionRouter } from "../../routes/RoutersManagement";
import { ExternalInterface } from "../utility/ExternalInterface";
import { IBasicMessageCarryDataInterface, ITrouble } from "../utility/BassMessage";

interface IChatRequestInterface
{
    token: string;
    targetid: string;
    messagetype: string;
    message: string;
}

function asserts (val: any, message: string): val is IChatRequestInterface
{
    //if()
}

/* final */ class Chat extends ExternalInterface<IBasicMessageCarryDataInterface>
{
    protected Verify (..._args: any[]): Promise<void>
    {
        /*
            0. 请求头的重要性
            1. 检验双方用户是否存在
        */
        throw new Error("Method not implemented.");
    }

    protected Process (..._args: any[]): Promise<ITrouble<IBasicMessageCarryDataInterface>>
    {
        /*
            1. 检验消息类型， 根据消息类型只是用于解析message 的解析方法判断，
            2. 查看对方是否上线 上线则发送消息
            3. 不在线将信息结构化存储在 云上等待拉取
        */
        throw new Error("Method not implemented.");
    }
}
