export interface IloginBase
{
    id: string;
}

export interface IloginByPassword extends IloginBase
{
    password: string;
}

export interface IloginByCode extends IloginBase
{
    code: string;
}