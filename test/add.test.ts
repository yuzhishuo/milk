import {describe}  from 'mocha';
import * as should from 'should';

function add (x: number, y: number): number
{
    return x + y;
}

describe('随即生成数组测试', function () {
    it('用例1', function () {
        const arr = add(10, 100)
        should(arr).be.equal(110)
    })
})