import { Request, Response, Router, RouterOptions, Express} from "express";
import { RouterLoader } from "./loader"

interface IRoterInterface
{
    method: "get" | "post" | "use";
    route: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    controller: any;
    action?: string | "Run";    /* default: "Run" */
    middleware?: string;
}
class PrivateRoutersManagement
{
    public defaultrouter = Router();
    private router: Map<string, Router> = new Map<string, Router>()
    public constructor (public loader: RouterLoader)
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


export const routersManagement = new PrivateRoutersManagement(new RouterLoader());
export function InjectionRouter (params: IRoterInterface, expressrouterconfig?: RouterOptions): void
{
    if (params.middleware === undefined)
    {
        (RoutersManagement.defaultrouter[params.method] as Function)(params.route,
            (req: Request, res: Response, next: Function) =>
            {
                // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
                const result = (params.controller)[params.action ?? "Run"](req, res, next);
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
                // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
                const result = (new params.controller)[params.action ?? "Run"](req, res, next);
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