import { LoginByPassword } from "../session/login/LoginByPassword";
import { IsFail } from "../session/utility/BassMessage";
import { GetFriendsList } from "../session/friend/GetFriendsList";
import { Signal } from "../session/utility/signal";
import { InsertOffOnlineTextMessageRecordPerson } from "../controller/utility/offOnlineMessageRecord";

export function InitEasyRtc (app: any, easyrtc: any, socketServer: any): void
{
    easyrtc.listen(app, socketServer, null,
        function (_err: any, rtcRef: { events: { on: (arg0: string, arg1: (appObj: any, creatorConnectionObj: any, roomName: any, roomOptions: any, callback: any) => void) => void } })
        {
            console.log("Initiated");

            rtcRef.events.on("roomCreate", function (appObj: { events: { defaultListeners: { roomCreate: (arg0: any, arg1: any, arg2: any, arg3: any, arg4: any) => void } } }, creatorConnectionObj: any, roomName: string, roomOptions: any, callback: any)
            {
                console.log("roomCreate fired! Trying to create: " + roomName);

                appObj.events.defaultListeners.roomCreate(appObj, creatorConnectionObj, roomName, roomOptions, callback);
            });
        });
    
    easyrtc.on("generatePeoples", async function (connectionObj, id, next)
    {
        const getFriendsList = new GetFriendsList(true);
        const friendListDate = await getFriendsList.Run({ body: { id }});

        if(IsFail(friendListDate)) { next(true); return; }
        console.log(friendListDate)
        connectionObj.CreatePeopleList((friendListDate as unknown as any).data);
        next(null);
    });

    easyrtc.on("authenticate", async function (socket, easyrtcid, appName, username, credential, easyrtcAuthMessage, next)
    {
        const cc = { body : {id: username, password: credential.password as string}};
        const loginByPassword = new LoginByPassword;
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        const result = await loginByPassword.Run(cc);
        if(IsFail(result)) 
        {
            next(true);
            return;
        }
        next(null);
    });

    easyrtc.on("captureToken", function (connectionObj, id, next)
    {
        const signal = Signal.Unique();
        const token = signal.Create(id as string);
        next(null, token);
    });

    interface IMsgInterface
    {
        msgData: string;
        msgType: string;
        targetEasyrtcid: string;
        targetRoom: string;
    }

    easyrtc.on("emitCustomMsg", async function (connectionObj, msg, next)
    {
        const id: number = connectionObj.getEasyrtcid();
        const messageInfo = msg as IMsgInterface;
        await InsertOffOnlineTextMessageRecordPerson(id, messageInfo.targetEasyrtcid, messageInfo.msgData);
        next(null);
    });
}