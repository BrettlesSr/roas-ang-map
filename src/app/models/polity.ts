import { Territory } from './territory';
import { PolityType } from '../enums/polityType';

export class Polity {
    key: string;

    name: string;
    description: string;
    thumbnail: string;
    threadlink: string;
    gdp: number;
    type: PolityType;
}
