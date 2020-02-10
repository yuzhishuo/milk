import { user_non_essential_info } from "./user_base_info";

export interface register_info_by_email extends user_non_essential_info
{
    user_email: string;
    nickname: string;
    password: string;
}

export interface register_info_by_telephone extends user_non_essential_info
{
    telephone_number: number;
}