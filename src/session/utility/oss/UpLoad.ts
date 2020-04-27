import { ExternalInterface, BasicMessageTakeawayDataInterface, Trouble, SolveConstructor, NormalConstructor, FailConstructor, } from "../ExternalInterface";
import { Request, } from "express";
import { InjectionRouter } from "../../../routes/RoutersManagement";
import * as multer from "multer";
import * as fs from "fs";
import * as Oss from "ali-oss";

/* eslint-disable @typescript-eslint/no-namespace */
declare global
{
    namespace Express
    {
        // eslint-disable-next-line @typescript-eslint/interface-name-prefix
        interface Request
        {
            fileaddress: string;
        }
    }
}

interface IUpLoadRequest
{
    token: string;
    id: string;
}

interface IUpLoadErrorMessage
{
    status: 0| 1;
    message: string;
}

interface IUpLoadMessage
{
    status: 0| 1;
    message: string;
}

export class UpLoad extends ExternalInterface<BasicMessageTakeawayDataInterface>
{
    public upLoad = multer({dest: "uploads/"} as multer.Options);
    public ossClient = new Oss({
        region: 'oss-cn-shanghai',
        accessKeyId: 'LTAI4Fu9GcYg6jUaaaGiEVtw',
        accessKeySecret: 'zOoza3m604xja430WqyBNaDDFURAfE',
        bucket: 'milk-01',
    })

    public constructor (public FileName: string = "avatar" )
    {
        super();
        InjectionRouter({method: "post", route: "/upload", controller: this.upLoad.single(this.FileName)});
    }

    public async Verify (request: Request): Promise<void>
    {
        const info =  request.body as IUpLoadRequest
        if(!(info.id && info.id))
        {
            return Promise.reject({ status: 0, message: "invail token" } as IUpLoadErrorMessage );
        }
    }
    
    public async Process (requset: Request): Promise<Trouble<BasicMessageTakeawayDataInterface>>
    {

        try
        {
            const fileBuffs = fs.readFileSync(requset.file.path);
            await this.ossClient.put(requset.file.originalname, fileBuffs);
            const outerLinkUrl = this.ossClient.signatureUrl(requset.file.originalname);
            requset.fileaddress = outerLinkUrl;
        }
        catch(e)
        {
            return FailConstructor("service is not available");
        }

        if(this.CanNext())
        {
            return SolveConstructor<IUpLoadMessage>({ status:1, message: "upload success", });
        }
        return NormalConstructor<IUpLoadMessage>("Next");
    }
}

InjectionRouter({method: "post", route: "/upload", controller: new UpLoad});