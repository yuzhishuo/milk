export interface register_message
{
    status:  1 | 0; /*1: success, 0: other */
    message: "register success" | "register fail";
}