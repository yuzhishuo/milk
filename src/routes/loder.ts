/* eslint-disable @typescript-eslint/no-require-imports */
/* eslint-disable @typescript-eslint/no-var-requires */
import * as Express from "express";
import * as fs from "fs";
import path = require("path");

const configfilename = ".router";
const rootdirname = "../../";

const pathname = path.join(__dirname, `${rootdirname}${configfilename}`);

const data = fs.readFileSync(pathname, "utf-8");


const dataarray = data.split('\r\n');

interface IndividualWord
{
    linenumber: number;
    position: number;
    type: "annotation" | "other";
    source: string;
}

const IndividualWordArray: IndividualWord[] = new Array<IndividualWord>();
dataarray.forEach((linestring: string, index: number, _self: string[]) =>
{
    let CurrentPosition =-1;
    const word: IndividualWord = {linenumber: index, position:0, type:"other", source: ""};

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
            IndividualWordArray.push(word);

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

            IndividualWordArray.push(JSON.parse(JSON.stringify(word)));
        }

        if(CurrentPosition < linestring.length)
        {
            continue;
        }
        break;
    }
})

for(const word of IndividualWordArray)
{
    let include = true;
    if(word.type !== "annotation")
    {
        if(word.source === "exclude") include = false;
        if(include && word.source !== "exclude" && word.source !== "include")
        {
            require(word.source);
        }
    }
}

const router = Express.Router();
interface RoterInterface
{
    method: "get" | "post";
    route: string;
    controller: object;
    action: string;
}

module.exports = router;