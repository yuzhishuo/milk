/* eslint-disable @typescript-eslint/no-explicit-any */

export type BaseErrorMessage = "invail request body" | "operator fail" | "unkonw operator";
export type IncreaseErrorMessage = BaseErrorMessage | "addition fail";
export type DeleteErrorMessage = BaseErrorMessage | "delete fail";
export type UpdateErrorMessage = BaseErrorMessage | "update fail";
export type FindErrorMessage = BaseErrorMessage | "Find fail";
export type ServiceErrorMessage = BaseErrorMessage | "service isn't able";

export interface BasicMessageInterface<T extends string = string>
{
    status: number;
    message: T;
}

export interface BasicMessageTakeawayDataInterface<Y= any, T extends string = string> extends BasicMessageInterface<T>
{
    data?: Y;
}

export type BasicErrorInterface<T extends string = BaseErrorMessage> = BasicMessageInterface<T>

export interface Trouble<T>
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
export function SolveConstructor<T> (inject?: T, message?: string): Trouble<T>
{
    return {status: "solve", data: inject, message: message, };
}

export function FailConstructor<T> (message?: string, inject?: T): Trouble<T>
{
    return {status: "fail", data: inject, message: message, };
}

export function NormalConstructor<T> (message?: string, inject?: T): Trouble<T>
{
    return {status: "normal", data: inject, message: message, };
}