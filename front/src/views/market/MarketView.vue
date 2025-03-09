<template>
  <div class="market-container">
    <div class="market-header">
      <h1>강의 마켓</h1>
      <p>다양한 강의를 둘러보세요</p>
    </div>

    <div class="market-content">
      <!-- 로딩 상태 -->
      <div v-if="isLoading" class="loading">
        강의 목록을 불러오는 중...
      </div>

      <!-- 에러 상태 -->
      <div v-else-if="error" class="error">
        {{ error }}
      </div>

      <!-- 강의 없음 -->
      <div v-else-if="!lectures || lectures.length === 0" class="empty">
        현재 등록된 강의가 없습니다.
      </div>

      <!-- 강의 목록 -->
      <div v-else class="lecture-grid">
        <LectureCard
          v-for="lecture in lectures"
          :key="lecture.lecture_id"
          :lecture="lecture"
          @click="goToLectureDetail(lecture.lecture_id)"
        />
      </div>

      <!-- 페이지네이션 -->
      <div v-if="lectures && lectures.length > 0" class="pagination">
        <button 
          :disabled="currentPage === 1"
          @click="changePage(lectureType, currentPage - 1, keyword)"
          class="page-button"
        >
          이전
        </button>
        <span class="page-info">{{ currentPage }} / {{ totalPages }}</span>
        <button 
          :disabled="currentPage === totalPages"
          @click="changePage(lectureType, currentPage + 1, keyword)"
          class="page-button"
        >
          다음
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { marketApi } from '@/api/market-api'
import type { Lecture } from '@/types/lecture-type'
import LectureCard from '@/components/lecture/LectureCard.vue'

const router = useRouter()
const route = useRoute()

const lectures = ref<Lecture[]>([])
const isLoading = ref(false)
const error = ref<string | null>(null)
const currentPage = ref(1)
const totalPages = ref(1)
const lectureType = ref('all')
const keyword = ref('')

const fetchLectures = async (type: string, page: number, searchKeyword: string = '') => {
  isLoading.value = true
  try {
    const response = await marketApi.getMarketLectures(
      type, 
      page, 
      searchKeyword.trim()
    )
    lectures.value = response.items
    currentPage.value = page
  } catch (err: any) {
    console.error('강의 목록 조회 에러:', err)
    error.value = '강의 목록을 불러오는데 실패했습니다.'
  } finally {
    isLoading.value = false
  }
}

const changePage = (type: string, newPage: number, searchKeyword: string = '') => {
  if (newPage >= 1 && newPage <= totalPages.value) {
    fetchLectures(type, newPage, searchKeyword)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

const goToLectureDetail = (lectureId: string) => {
  router.push(`/market_detail/${lectureId}`)
}

// 검색어 변경 감지
watch(
  () => route.query.keyword,
  (newKeyword) => {
    const searchKeyword = (newKeyword as string || '').trim()
    keyword.value = searchKeyword
    // 검색어 유무와 관계없이 fetchLectures 호출
    // 내부적으로 빈 검색어는 기본 목록 요청으로 처리됨
    fetchLectures(lectureType.value, 1, searchKeyword)
  }
)

onMounted(() => {
  const searchKeyword = (route.query.keyword as string || '').trim()
  keyword.value = searchKeyword
  fetchLectures(lectureType.value, currentPage.value, searchKeyword)
})
</script>

<style scoped>
.market-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.market-header {
  text-align: center;
  margin-bottom: 3rem;
}

.market-header h1 {
  font-size: 2.5rem;
  color: #333;
  margin-bottom: 0.5rem;
}

.market-header p {
  color: #666;
  font-size: 1.1rem;
}

.lecture-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 2rem;
  margin-bottom: 2rem;
}

.lecture-card {
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s;
  cursor: pointer;
}

.lecture-card:hover {
  transform: translateY(-4px);
}

.lecture-image {
  width: 100%;
  height: 160px;
  overflow: hidden;
}

.lecture-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.lecture-info {
  padding: 1.5rem;
}

.lecture-info h3 {
  margin: 0 0 0.5rem 0;
  font-size: 1.2rem;
  color: #333;
}

.description {
  color: #666;
  font-size: 0.9rem;
  margin-bottom: 1rem;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.instructor {
  color: #888;
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
}

.price {
  font-size: 1.1rem;
  font-weight: bold;
  color: #4CAF50;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  margin-top: 2rem;
}

.page-button {
  padding: 0.5rem 1rem;
  border: 1px solid #ddd;
  background-color: white;
  border-radius: 4px;
  cursor: pointer;
}

.page-button:disabled {
  background-color: #f5f5f5;
  cursor: not-allowed;
}

.page-info {
  color: #666;
}

.loading, .error, .empty {
  text-align: center;
  padding: 3rem;
  color: #666;
}

.error {
  color: #dc3545;
}
</style> 