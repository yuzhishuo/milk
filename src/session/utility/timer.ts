import * as  schedule from "node-schedule"
import { Signal } from "./signal";

// Will be removed by custom timer in the near future
export function ScheduleClearToken (): void
{
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const _signal = Signal.Unique();
    schedule.scheduleJob({second: 3000}, function ()
    {
    });
}
