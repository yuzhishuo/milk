
type timestamp = number;

export interface login_info
{
    unique: string;
}

export interface token_struct<T>
{
    token_data: T;
    created_time: timestamp /* timestamp */;
    effective_time: timestamp /*timestamp*/;
}

export interface decode_token_struct<T>
{
    token_info: token_struct<T>;
    signature: string;
    checkedsignature: string;
}
