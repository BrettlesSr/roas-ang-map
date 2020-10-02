import { Factoid } from './factoid';
import { HistoryFactoid } from './historyFactoid';

export interface StarInfo {
    name: string;
    thumbnail: string;
    polities: Factoid[];
    unTaskforces: Factoid[];
    history: HistoryFactoid[];
    xStart: number;
    yStart: number;
    xEnd: number;
    yEnd: number;
}
