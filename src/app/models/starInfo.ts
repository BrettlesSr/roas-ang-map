import { Factoid } from './factoid';
import { HistoryFactoid } from './historyFactoid';

export interface StarInfo {
    name: string;
    thumbnail: string;

    // data
    polities: Factoid[];
    unTaskforces: Factoid[];
    history: HistoryFactoid[];
    linkedStars: string[];

    // hitbox coords
    xStart: number;
    yStart: number;
    xEnd: number;
    yEnd: number;

    // proper coords
    x: number;
    y: number;
}
