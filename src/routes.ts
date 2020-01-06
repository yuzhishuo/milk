import {UserController} from "./controller/UserController";
import { user_service } from "./session/login";
export const Routes = [{
    method: "get",
    route: "/users",
    controller: UserController,
    action: "all"
}, {
    method: "get",
    route: "/users/:id",
    controller: UserController,
    action: "one"
}, {
    method: "post",
    route: "/users",
    controller: UserController,
    action: "save"
}, {
    method: "delete",
    route: "/users/:id",
    controller: UserController,
    action: "remove"
}, {
    method: "post",
    route: "/user_login/",
    controller: user_service,
    action: "login"
}, {
    method: "post",
    route: "/user_logout",
    controller: user_service,
    action: "logout"
}];
