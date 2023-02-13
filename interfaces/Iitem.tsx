export default interface Iitem {
    id: string;
    name: string;
    place: string;
    count: number;
    hasDueDate: boolean;
    date: number;
    deleted: boolean;
    created_at: string;
    datemodified: number;
    toUpdate: false;
}