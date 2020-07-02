import { InjectionRouter } from "../routes/RoutersManagement"; // main

import { GetFriendsList } from "./friend/GetFriendsList";
InjectionRouter({ method: "post", route: "/GetFriendsList", controller: new GetFriendsList(), });