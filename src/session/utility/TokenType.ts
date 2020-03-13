import { IloginBase } from "../type/request/IloginByPassword";

type timestamp = number;

export type IloginInfo = IloginBase

export interface ItokenStruct<T>
{
    token_data: T;
    created_time: timestamp /* timestamp */;
    effective_time: timestamp /*timestamp*/;
}

export interface IdecodeTokenStruct<T>
{
    token_info: ItokenStruct<T>;
    signature: string;
    checkedsignature: string;
}
