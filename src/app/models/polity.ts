import { PolityType } from '../enums/polityType';

export class Polity {
    key: string;

    name: string;
    description: string;
    thumbnail: string;
    threadlink: string;
    gdp: number;
    type: PolityType;

    traits: string[];
    flaws: string[];
    colonyThreadlink: string;
    oobThreadlink: string;
}
