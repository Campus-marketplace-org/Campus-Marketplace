export interface Message {
    id: number;
    fromUsername: string;
    toUsername: string;
    timestamp: string; // ISO string from LocalDateTime
    content: string;
}