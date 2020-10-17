import { Territory } from './territory';
import { History } from './history';
import { Lane } from './lane';

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

    territories: Territory[] = [];
    lanes: Lane[] = [];
}
