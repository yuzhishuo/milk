import * as  schedule from "node-schedule"
import {token} from "../token"



export function schedule_clear_token(){
    schedule.scheduleJob(`* /${token.timeout_millisecond_const / 60 /60 / 1000} * * * *`, function()
    {
        let tokenmanger = token.make_token();
        console.log(tokenmanger.clear_timeout_token());
    }); 
}
