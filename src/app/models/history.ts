import { Star } from './star';
import { Territory } from './territory';

export class History {
    name: string;
    description: string;
    thumbnail: string;
    threadlink: string;
    date: number;

    location: Star;
    territoriesInvolved: Territory[] = [];
    politiesInvolved: Territory[] = [];
}
