import {UnregisteredClient} from "./unregisteredClient";

export class Advertisement {

  public title: string;
  public type: string;
  public description: string;
  public cost: number;
  public countRoom: number;
  public floorNumber: number;
  public isBargain: boolean;
  public clientInfo: UnregisteredClient = new UnregisteredClient();

}
