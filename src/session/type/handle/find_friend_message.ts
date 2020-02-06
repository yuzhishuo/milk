export interface find_friend_message
{
    status: 0 | 1;
    message: "addition fail"|
    "addition success"|
    "invail token"|
    "invail variable"|
    "unfind user"|
    "insert fail";
    token?: string;
}