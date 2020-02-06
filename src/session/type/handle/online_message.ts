export interface login_message
{
    status:  1 | 0; /*1: success, 0: other */
    message: "login success" | "login fail";
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    token?: any;
}

export interface logout_message
{
    status:  1 | 0; /*1: success, 0: other */
    message: "logout success"
    | "invail operator"
    | "Missing necessary request message"
    | "invail token";
}