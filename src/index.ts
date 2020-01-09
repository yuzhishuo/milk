import "reflect-metadata";
import {createConnection} from "typeorm";
import * as express from "express";
import * as bodyParser from "body-parser";
import {Request, Response } from "express";
import {Routes} from "./routes";


import { test_data_switch } from "./unit_test/data/data_test_switch";

import {user_test_account} from "./unit_test/data/user_test_account";

import { schedule_clear_token } from "./session/utility/timer";

createConnection().then(async connection => {

    // create express app
    const app = express();
    app.use(bodyParser.json());

    // register express routes from defined application routes
    Routes.forEach(route => {
        (app as any)[route.method](route.route, (req: Request, res: Response, next: Function) => {
            const result = (new (route.controller as any))[route.action](req, res, next);
            if (result instanceof Promise) {
                result.then(result => result !== null && result !== undefined ? res.send(result) : undefined);

            } else if (result !== null && result !== undefined) {
                res.json(result);
            }
        });
    });

    // setup express app here
    // ...

    // start express server
    app.listen(3000);

    //!!!important timer
    schedule_clear_token();


    // insert new users for test
    await user_test_account(connection);

    console.log("Express server has started on port 3000.");

}).catch(error => console.log(error));
