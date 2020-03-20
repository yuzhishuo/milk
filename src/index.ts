// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="../types/easyrtc.d.ts" />
import * as easyrtc from "easyrtc";

import { createConnection } from "typeorm";
import * as express from "express";
import * as bodyParser from "body-parser";
import * as http from "https";
import * as socketIo from "socket.io";
import { routersManagement } from "./routes/RoutersManagement";

import { schedule_clear_token } from "./session/utility/timer";
import { user_test_account } from "./unit_test/data/user_test_account";

createConnection().then(async connection =>
{
    // create express app
    const app = express();
    app.use(bodyParser.json());

    // register express routes from defined application routes
    routersManagement.loader.rquire();
    routersManagement.SetRouter(app);

    const webServer = http.createServer(app);
    const socketServer = socketIo.listen(webServer);

    easyrtc.setOption("logLevel", "debug");

    // Overriding the default easyrtcAuth listener, only so we can directly access its callback
    easyrtc.events.on("easyrtcAuth", function (socket: any, easyrtcid: string, msg: { msgData: { credential: any } }, socketCallback: any, callback: (arg0: any, arg1: any) => void)
    {
        easyrtc.events.defaultListeners.easyrtcAuth(socket, easyrtcid, msg, socketCallback, function (err: any, connectionObj: { setField: (arg0: string, arg1: any, arg2: { "isShared": boolean }) => void; getFieldValueSync: (arg0: string) => any })
        {
            if (err || !msg.msgData || !msg.msgData.credential || !connectionObj)
            {
                callback(err, connectionObj);
                return;
            }

            connectionObj.setField("credential", msg.msgData.credential, {"isShared":false});

            console.log("["+easyrtcid+"] Credential saved!", connectionObj.getFieldValueSync("credential"));

            callback(err, connectionObj);
        });
    });

    // To test, lets print the credential to the console for every room join!
    easyrtc.events.on("roomJoin", function (connectionObj: { getEasyrtcid: () => string; getFieldValueSync: (arg0: string) => any }, roomName: any, roomParameter: any, callback: any)
    {
        console.log("["+connectionObj.getEasyrtcid()+"] Credential retrieved!", connectionObj.getFieldValueSync("credential"));
        easyrtc.events.defaultListeners.roomJoin(connectionObj, roomName, roomParameter, callback);
    });

    // Start EasyRTC server
    easyrtc.listen(app, socketServer, null, function (err: any, rtcRef: { events: { on: (arg0: string, arg1: (appObj: any, creatorConnectionObj: any, roomName: any, roomOptions: any, callback: any) => void) => void } })
    {
        console.log("Initiated");

        rtcRef.events.on("roomCreate", function (appObj: { events: { defaultListeners: { roomCreate: (arg0: any, arg1: any, arg2: any, arg3: any, arg4: any) => void } } }, creatorConnectionObj: any, roomName: string, roomOptions: any, callback: any)
        {
            console.log("roomCreate fired! Trying to create: " + roomName);

            appObj.events.defaultListeners.roomCreate(appObj, creatorConnectionObj, roomName, roomOptions, callback);
        });
    });

    // start express server
    webServer.listen(3000);

    //!!!important timer
    schedule_clear_token();


    // insert new users for test
    await user_test_account(connection);

    console.log("Milk server has started on port 3000.");

}).catch(error => console.log(error));