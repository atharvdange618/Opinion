export interface AnalyticsData {
  engagement: EngagementStats;
  participationInsights: {
    anonymous: number;
    authenticated: number;
  };
  pollHealth: PollHealthStats;
  questionSummaries: QuestionSummary[];
  timeline: TimelineEntry[];
  totalResponses: number;
}

export interface ApiError {
  code?: string;
  message: string;
}

export interface EngagementStats {
  firstResponseAt: null | string;
  lastResponseAt: null | string;
  peakActivity: {
    dayOfWeek: null | number;
    hour: null | number;
  };
  uniqueRespondents: number;
}

export interface OptionCount {
  count: number;
  option: string;
  percentage: number;
}

export interface PollDoc {
  _id: string;
  createdAt: string;
  creator: string;
  description: string;
  expiresAt: string;
  responseMode: 'anonymous' | 'authenticated';
  slug: string;
  status: 'active' | 'expired' | 'published';
  title: string;
}

export interface PollHealthStats {
  hoursSinceCreation: number;
  pollDuration: string;
  pollDurationHours: number;
  votesPerQuestion: VotesPerQuestion[];
}

export interface PollWithQuestions extends PollDoc {
  questions: QuestionDoc[];
}

export interface QuestionDoc {
  _id: string;
  isMandatory: boolean;
  options: string[];
  order: number;
  poll: string;
  text: string;
}

export interface QuestionSummary {
  options: OptionCount[];
  questionId: string;
  questionText: string;
  totalAnswers: number;
}

export interface ResponseDoc {
  _id: string;
  createdAt: string;
  fingerprint?: string;
  poll: string;
  question: string;
  respondent?: null | string;
  respondentId?: string;
  selectedOption: string;
}

export interface TimelineEntry {
  count: number;
  date: string;
}

export interface UserDoc {
  _id: string;
  createdAt: string;
  email: string;
  name: string;
  picture?: null | string;
  sub: string;
}

export interface VotesPerQuestion {
  dropOff: number;
  isMandatory: boolean;
  questionId: string;
  questionText: string;
  totalAnswers: number;
}
