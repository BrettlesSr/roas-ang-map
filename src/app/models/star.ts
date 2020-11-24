import { Territory } from './territory';
import { Lane } from './lane';
import { CivilianFleet } from './civilianFleet';

export class Star {
    key: string;

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

    nodesPresent: number;
}
