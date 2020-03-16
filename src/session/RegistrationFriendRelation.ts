import { ExternalInterface, BasicMessageTakeawayDataInterface, Trouble } from "./utility/ExternalInterface";

class RegistrationFriendRelation extends ExternalInterface<BasicMessageTakeawayDataInterface>
{
    async Verify (): Promise<void>
    {
        throw new Error("Method not implemented.");
    }
    async Process (): Promise<Trouble<BasicMessageTakeawayDataInterface>>
    {
        throw new Error("Method not implemented.");
    }
}

InjectionRouter({ method: "post", route: "/RegistrationFriendRelation", controller: new RegistrationFriendRelation, });