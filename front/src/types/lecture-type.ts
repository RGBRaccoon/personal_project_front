export enum LectureType {
  AI = 'ai',
  BACKEND = 'backend',
  FRONTEND = 'frontend',
  MOBILE = 'mobile',
  DESIGN = 'design',
  GAME = 'game',
  ETC = 'etc'
}

// 강의 유형별 한글 표시를 위한 매핑
export const LectureTypeLabel: Record<LectureType, string> = {
  [LectureType.AI]: '인공지능',
  [LectureType.BACKEND]: '백엔드',
  [LectureType.FRONTEND]: '프론트엔드',
  [LectureType.MOBILE]: '모바일',
  [LectureType.DESIGN]: '디자인',
  [LectureType.GAME]: '게임 개발',
  [LectureType.ETC]: '기타'
}

// 강의 관련 인터페이스
export interface Lecture {
  lecture_id: string;  // UUID
  instructor_id: string;  // UUID
  title: string;
  description: string;
  lecture_type: LectureType;
  price: number;
  image?: string | null;  // Optional
  created_at: string;  // ISO datetime string
  updated_at: string;  // ISO datetime string
  rating: number;
}

export interface CreateLectureRequest {
  title: string;
  description: string;
  lecture_type: LectureType;
  price: number;
}
