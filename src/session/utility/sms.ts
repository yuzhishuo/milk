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

const tellphone_code = new Map<string, string>();

function gen4number (): string
{
    const t1 = Math.random() * 10;
    const t2 = Math.random() * 10;
    const t3 = Math.random() * 10;
    const t4 = Math.random() * 10;
    // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
    return t1.toString() + t2 + t3 + t4;
}
export function verification (value?: option)
{
    return function (target: any, propertyKey: string, descriptor: TypedPropertyDescriptor<Function>)
    {
        const raw = descriptor.value;
        descriptor.value = async function (...arg: any): Promise<any>
        {
            const requestOption = raw.apply(this, arg);

            const code: string = gen4number();
            Object.defineProperties(requestOption, {
                "RegionId": {
                    value: "cn-hangzhou",
                    writable: true
                }, "SignName":
                {
                    value: value?.SignName ?? "Milk",
                    writable: true,
                },
                TemplateParam:
                {
                    value: `{code: '${code}'}`,
                    writable: true,
                }
            });
            tellphone_code.set(requestOption.PhoneNumbers, code);
            return await client.request('SendSms', params, {
                method: 'POST'
            });
        }
    };
}