interface body_status_message
{
    status: 0;
    message: "does not contain the request body" | "missing request parameters";
}


export function express_body_verification<T>(verification_function:Function)
{
    return function (target: any, propertyKey: string, descriptor: TypedPropertyDescriptor<Function>)
    {
        let raw = descriptor.value;
        descriptor.value = async function (...args: any[]) : Promise<body_status_message | T>
        {
            let body = args?.[0]?.body;
            if(!body)
            {
                return {
                    status: 0,
                    message: "does not contain the request body",
                }
            }

            let verification_value = body;
            if(!verification_function(verification_value))
            {
                return {
                    status: 0,
                    message: "missing request parameters",
                }
            }
            return await raw.apply(this, args);
        }
    }
}

