export interface LectureContent {
  content_id: string;          // UUID
  lecture_id: string;          // UUID
  title: string;
  content_number: number;      // 추가
  description: string;
  video_url: string;          // 추가
  created_at: string;         // datetime
  updated_at: string;         // datetime
}

export interface ContentInList {
  content_id: string;  // UUID
  content_number: number;
  title: string;
  description: string;
}

export interface ContentCreate {
  title: string;
  description: string;
  video_url: string;
  lecture_id: string;  // UUID 타입이지만 TypeScript에서는 string으로 처리
} 