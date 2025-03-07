<template>
  <div class="my-lectures">
    <h2>내 강의 목록</h2>
    
    <div v-if="isLoading" class="loading">
      로딩 중...
    </div>
    
    <div v-else-if="error" class="error">
      {{ error }}
    </div>
    
    <div v-else-if="!lectures || lectures.length === 0" class="empty">
      등록된 강의가 없습니다.
    </div>
    
    <div v-else>
      <div class="lecture-grid">
        <LectureCard
          v-for="lecture in lectures"
          :key="lecture.lecture_id"
          :lecture="lecture"
          @click="goToLectureDetail(lecture.lecture_id)"
        />
      </div>

      <div class="pagination">
        <button 
          :disabled="currentPage === 1"
          @click="changePage(currentPage - 1)"
          class="page-button"
        >
          이전
        </button>
        
        <span class="page-info">
          {{ currentPage }} / {{ totalPages || 1 }}
        </span>
        
        <button 
          :disabled="currentPage === (totalPages || 1)"
          @click="changePage(currentPage + 1)"
          class="page-button"
        >
          다음
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import type { Lecture } from '@/types/lecture-type'
import LectureCard from './LectureCard.vue'
import { lectureApi } from '@/api/lecture-api'

const router = useRouter()
const lectures = ref<Lecture[]>([])
const isLoading = ref(true)
const error = ref<string | null>(null)
const currentPage = ref(1)
const totalPages = ref(1)

const fetchPageInfo = async () => {
  try {
    const pageInfo = await lectureApi.getMyLecturePageInfo()
    console.log('페이지 정보:', pageInfo)
    totalPages.value = pageInfo.total_pages
  } catch (err: any) {
    console.error('페이지 정보 조회 에러:', err)
  }
}

const fetchLectures = async (page: number) => {
  isLoading.value = true
  try {
    const response = await lectureApi.getMyLectures(page)
    console.log('강의 목록:', response)
    lectures.value = response.items
    currentPage.value = page
  } catch (err: any) {
    console.error('강의 목록 조회 에러:', err)
    error.value = err.message || '강의 목록을 불러오는데 실패했습니다.'
  } finally {
    isLoading.value = false
  }
}

const changePage = (newPage: number) => {
  if (newPage >= 1 && newPage <= totalPages.value) {
    fetchLectures(newPage)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

const goToLectureDetail = (lectureId: string) => {
  router.push(`/lecture/${lectureId}`)
}

onMounted(async () => {
  await fetchPageInfo()
  await fetchLectures(1)
})
</script>

<style scoped>
.my-lectures {
  padding: 20px;
}

.loading, .error, .empty {
  text-align: center;
  padding: 40px;
  color: #666;
}

.error {
  color: #dc3545;
}

.lecture-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
  margin-top: 20px;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 2rem;
  gap: 1rem;
}

.page-button {
  padding: 0.5rem 1rem;
  border: 1px solid #ddd;
  background-color: white;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
}

.page-button:hover:not(:disabled) {
  background-color: #f8f9fa;
  border-color: #adb5bd;
}

.page-button:disabled {
  background-color: #f8f9fa;
  color: #adb5bd;
  cursor: not-allowed;
}

.page-info {
  font-size: 0.9rem;
  color: #495057;
}
</style>