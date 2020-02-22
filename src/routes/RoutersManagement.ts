import { Request, Response, Router, RouterOptions, Express} from "express";
interface RoterInterface
{
    method: "get" | "post" | "use";
    route: string;
    controller: object;
    action?: string | "Run";    /* default: "Run" */
    middleware?: string;
}

class PrivateRoutersManagement
{
    public defaultrouter = Router();
    private router: Map<string, Router> = new Map<string, Router>()
    public constructor ()
    {

    }
    public MiddlewareRouter (url: string, router: Router): void
    {
        if(this.router.get(url) !== undefined)
        {
            this.router.get(url).use(router);
        }
        else
        {
            this.router.set(url, router);
        }

    }
    SetRouter (app: Express): void
    {
        app.use(this.defaultrouter);
        this.router.forEach((value: Router, key: string,) =>
        {
            app.use(key, value);
        })
    }
}

export const RoutersManagement = new PrivateRoutersManagement();

export function InjectionRouter1 (params: RoterInterface, expressrouterconfig?: RouterOptions): void
{
    if (params.middleware  === undefined)
    {
        (RoutersManagement.defaultrouter[params.method] as Function)(params.route,
            (req: Request, res: Response, next: Function) =>
            {
                const result = (new (params.controller as any))[params.action ?? "Run"](req, res, next);
                if (result instanceof Promise)
                {
                    // eslint-disable-next-line @typescript-eslint/no-floating-promises
                    result.then(result => result !== null && result !== undefined ? res.send(result) : undefined);

                }
                else if (result !== null && result !== undefined)
                {
                    res.json(result);
                }
            })
    }
    else
    {
        const newrouter = Router(expressrouterconfig);
        (newrouter[params.method] as Function)(params.route,
            (req: Express.Request, res: Response, next: Function) =>
            {
                const result = (new (params.controller as any))[params.action ?? "Run"](req, res, next);
                if (result instanceof Promise)
                {
                    // eslint-disable-next-line @typescript-eslint/no-floating-promises
                    result.then(result => result !== null && result !== undefined ? res.send(result) : undefined);

                }
                else if (result !== null && result !== undefined)
                {
                    res.json(result);
                }
            })
        RoutersManagement.MiddlewareRouter(params.middleware, newrouter);
    }
}


export class Chat
{
    Run (): void
    {
        console.log("Chat: RUN");
    }
}

InjectionRouter1({method: "post", route: "/user/tt", controller: Chat})

InjectionRouter1({method: "post", route: "/user/tt", controller: Chat, middleware : "/admin"})