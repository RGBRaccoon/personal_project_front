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
