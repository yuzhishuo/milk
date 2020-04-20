import * as  schedule from "node-schedule"
import { Token } from "./token"

// Will be removed by custom timer in the near future
export function schedule_clear_token (): void
{
    schedule.scheduleJob({second: 3}, function ()
    {
        const tokenmanger = Token.make_token();
        console.log(tokenmanger.clear_timeout_token());
    });
}
