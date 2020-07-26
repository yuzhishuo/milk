/* eslint-disable @typescript-eslint/no-unnecessary-condition */
import * as fs from "fs";

enum log_level { trace, debug, info, warn, error, fatal }

interface format_option
{
    status: boolean;
    outfile: string | null;
    isshow: {
        name: boolean;
        time: boolean;
        filename: boolean;
        messagetype: boolean;
    };
}

enum log_out_type
    {
    name,
    time,
    filename,
    messagetype,
}
export class Log5
{
    private static readonly default_option: format_option = {
        status: true,
        outfile: null,
        isshow: {
            name: true,
            time: true,
            filename: true,
            messagetype: true,
        }
    }

    public constructor (private name: string = "default loger", private option: format_option = Log5.default_option)
    {}

    public trace (message: string, option?: format_option): void
    {
        this.option = option ?? this.option;
        if(this.option.status)
        {

            const message_last = `${this.is_show(log_out_type.messagetype, '[TRACE]')} : ${this.is_show(log_out_type.messagetype, message)} ${this.is_show(log_out_type.messagetype, new Date().toString())}`;
            const out = this.option.outfile ?? console;
            if(typeof out  === "string")
            {

                fs.open(out, 'w', (err: NodeJS.ErrnoException, fd: number): void =>
                {
                    if(err)
                    {
                        console.log(err);
                    }
                    fs.writeFile(fd, message_last, (_err)=>
                    {
                        console.log(_err);
                    });
                })
                return;
            }
            console.info(message_last);
        }
    }

    fatal (message: string, option?: format_option, callback?: Function, calluser?: any | null, ...arg: any): void
    {
        callback.apply(calluser, arg);
    }

    format_control (option: format_option): void
    {
        this.option = option;
    }

    private is_show (lot: log_out_type, str: string): string
    {
        switch(lot)
        {
            case log_out_type.filename:
                return this.option.isshow.filename ?? Log5.default_option.isshow.filename ? str: '';
            case log_out_type.messagetype:
                return this.option.isshow.messagetype ?? Log5.default_option.isshow.filename ? str: '';
            case log_out_type.name:
                return this.option.isshow.name ?? Log5.default_option.isshow.name ? str: '';
            case log_out_type.time:
                return this.option.isshow.time ?? Log5.default_option.isshow.time ? str: '';
            default:
                return '';
        }
        return '';
    }

}

export const loger5 = new Log5();