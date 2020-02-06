export interface user_non_essential_info
{
    gender?: 1 | 0 | -1; /*-1 : unknow, 0 : male, 1 : female*/
    birthday?: Date;
    birthplace?: string;
    signature?: string;
}