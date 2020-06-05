interface IOwnersUser
{
    id: string;
    owner?: boolean;
}


interface IRoom
{
    [propName: string]: IOwnersUser[];
}

interface IPublish
{
    update: (id: string) => ReadonlyMap<string, IOwnersUser[]>;
}


interface IBaseRoom
{
    room: ReadonlyMap<string, IOwnersUser[]>;
    id: string;
}

class Room
{
    private room = new Map<string, IBaseRoom>();
    constructor (private rp: RoomPublish)
    {
    }

    JoinRoom (id: string): void
    {
        this.rp.SetListen(id);
        this.room[id]= {id: id, room: this.rp.update(id)};
    }
}

class RoomPublish implements IPublish
{
    private onlineUserList= new  Array<string>();
    private room: Room;
    
    SetListen (id: string): void
    {
        this.onlineUserList.push(id);
    }
    
    SetAcceptor (c: Room): void
    {
        this.room = c;
    }

    // must =>
    public update = (id: string): ReadonlyMap<string, IOwnersUser[]> =>
    {
        // 连接到数据库
        // 将格式处理成 IOwnersUser[] 格式
        const t1= new Map<string, IOwnersUser[]>();

        return t1;
    }
}