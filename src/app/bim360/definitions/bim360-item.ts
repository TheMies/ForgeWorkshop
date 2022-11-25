export interface IBim360Item {
  name: string;
  id: string;
  type: string;
  parentId: string;
  hubId: string;
  projectId: string;
  parent?: Bim360Item;
  isLoaded: boolean;
  derivativeId: string;
}

export class Bim360Item implements IBim360Item {
  constructor(
    public name: string = "",
    public id: string = "",
    public type: string = "",
    public parentId: string = "",
    public hubId: string = "",
    public projectId: string = "",
    public parent: Bim360Item | undefined,
    public isLoaded: boolean = false,
    public derivativeId: string = "") { }
}
