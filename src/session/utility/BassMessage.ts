/* eslint-disable @typescript-eslint/no-explicit-any */

export type BaseErrorMessage = "invail request body" | "operator fail" | "unkonw operator";
export type IncreaseErrorMessage = BaseErrorMessage | "addition fail";
export type DeleteErrorMessage = BaseErrorMessage | "delete fail";
export type UpdateErrorMessage = BaseErrorMessage | "update fail";
export type FindErrorMessage = BaseErrorMessage | "Find fail" | "can't find this user";
export type ServiceErrorMessage = BaseErrorMessage | "service isn't able";

// custom message string



export interface IBasicMessageInterface<T extends string = string>
{
    status: number;
    message: T;
    next?: unknown;
}

export interface IBasicMessageCarryDataInterface<Y= any, T extends string = string> extends IBasicMessageInterface<T>
{
    data?: Y;
}

export type BasicErrorInterface<T extends string =
IncreaseErrorMessage |
DeleteErrorMessage |
UpdateErrorMessage |
FindErrorMessage |
ServiceErrorMessage> = IBasicMessageInterface<T>

export interface ITrouble<T>
{
    status: "solve" | "fail" | "normal";
    data?: T;
    message?: string;
}

/**
 * Create a Solve.
 *
 * @param inject  Trouble's message
 * @param message Trouble's data
 */
export function SolveConstructor<T extends IBasicMessageInterface> (inject?: T, message?: string): ITrouble<T>
{
    return {status: "solve", data: inject, message: message, };
}

export function FailConstructor<T extends IBasicMessageInterface> (message?: string, inject?: T): ITrouble<T>
{
    return {status: "fail", data: inject, message: message, };
}

export function NormalConstructor<T extends IBasicMessageInterface> (message?: string, inject?: T): ITrouble<T>
{
    return {status: "normal", data: inject, message: message, };
}