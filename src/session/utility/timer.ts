import * as  schedule from "node-schedule"
import { Token } from "./token"

// Will be removed by custom timer in the near future
export function ScheduleClearToken (): void
{
    const tokenmanger = Token.make_token();
    schedule.scheduleJob({second: 3}, function ()
    {
        console.log(tokenmanger.clear_timeout_token());
    });
}
