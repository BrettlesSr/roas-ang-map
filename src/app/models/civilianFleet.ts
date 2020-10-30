import { CivilianFleetType } from '../enums/civilianFleetType';

export class CivilianFleet {
    owner: string;
    quantity: number;
    type: CivilianFleetType;
    mission: string;
}
