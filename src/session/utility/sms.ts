/* eslint-disable @typescript-eslint/no-explicit-any */
import * as  Core from '@alicloud/pop-core';

import { sms_id } from './SMS_verification';

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

const tellphone_code = new Map<string, {code: string; register_time: number}>();

function gen4number (): string
{
    const t1 = Math.ceil((Math.random() * 10)).toString();
    const t2 = Math.ceil((Math.random() * 10)).toString();
    const t3 = Math.ceil((Math.random() * 10)).toString();
    const t4 = Math.ceil((Math.random() * 10)).toString();

    return `${t1}${t2}${t3}${t4}`;
}
export function verification ()
{
    return function (_target: any, _propertyKey: string, descriptor: TypedPropertyDescriptor<Function>): any
    {
        const raw = descriptor.value;
        descriptor.value = async function (...arg: any): Promise<any>
        {
            const requestOption = raw.apply(this, arg);
            if ("status" in requestOption)
            {
                return requestOption;
            }

            const code: string = gen4number();
            Object.defineProperties(requestOption, {
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

            tellphone_code.set(requestOption.PhoneNumbers, {code: code, register_time: Date.now()});

            try
            {
                await client.request('SendSms', requestOption, {
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

            return {
                status: 0,
                message: "success",
            };
        }
    };
}

function check (check_value: {telephone: string; code: string}): boolean
{

    const get_value: {
        code: string;
        register_time: number;
    } |undefined = tellphone_code.get(check_value.telephone);

    if(get_value === undefined)
    {
        return false;
    }

    return get_value.code === check_value.code;
}

function timer (): void
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