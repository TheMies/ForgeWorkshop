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

export class Bim360Item implements IBim360Item{
    name: string = "";
    id: string = "";
    type: string = "";
    parentId: string = "";
    hubId: string = "";
    projectId: string = "";
    parent: Bim360Item | undefined;
    isLoaded: boolean = false;
    derivativeId: string = "";
}
