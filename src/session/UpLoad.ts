import { ExternalInterface, BasicMessageTakeawayDataInterface, Trouble, SolveConstructor, BaseErrorMessage } from "./utility/ExternalInterface";
import { Request, Response, NextFunction, } from "express";
import { InjectionRouter } from "./../routes/RoutersManagement";
import * as multer from "multer"
import { IloginMessage } from "./login/LoginByPassword";
import * as fs from "fs";

class UpLoad extends ExternalInterface<BasicMessageTakeawayDataInterface>
{
    public upload = multer({dest: "uploads/"} as multer.Options);

    public constructor ()
    {
        super();
        InjectionRouter({method: "post", route: "/upload", controller: this.upload.single("avatar")});
    }

    public async Verify (request: Request): Promise<void>
    {
        return;
    }
    
    public async Process (requset: Request): Promise<Trouble<BasicMessageTakeawayDataInterface>>
    {
        const FileBuffs = fs.readFileSync(requset.file.path);
        try{
            
            fs.writeFileSync(__dirname + "\\..\\..\\uploads\\" + requset.file.originalname, FileBuffs, {flag: "w+"})
        }catch(e)
        {
            console.log(e)
        }
       
        return SolveConstructor<IloginMessage>({ status:1, message: "login fail", });
    }
}

InjectionRouter({method: "post", route: "/upload", controller: new UpLoad});