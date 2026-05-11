export interface UserDoc {
  _id: string;
  sub: string;
  email: string;
  name: string;
  picture?: string | null;
  createdAt: string;
}

export interface PollDoc {
  _id: string;
  creator: string;
  title: string;
  description: string;
  expiresAt: string;
  responseMode: "anonymous" | "authenticated";
  status: "active" | "expired" | "published";
  slug: string;
  createdAt: string;
}

export interface QuestionDoc {
  _id: string;
  poll: string;
  text: string;
  options: string[];
  isMandatory: boolean;
  order: number;
}

export interface ResponseDoc {
  _id: string;
  poll: string;
  question: string;
  respondent?: string | null;
  selectedOption: string;
  respondentId?: string;
  fingerprint?: string;
  createdAt: string;
}

export interface PollWithQuestions extends PollDoc {
  questions: QuestionDoc[];
}

export interface AnalyticsData {
  totalResponses: number;
  questionSummaries: QuestionSummary[];
  timeline: TimelineEntry[];
  participationInsights: {
    anonymous: number;
    authenticated: number;
  };
  engagement: EngagementStats;
  pollHealth: PollHealthStats;
}

export interface EngagementStats {
  firstResponseAt: string | null;
  lastResponseAt: string | null;
  responseVelocity: number;
  peakActivity: {
    hour: number | null;
    dayOfWeek: number | null;
  };
  uniqueRespondents: number;
}

export interface PollHealthStats {
  completionRate: number;
  avgResponsesPerHour: number;
  hoursSinceCreation: number;
  statusAge: string;
}

export interface QuestionSummary {
  questionId: string;
  questionText: string;
  options: OptionCount[];
  totalAnswers: number;
}

export interface OptionCount {
  option: string;
  count: number;
  percentage: number;
}

export interface TimelineEntry {
  date: string;
  count: number;
}

export interface ApiError {
  message: string;
  code?: string;
}
