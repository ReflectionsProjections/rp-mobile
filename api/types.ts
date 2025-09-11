export type TierMappedType = 'TIER0' | 'TIER1' | 'TIER2' | 'TIER3';
export type TierType = 'TIER1' | 'TIER2' | 'TIER3' | 'TIER4';
export type IconColorType =
  | 'BLUE'
  | 'RED'
  | 'GREEN'
  | 'YELLOW'
  | 'PINK'
  | 'BLACK'
  | 'PURPLE'
  | 'ORANGE';

export type Attendee = {
  userId: string;
  points: number;
  pointsDay1: number;
  pointsDay2: number;
  pointsDay3: number;
  pointsDay4: number;
  pointsDay5: number;
  hasPriorityMon: boolean;
  hasPriorityTue: boolean;
  hasPriorityWed: boolean;
  hasPriorityThu: boolean;
  hasPriorityFri: boolean;
  hasPrioritySat: boolean;
  hasPrioritySun: boolean;
  currentTier: TierType;
  icon: IconColorType;
  favoriteEvents: string[];
  puzzlesCompleted: string[];
  tags: string[];
};

export type Corporate = {
  name: string;
  email: string;
};

export type DietaryRestrictionStats = {
  none: number;
  dietaryRestrictions: number;
  allergies: number;
  both: number;
  allergyCounts: { [key: string]: number };
  dietaryRestrictionCounts: { [key: string]: number };
};

export type EventType = 'SPEAKER' | 'CORPORATE' | 'SPECIAL' | 'PARTNERS' | 'MEALS' | 'CHECKIN';

export type Event = {
  eventId: string;
  name: string;
  startTime: string;
  endTime: string;
  points: number;
  description: string;
  isVirtual: boolean;
  imageUrl: string;
  location: string;
  isVisible: boolean;
  attendanceCount: number;
  eventType: EventType;
  tags: string[];
};

export type Registration = {
  userId: string;
  name: string;
  email: string;
  university: string;
  graduation: string | null;
  major: string | null;
  dietaryRestrictions: string[];
  allergies: string[];
  gender: string | null;
  ethnicity: string[];
  hearAboutRP: string[];
  portfolios: string[];
  jobInterest: string[];
  isInterestedMechMania: boolean;
  isInterestedPuzzleBang: boolean;
  hasResume: boolean;
  hasSubmitted: boolean;
  degree?: string;
};

export type Role = 'USER' | 'STAFF' | 'ADMIN' | 'CORPORATE' | 'PUZZLEBANG';

export type ShiftAssignment = {
  shiftId: string;
  staffEmail: string;
  acknowledged: boolean;
  shifts: {
    shiftId: string;
    name: string;
    role: string;
    startTime: string;
    endTime: string;
    location: string;
  };
};

export type ShiftCard = {
  id: string;
  title: string;
  time: string;
  location: string;
  role: string;
  acknowledged: boolean;
  startTime: string;
  endTime: string;
};

export type RoleObject = {
  userId?: string;
  displayName: string;
  email: string;
  roles: Role[];
  tags?: string[];
};

export type TeamName =
  | 'FULL TEAM'
  | 'CONTENT'
  | 'CORPORATE'
  | 'DESIGN'
  | 'DEV'
  | 'MARKETING'
  | 'OPERATIONS';

export type AttendanceType = 'ABSENT' | 'PRESENT' | 'EXCUSED';

export type Staff = {
  userId: string;
  name: string;
  team: TeamName;
  attendances: Record<string, AttendanceType>;
};

export type Meeting = {
  meetingId: string;
  committeeType:
    | 'FULL TEAM'
    | 'CONTENT'
    | 'CORPORATE'
    | 'DESIGN'
    | 'DEV'
    | 'MARKETING'
    | 'OPERATIONS';
  startTime: string;
};

export interface APIRoutes {
  '/leaderboard/daily': {
    GET: {
      // Query: day (YYYY-MM-DD), n?: number
      response: {
        leaderboard: Array<{
          userId: string;
          currentTier: TierType;
          icon: IconColorType;
          points: number;
          displayName: string;
          rank: number;
        }>;
        day: string;
        count: number;
      };
    };
  };
  '/leaderboard/global': {
    GET: {
      // Query: n?: number
      response: {
        leaderboard: Array<{
          userId: string;
          currentTier: TierType;
          icon: IconColorType;
          points: number;
          displayName: string;
          rank: number;
        }>;
        count: number;
      };
    };
  };
  '/attendee': {
    GET: {
      response: Attendee;
    };
  };
  '/attendee/icon': {
    PATCH: {
      request: { icon: IconColorType };
      response: { message: string };
    };
  };
  '/attendee/tags': {
    PATCH: {
      request: { tags: string[] };
      response: { tags: string[] };
    };
  };
  '/attendee/points': {
    GET: {
      response: { points: number };
    };
  };
  '/attendee/emails': {
    GET: {
      response: Array<{ email: string; userId: string }>;
    };
  };
  '/attendee/id/:userId': {
    GET: {
      response: Attendee;
    };
  };
  '/attendee/redeemable/:userId': {
    GET: {
      response: {
        userId: string;
        currentTier: TierMappedType;
        redeemedTiers: TierType[];
        redeemableTiers: TierType[];
      };
    };
  };
  '/attendee/redeem': {
    POST: {
      request: { userId: string; tier: TierType };
      response: {
        message: string;
        userId: string;
        tier: TierType;
      };
    };
  };
  '/attendee/favorites': {
    GET: {
      request: { userId: string };
      response: Attendee;
    };
  };
  '/attendee/favorites/:eventId': {
    POST: {
      request: { userId: string };
      response: { message: string };
    };
    DELETE: {
      request: { userId: string };
      response: { message: string };
    };
  };
  '/attendee/qr': {
    GET: {
      response: { qrCode: string };
    };
  };
  '/auth': {
    PUT: {
      request: { email: string; role: Role };
      response: Role;
    };
    DELETE: {
      request: { email: string; role: Role };
      response: never;
    };
  };
  '/auth/:role': {
    GET: {
      response: RoleObject[];
    };
  };
  '/auth/login/:platform': {
    POST: {
      request: { code: string; redirectUri: string; codeVerifier: string };
      response: { token: string };
    };
  };
  '/auth/info': {
    GET: {
      response: RoleObject;
    };
  };
  '/auth/corporate': {
    GET: {
      response: Corporate[];
    };
    POST: {
      request: Corporate;
      response: Corporate;
    };
    DELETE: {
      request: { email: string };
      response: never;
    };
  };
  '/auth/sponsor/verify': {
    POST: {
      request: {
        sixDigitCode: string;
        email: string;
      };
      response: { token: string };
    };
  };
  '/checkin/event': {
    POST: {
      request: { eventId: string; userId: string };
      response: never;
    };
  };
  '/checkin/scan/staff': {
    POST: {
      request: { eventId: string; qrCode: string };
      response: string;
    };
  };
  '/checkin/scan/merch': {
    POST: {
      request: { qrCode: string };
      response: string;
    };
  };
  '/events': {
    GET: {
      response: Event[];
    };
    POST: {
      request: Omit<Event, 'eventId'>;
      response: Event;
    };
  };
  '/events/:eventId': {
    PUT: {
      request: Partial<Omit<Event, 'eventId'>>;
      response: Event;
    };
    DELETE: {
      response: never;
    };
  };
  '/events/currentOrNext': {
    GET: {
      response: Event;
    };
  };
  '/registration/filter/pagecount': {
    POST: {
      request: {
        graduations?: string[];
        majors?: string[];
        jobInterests?: string[];
        degrees?: string[];
      };
      response: { pagecount: number };
    };
  };
  '/registration/filter/:page': {
    POST: {
      request: {
        graduations?: string[];
        majors?: string[];
        jobInterests?: string[];
        degrees?: string[];
      };
      response: {
        registrants: Registration[];
        page: number;
      };
    };
  };
  '/staff': {
    GET: {
      response: Staff[];
    };
  };
  '/staff/check-in': {
    POST: {
      request: { meetingId: string };
      response: never;
    };
  };
  '/meetings': {
    GET: {
      response: Meeting[];
    };
    POST: {
      request: { committeeType: TeamName; startTime: string };
      response: Meeting;
    };
  };
  '/meetings/:meetingId': {
    PUT: {
      request: Partial<Omit<Meeting, 'meetingId'>>;
      response: Meeting;
    };
    DELETE: {
      response: never;
    };
  };
  '/s3/download/user/:userId': {
    GET: {
      response: { url: string };
    };
  };
  '/s3/download/batch': {
    POST: {
      request: { userIds: string[] };
      response: { data: (string | null)[]; errorCount: number };
    };
  };
  '/staff/:staffId/attendance': {
    POST: {
      request: { meetingId: string; attendanceType: AttendanceType };
      response: Staff;
    };
  };
  '/status': {
    GET: {
      response: never;
    };
  };
  '/stats/attendance/:n': {
    GET: {
      response: { attendanceCounts: number[] };
    };
  };
  '/stats/check-in': {
    GET: {
      response: { count: number };
    };
  };
  '/stats/priority-attendee': {
    GET: {
      response: { count: number };
    };
  };
  '/stats/dietary-restrictions': {
    GET: {
      response: DietaryRestrictionStats;
    };
  };
  '/stats/merch-item/:price': {
    GET: {
      response: { count: number };
    };
  };
  '/notifications/register': {
    POST: {
      request: { deviceId: string }; // FCM token
      response: never;
    };
  };
  '/shifts/my-shifts': {
    GET: {
      response: ShiftAssignment[];
    };
  };
  '/shifts/:shiftId/acknowledge': {
    POST: {
      response: ShiftAssignment;
    };
  };
}

type ExtractPathParams<Path extends string> = Path extends `${string}:${infer Param}/${infer Rest}`
  ? Param | ExtractPathParams<`/${Rest}`>
  : Path extends `${string}:${infer Param}`
    ? Param
    : never;

export function path<
  Pattern extends keyof APIRoutes,
  Params extends Record<ExtractPathParams<Pattern>, string | number>,
>(pattern: Pattern, params: Params): Pattern {
  let builtPath: string = pattern;

  for (const key in params) {
    builtPath = builtPath.replace(
      new RegExp(`:${key}\\b`, 'g'),
      encodeURIComponent(params[key].toString()),
    );
  }

  return builtPath as Pattern;
}

export type RequestType<
  Path extends keyof APIRoutes,
  Method extends string,
> = Method extends keyof APIRoutes[Path]
  ? 'request' extends keyof APIRoutes[Path][Method]
    ? APIRoutes[Path][Method]['request']
    : never
  : never;

export type ResponseType<
  Path extends keyof APIRoutes,
  Method extends string,
> = Method extends keyof APIRoutes[Path]
  ? 'response' extends keyof APIRoutes[Path][Method]
    ? APIRoutes[Path][Method]['response']
    : never
  : never;
