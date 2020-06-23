/* eslint-disable @typescript-eslint/no-explicit-any */
// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="../types/easyrtc.d.ts" />
import * as easyrtc from "easyrtc";
import { createConnection } from "typeorm";
import * as express from "express";
import * as bodyParser from "body-parser";
import * as io from "socket.io";
import { routersManagement } from "./routes/RoutersManagement";
import { schedule_clear_token } from "./session/utility/timer";
import { user_test_account } from "./unit_test/data/user_test_account";
import { Signal } from "./session/utility/signal";
import { LoginByPassword } from "./session/login/LoginByPassword";
import { IsFail } from "./session/utility/BassMessage";

async function main (): Promise<void>
{
    const connection = await createConnection();
    // create express app
    const app = express();
    
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended: false}))
    
    routersManagement.loader.rquire();
    // register express routes from defined application routes
    routersManagement.SetRouter(app);

    //!!!important timer
    schedule_clear_token();

    // insert new users for test
    await user_test_account(connection);

    // Listen on port 3000
    const webServer=  app.listen(3000);

    const socketServer = io.listen(webServer);

    // Start EasyRTC server
    easyrtc.listen(app, socketServer, null, function (_err: any, rtcRef: { events: { on: (arg0: string, arg1: (appObj: any, creatorConnectionObj: any, roomName: any, roomOptions: any, callback: any) => void) => void } })
    {
        console.log("Initiated");

        rtcRef.events.on("roomCreate", function (appObj: { events: { defaultListeners: { roomCreate: (arg0: any, arg1: any, arg2: any, arg3: any, arg4: any) => void } } }, creatorConnectionObj: any, roomName: string, roomOptions: any, callback: any)
        {
            console.log("roomCreate fired! Trying to create: " + roomName);

            appObj.events.defaultListeners.roomCreate(appObj, creatorConnectionObj, roomName, roomOptions, callback);
        });
    });
    
    easyrtc.on("generatePeoples", function (connectionObj, _roomName, next)
    {
        connectionObj.CreatePeopleList(["990183536", '17695926312']);
        next(null);
    });

    easyrtc.on("authenticate", async function (socket, easyrtcid, appName, username, credential, easyrtcAuthMessage, next)
    {
        const cc = { body : {id: username, password: credential.password as string}};
        const loginByPassword = new LoginByPassword;
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        const result = await loginByPassword.Run(cc);
        if( IsFail(result)) 
        {
            next(true);
            return;
        }
        next(null);
    });

    easyrtc.on("captureToken", function (connectionObj, id, next)
    {
        const signal = Signal.Unique();
        const token = signal.Create(id as string);
        next(null, token);
    });

    easyrtc.on("emitCustomMsg", function (connectionObj, msg, next)
    {
        
        next(null);
    });

    const signal = Signal.Unique();
    signal.Option = {
        secret: "MilkRTC",
        minTimeoutMillisecondConst: 20000,
        timeoutMillisecondConst: 20000,
    }
}


// eslint-disable-next-line @typescript-eslint/no-floating-promises
main();