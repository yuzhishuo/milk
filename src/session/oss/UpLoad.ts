import { ExternalInterface, BasicMessageTakeawayDataInterface, Trouble, SolveConstructor, } from "../utility/ExternalInterface";
import { Request, } from "express";
import { InjectionRouter } from "../../routes/RoutersManagement";
import * as multer from "multer";
import { ILoginMessage } from "../login/LoginByPassword";
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
            FileAddress: string;
        }
    }
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

    public async Verify (_request: Request): Promise<void>
    {
        return;
    }
    
    public async Process (requset: Request): Promise<Trouble<BasicMessageTakeawayDataInterface>>
    {

        try
        {
            const FileBuffs = fs.readFileSync(requset.file.path);
            const result = await this.ossClient.put(this.FileName, FileBuffs);
            const OuterLinkUrl = this.ossClient.signatureUrl('object-name')
        }
        catch(e)
        {
            console.log(e);
        }

        return SolveConstructor<ILoginMessage>({ status:1, message: "login fail", });
    }
}

InjectionRouter({method: "post", route: "/upload", controller: new UpLoad});