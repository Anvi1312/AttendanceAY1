export interface Subject {
  name: string;
  sessions: number;
  time: string;
}

export const WEEKLY_SCHEDULE: Record<string, Subject[]> = {
  Monday: [
    { name: 'DIVP', sessions: 1, time: '01:00 – 02:00 PM' },
    { name: 'SOOAD', sessions: 1, time: '02:00 – 03:00 PM' },
    { name: 'AI', sessions: 1, time: '03:00 – 04:00 PM' }
  ],
  Tuesday: [
    { name: 'AI', sessions: 1, time: '02:00 – 03:00 PM' },
    { name: 'PS', sessions: 1, time: '03:00 – 04:00 PM' },
    { name: 'DIVP Lab', sessions: 2, time: '04:15 – 06:15 PM' }
  ],
  Wednesday: [
    { name: 'DIVP', sessions: 1, time: '02:00 – 03:00 PM' },
    { name: 'AI', sessions: 1, time: '03:00 – 04:00 PM' },
    { name: 'PPL Lab', sessions: 2, time: '04:15 – 06:15 PM' }
  ],
  Thursday: [
    { name: 'DIVP', sessions: 1, time: '01:00 – 02:00 PM' },
    { name: 'PS', sessions: 1, time: '02:00 – 03:00 PM' },
    { name: 'CD', sessions: 1, time: '03:00 – 04:00 PM' }
  ],
  Friday: [
    { name: 'DIVP', sessions: 1, time: '01:00 – 02:00 PM' },
    { name: 'SOOAD', sessions: 1, time: '02:00 – 03:00 PM' },
    { name: 'CD', sessions: 1, time: '03:00 – 04:00 PM' },
    { name: 'PPL Lab', sessions: 2, time: '04:15 – 06:15 PM' }
  ],
  Saturday: [
    { name: 'SOOAD', sessions: 1, time: '01:00 – 02:00 PM' },
    { name: 'PS', sessions: 1, time: '02:00 – 03:00 PM' },
    { name: 'CD', sessions: 1, time: '03:00 – 04:00 PM' },
    { name: 'DIVP Lab', sessions: 2, time: '04:15 – 06:15 PM' }
  ]
};

export const ALL_SUBJECTS = Array.from(
  new Set(
    Object.values(WEEKLY_SCHEDULE)
      .flat()
      .map(subject => subject.name)
  )
);

export const SUBJECT_COLORS: Record<string, string> = {
  'DIVP': '#3B82F6',
  'SOOAD': '#10B981',
  'AI': '#8B5CF6',
  'PS': '#F59E0B',
  'CD': '#EF4444',
  'PPL Lab': '#06B6D4',
  'DIVP Lab': '#84CC16'
};