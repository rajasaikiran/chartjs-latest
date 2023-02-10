export interface meetingEvent {
    end?: {
        dateTime: String,
        timeZone: String
    },
    isAllDay: Boolean,
    showAs: String,
    start?: {
        dateTime: String,
        timeZone: String
    },
}
export interface offEvent {
    userEmail: String,
    userName: String,
    oofEvents?: meetingEvent[]
}

export interface graphRecord {
    x: string[];
    y: String;
}