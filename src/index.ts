import { createConnection } from "typeorm";
import * as express from "express";
import * as bodyParser from "body-parser";
import { RoutersManagement as routersManagement } from "./routes/RoutersManagement";

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

    // start express server
    app.listen(3000);

    //!!!important timer
    schedule_clear_token();


    // insert new users for test
    await user_test_account(connection);

    console.log("Milk server has started on port 3000.");

}).catch(error => console.log(error));