import { UserInfo } from "../src/entity/UserInfo";


export class RandomUser {
    private GetMoble(): string {
        const prefixArray = new Array("130", "131", "132", "133", "135", "137", "138", "170", "187", "189");
        const i = Math.floor(10 * Math.random());
        let prefix = prefixArray[i];
        for (var j = 0; j < 8; j++) {
            prefix = prefix + String(Math.floor(Math.random() * 10));

            for(const p in this.telephone)
            {
                if(p === prefix)
                {
                    j = -1;
                    prefix = prefixArray[i];
                }
            }
        }
        return prefix;
    }

    private telephone  = new Array<string>();

    private UserInfoInit(userinfo: UserInfo)
    {
        userinfo.user_id = undefined;
        userinfo.telephone_number = this.GetMoble();
        userinfo.alias = "alias";
        userinfo.email = "aoumeior@outlook.com";
        userinfo.nickname = "nickname";
        userinfo.gender = 1;
        userinfo.birthplace = "安徽省 淮南市";
        userinfo.signature = "今昔是何夕";
        userinfo.password = "5a0528323662fd9cfdda9adc3eb85c88";
    }

    public * Generator(num: number)
    {
        const userinfo = new UserInfo;

        for(let i = 0; i < num; i++)
        {
           this.UserInfoInit(userinfo);
            yield userinfo;
        }
        return;
    }
}
