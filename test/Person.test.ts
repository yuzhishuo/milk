process.env.NODE_ENV = "test";

import { describe } from 'mocha';
import * as Should from 'should';
import * as Supertest from 'supertest';
import { Main } from '../src/index';
import { UserInfoController } from '../src/controller/UserInfoController';

import { RandomUser } from './users';
import * as Assert from 'assert';
import { IBasicMessageCarryDataInterface } from '../src/session/utility/BassMessage';

let app;

describe('Person.test', function () {


    before(async function () {
        app = await Main();
        const userInfoController = new UserInfoController;
        const randomUser = new RandomUser;

        for (const user of randomUser.Generator(100)) {
            await userInfoController.Construct(user);
        }
    });

    after(async function(){

        
    })

    describe('POST', function () {
        it('POST /CapturePersonalInformation', function (done) {
            Supertest(app)
                .post('/CapturePersonalInformation')
                .send({
                    "id": Math.floor(Math.random() * 100),
                    "token": "eyJ0b2tlbl9kYXRhIjp7ImlkIjoiMTg2MzA5NzczODgifSwiY3JlYXRlZF90aW1lIjoxNTg0MTYxMTIyNzA4LCJlZmZlY3RpdmVfdGltZSI6NTAwMH0=.pWJpZNFm/rBaWjs+BmuE7fdg3R1TvOB6Q/YQpnE4gOo=",
                    "findMethod": "id"
                })
                .set('Accept', 'application/json')
                .expect(200)
                .expect(function (response) {
                    Assert((response.body as IBasicMessageCarryDataInterface).status === 1);
                    Assert((response.body as IBasicMessageCarryDataInterface).message === "find Success");
                }).end(done);
        });

        it('Post /EditPersonalInformation', function (done) {
            Supertest(app)
                .post('/EditPersonalInformation')
                .send({
                    "id": 22,
                    "findMethod": "id",
                    "token": "eyJ0b2tlbl9kYXRhIjp7ImlkIjoiMTg2MzA5NzczODgifSwiY3JlYXRlZF90aW1lIjoxNTg0MTYxMTIyNzA4LCJlZmZlY3RpdmVfdGltZSI6NTAwMH0=.pWJpZNFm/rBaWjs+BmuE7fdg3R1TvOB6Q/YQpnE4gOo=",
                    "data": {
                    "alias": "yimin",
                    "signature": "最近好吗？有点想你。"
                    }
                })
                .set('Accept', 'application/json')
                .expect(200)
                .expect(function (response) {
                    Assert((response.body as IBasicMessageCarryDataInterface).status === 1);
                }).end(done);
        });
    });
});
