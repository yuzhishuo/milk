/* eslint-disable @typescript-eslint/no-require-imports */
/* eslint-disable @typescript-eslint/no-var-requires */

import * as fs from "fs";
import * as path  from "path";

interface IIndividualWord
{
    linenumber: number;
    position: number;
    type: "annotation" | "other";
    source: string;
}

export class RouterLoader
{
    private readonly configfilename = ".router";
    private readonly rootdirname = "../../";
    private readonly pathname: string;
    private readonly filedata: string;
    private readonly filedataarray: string[];
    private IndividualWordArray: IIndividualWord[] = new Array<IIndividualWord>();
    public constructor ()
    {
        this.pathname = path.join(__dirname, `${this.rootdirname}${this.configfilename}`);

        this.filedata = fs.readFileSync(this.pathname, "utf-8");
        this.filedataarray = this.filedata.split("\r\n");
    }
    private Analysis (): void
    {
        this.filedataarray.forEach((linestring: string, index: number,) =>
        {
            let CurrentPosition =-1;
            const word: IIndividualWord = {linenumber: index, position:0, type:"other", source: ""};

            while(true)
            {
                CurrentPosition++;
                if(CurrentPosition > linestring.length)
                {
                    break;
                }

                if(linestring[CurrentPosition] === " " || linestring[CurrentPosition]=== "\t")
                {
                    continue;
                }

                if(linestring[CurrentPosition] === "#")
                {
                    word.type = "annotation";
                    word.position = CurrentPosition;
                    word.source = "";
                    for (; CurrentPosition < linestring.length; CurrentPosition++)
                    {
                        const element = linestring[CurrentPosition];
                        word.source +=  element;
                    }
                    this.IndividualWordArray.push(word);

                    break;
                }
                else
                {
                    word.type = "other";
                    word.position = CurrentPosition;
                    word.source = "";
                    for (; CurrentPosition < linestring.length; CurrentPosition++)
                    {
                        if(linestring[CurrentPosition] === " " || linestring[CurrentPosition]=== "\t")
                        {
                            CurrentPosition--;
                            break;
                        }

                        const element = linestring[CurrentPosition];
                        word.source +=  element;
                    }

                    this.IndividualWordArray.push(JSON.parse(JSON.stringify(word)));
                }

                if(CurrentPosition < linestring.length)
                {
                    continue;
                }
                break;
            }
        })
    }

    public rquire (): void
    {
        this.Analysis();
        console.log("router loder ...");

        for(const word of this.IndividualWordArray)
        {
            let include = true;
            if(word.type !== "annotation")
            {
                if(word.source === "exclude") include = false;
                if(include && word.source !== "exclude" && word.source !== "include")
                {
                    try
                    {
                        require(`${this.rootdirname}${word.source}`);
                        console.log(`${this.rootdirname}${word.source}`, "request success");
                    }
                    catch (error)
                    {
                        console.log(error);
                    }
                }
            }
        }
    }
}