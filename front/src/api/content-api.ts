import api from './axios'
import type { ContentCreate, ContentInList } from '@/types/content-type'

export const contentApi = {
  createContent: (data: ContentCreate) =>
    api.post<string>('/content/management/create', data),

  getOwnedContents: (lectureId: string, page: number = 1) =>
    api.get<ContentInList[]>(`/content/fetch/content_in_lecture/owned/${lectureId}/${page}`)
} 