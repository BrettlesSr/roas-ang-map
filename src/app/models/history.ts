export class History {
    name: string;
    description: string;
    thumbnail: string;
    threadlink: string;
    date: number;

    location: string; // must be a star name
    territoriesInvolved: string[] = []; // must be a list of territory names
    politiesInvolved: string[] = []; // must be a list of polity names
}
