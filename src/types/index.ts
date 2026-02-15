export interface StatusHistory {
    id: number;
    borrowingId: number;
    status: string;
    changedAt: string;
}

export interface Room {
    id: number;
    name: string;
    capacity: number;
    facility: string;
}

export interface Borrowing {
    id: number;
    roomId: number;
    borrowerName: string;
    borrowDate: string;
    returnDate: string;
    purpose: string;
    status: string;
    room?: Room;
    statusHistories?: StatusHistory[];
}