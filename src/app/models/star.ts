import { Territory } from './territory';
import { Lane } from './lane';
import { CivilianFleet } from './civilianFleet';

export class Star {
    name: string;
    thumbnail: string;

    // hitbox coords
    xStart: number;
    yStart: number;
    xEnd: number;
    yEnd: number;

    // proper coords
    x: number;
    y: number;

    // for convenience's sake, the capital should always be the first territory in the array
    territories: Territory[] = [];
    lanes: Lane[] = [];

    nodesPresent: number;

    civilianFleets: CivilianFleet[];
}
