import * as  schedule from "node-schedule"
import { token } from "./token"

// Will be removed by custom timer in the near future
export function schedule_clear_token(): void
{
    schedule.scheduleJob(`* /${token.timeout_millisecond_const / 60 /60 / 1000} * * * *`, function()
    {
        const tokenmanger = token.make_token();
        console.log(tokenmanger.clear_timeout_token());
    });
}
