/* eslint-disable @typescript-eslint/no-require-imports */
/* eslint-disable @typescript-eslint/no-var-requires */
import * as Express from "express"
import * as fs  from "fs";

const router = Express.Router();
const files = fs.readdirSync(__dirname);

files
    .filter(function (file, index)
    {
        return file !== 'loader.js';
    })
    .forEach(function (file, index)
    {
        const route = require('./' + file.replace('.js', ''));
        if(file === 'index.js')
        {
            router.use('/', route);
        }
        else
        {
            router.use('/api/' + file.replace('.js', ''), route);
        }
    });

module.exports = router;