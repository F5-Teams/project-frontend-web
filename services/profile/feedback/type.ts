export interface CreateFeedbackPayload {
  rating: number;
  comment: string;
}

export interface BookingFeedback {
  id: number;
  rating: number;
  comment: string;
  createdAt: string;
  booking?: unknown;
}
