/* eslint-disable @typescript-eslint/no-explicit-any */
// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="../types/easyrtc.d.ts" />
import * as easyrtc from "easyrtc";
import { createConnection } from "typeorm";
import * as express from "express";
import * as bodyParser from "body-parser";
import * as io from "socket.io";
import { routersManagement } from "./routes/RoutersManagement";
import { ScheduleClearToken } from "./session/utility/Timer";
import { UserTestAccount } from "./unit_test/data/UserTestAccount";
import { Signal } from "./session/utility/signal";
import { InitEasyRtc } from "./perload";

export async function Main (): Promise<express.Express>
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
    ScheduleClearToken();

    // insert new users for test
    await UserTestAccount(connection);

    // Listen on port 3000
    const webServer=  app.listen(3000);

    const socketServer = io.listen(webServer);

    // Start EasyRTC server
    InitEasyRtc(app, easyrtc, socketServer);

    const signal = Signal.Unique();
    signal.Option = {
        secret: "MilkRTC",
        minTimeoutMillisecondConst: 20000,
        timeoutMillisecondConst: 20000,
    }

    return app;
}


if(process.env.NODE_ENV !== "test")
{
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    Main();
}
