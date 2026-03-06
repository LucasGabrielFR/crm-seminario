
export interface ScalePerson {
    id: string;
    name: string;
    whatsapp: string;
}

export interface ScaleRole {
    id: string;
    name: string;
}

export interface ScaleAssignment {
    roleId: string;
    personId: string;
}

export interface ScaleDay {
    dayLabel: string;
    dayIndex: number;
    assignments: ScaleAssignment[];
}

export interface ScaleWeek {
    weekIndex: number;
    days: ScaleDay[];
}

export interface ScaleSettings {
    durationWeeks: number;
    daysOfWeek: number[]; // 0-6
    personIds: string[];
    roleIds: string[];
}

export interface ScaleSchedule {
    id: string;
    name: string;
    weeks: ScaleWeek[];
    settings: ScaleSettings;
    createdAt: string;
}
