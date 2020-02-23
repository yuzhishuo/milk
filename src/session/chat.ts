import { InjectionRouter } from "../routes/RoutersManagement";

class Chat
{
    Run (): void
    {
        console.log("Chat: RUN");
    }
}

InjectionRouter({method: "post", route: "/user/tt", controller: Chat});

InjectionRouter({method: "post", route: "/user/tt", controller: Chat, middleware : "/admin"});