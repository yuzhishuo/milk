/* eslint-disable @typescript-eslint/no-explicit-any */
import * as  Core from '@alicloud/pop-core';

import { sms_id } from './SMS_verification';
import { ExternalInterface, } from './ExternalInterface';
import { Request, Response, NextFunction } from 'express';
import { IBasicMessageCarryDataInterface, BasicErrorInterface, ITrouble, ServiceErrorMessage } from './BassMessage';

const client = new Core(sms_id);
const params = {
    "RegionId": "cn-hangzhou",
    "PhoneNumbers": "18255460750",
    "SignName": "Milk",
    "TemplateCode": "SMS_183261123",
    "TemplateParam": "{code: 521}",
}
interface option_params
{
    "RegionId": string;
    "PhoneNumbers": string;
    "SignName": string;
    "TemplateCode": string;
    "TemplateParam": string;
}
interface option
{
    SignName?: string;
    TemplateParam?: string;
    SmsUpExtendCode?: string;
    OutId?: string;
}

type verification_type = "verification" | "";
interface SmsMapKey
{
    id: string;
    type: verification_type;
}
const tellphone_code = new Map<SmsMapKey, {code: string; register_time: number}>();

function gen4number (): string
{
    const t1 = Math.ceil((Math.random() * 10)).toString();
    const t2 = Math.ceil((Math.random() * 10)).toString();
    const t3 = Math.ceil((Math.random() * 10)).toString();
    const t4 = Math.ceil((Math.random() * 10)).toString();

    return `${t1}${t2}${t3}${t4}`;
}


export class Sms extends ExternalInterface<IBasicMessageCarryDataInterface>
{
    public client = new Core(sms_id);
    async Verify (request: Request): Promise<void>
    {
        if("telephone_number" in request?.body)
        {
            return;
        }
        return Promise.reject({status: 0, message: "invail request body" } as BasicErrorInterface);
    }
    public async Process (request: Request): Promise<ITrouble<IBasicMessageCarryDataInterface>>
    {
        const code: string = gen4number();
        const sms_request = {
            PhoneNumbers: request.body.telephone_number,
            RegionId: "cn-hangzhou",
            SignName: "Milk",
            TemplateParam: `{code: ${code}}`,
            TemplateCode: "SMS_183261123",
        };

        tellphone_code.set({id: request.body.telephone_number, type: "verification"}, {code: code, register_time: Date.now()});

        try
        {
            await this.client.request('SendSms', sms_request, {
                method: 'POST',
            });
        }
        catch
        {
            return  {status: "solve", data: {status: 0, message: "service isn't able"} as BasicErrorInterface<ServiceErrorMessage>};
        }

        return { status: "solve", data: {status: 0, message: "already sent"}}
    }

}


export function verification ()
{
    return function (_target: any, _propertyKey: string, descriptor: TypedPropertyDescriptor<Function>): any
    {
        const raw = descriptor.value;
        descriptor.value = async function (...arg: any): Promise<any>
        {
            const result = raw.apply(this, arg);
            if (result.status == "fail")
            {
                return result.data;
            }

            const code: string = gen4number();
            Object.defineProperties(result.data, {
                RegionId: {
                    value: "cn-hangzhou",
                    enumerable: true,
                },
                SignName:
                {
                    value: "Milk",
                    enumerable: true,
                },
                TemplateParam:
                {
                    value: `{code: ${code}}`,
                    enumerable: true,
                },
                TemplateCode:
                {
                    value: "SMS_183261123",
                    enumerable: true,
                },
            });

            tellphone_code.set(result.data.data, {code: code, register_time: Date.now()});

            try
            {
                await client.request('SendSms', result.data, {
                    method: 'POST',
                });
            }
            catch
            {
                return {
                    status: 0,
                    messsage: "sms service Not available",
                };
            }

            return result;
        }
    };
}

export function Check (key: SmsMapKey, code: string ): boolean
{
    for(const [innerkey, value] of tellphone_code)
    {
        if(innerkey.id === key.id && innerkey.type === key.type)
        {
            return value.code === code;
        }
    }
    return false;
}

function Timer (): void
{
    const current_time = Date.now();
    for (const [key, value] of tellphone_code)
    {
        if(current_time - value.register_time > 1000 * 60 * 5)
        {
            tellphone_code.delete(key);
        }
    }
}