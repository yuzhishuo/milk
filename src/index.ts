/* eslint-disable @typescript-eslint/no-explicit-any */
// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="../types/easyrtc.d.ts" />
import * as easyrtc from "easyrtc";
import { createConnection } from "typeorm";
import * as express from "express";
import * as bodyParser from "body-parser";
import * as io from "socket.io"
import { routersManagement } from "./routes/RoutersManagement";
import { schedule_clear_token } from "./session/utility/timer";
import { user_test_account } from "./unit_test/data/user_test_account";

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
    
    easyrtc.on("authenticate", function (socket, easyrtcid, appName, username, credential, easyrtcAuthMessage, next)
    {
        next(null);
    });
}


// eslint-disable-next-line @typescript-eslint/no-floating-promises
main();