<template>
  <div class="lecture-detail">
    <!-- 강의 상세 정보 섹션 -->
    <section class="lecture-info">
      <div class="lecture-header">
        <h1>{{ lecture?.title }}</h1>
        <span class="lecture-type">{{ LectureTypeLabel[lecture?.lecture_type || 'ETC'] }}</span>
      </div>
      
      <div class="lecture-content">
        <div class="lecture-image">
          <img :src="lecture?.image || '/images/default-lecture.png'" :alt="lecture?.title">
        </div>
        
        <div class="lecture-details">
          <p class="description">{{ lecture?.description }}</p>
          <div class="meta-info">
            <span class="price">{{ lecture?.price?.toLocaleString() }}원</span>
            <span class="rating">⭐ {{ lecture?.rating?.toFixed(1) || '0.0' }}</span>
          </div>
        </div>
      </div>
    </section>

    <!-- 컨텐츠 리스트 섹션 -->
    <section class="lecture-contents">
      <div class="section-header">
        <h2>강의 컨텐츠</h2>
        <button 
          v-if="isInstructor" 
          @click="handleAddContent"
          class="add-content-btn"
        >
          컨텐츠 추가
        </button>
      </div>

      <div v-if="isLoading" class="loading">
        로딩 중...
      </div>
      
      <div v-else-if="error" class="error">
        {{ error }}
      </div>
      
      <div v-else-if="!contents || contents.length === 0" class="empty">
        등록된 컨텐츠가 없습니다.
      </div>
      
      <div v-else class="content-list">
        <ContentCard
          v-for="content in sortedContents"
          :key="content.content_id"
          :content="content"
        />
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useUserStore } from '@/stores/user'
import type { Lecture, LectureContent } from '@/types/lecture'
import { LectureTypeLabel } from '@/types/lecture'
import { lectureApi } from '@/api/Lecture-api'
import ContentCard from '@/components/content/ContentCard.vue'

const route = useRoute()
const userStore = useUserStore()
const lectureId = route.params.id as string

const lecture = ref<Lecture | null>(null)
const contents = ref<LectureContent[]>([])
const isLoading = ref(true)
const error = ref<string | null>(null)

// 현재 사용자가 강의 작성자인지 확인
const isInstructor = computed(() => {
  return lecture.value?.instructor_id === userStore.user?.user_id
})

// 강의 상세 정보 조회
const fetchLectureDetail = async () => {
  try {
    const response = await lectureApi.getLectureDetail(lectureId)
    lecture.value = response
  } catch (err: any) {
    error.value = '강의 정보를 불러오는데 실패했습니다.'
    console.error('강의 상세 조회 에러:', err)
  }
}

// 강의 컨텐츠 목록 조회
const fetchLectureContents = async () => {
  try {
    const response = await lectureApi.getLectureContents(lectureId)
    contents.value = response.items
  } catch (err: any) {
    error.value = '컨텐츠 목록을 불러오는데 실패했습니다.'
    console.error('컨텐츠 목록 조회 에러:', err)
  } finally {
    isLoading.value = false
  }
}

// 컨텐츠 추가 버튼 핸들러 (추후 구현)
const handleAddContent = () => {
  // TODO: 컨텐츠 추가 페이지로 이동
  console.log('컨텐츠 추가')
}

// 유틸리티 함수들
const formatDuration = (seconds: number) => {
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString()
}

// 정렬된 컨텐츠 목록
const sortedContents = computed(() => {
  return [...contents.value].sort((a, b) => a.content_number - b.content_number)
})

onMounted(async () => {
  await fetchLectureDetail()
  await fetchLectureContents()
})
</script>

<style scoped>
.lecture-detail {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.lecture-info {
  background: white;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 30px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.lecture-header {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 20px;
}

.lecture-type {
  padding: 4px 12px;
  background-color: #e9ecef;
  border-radius: 4px;
  font-size: 0.9rem;
  color: #495057;
}

.lecture-content {
  display: grid;
  grid-template-columns: 300px 1fr;
  gap: 30px;
}

.lecture-image img {
  width: 100%;
  height: 200px;
  object-fit: cover;
  border-radius: 4px;
}

.description {
  color: #495057;
  line-height: 1.6;
  margin-bottom: 20px;
}

.meta-info {
  display: flex;
  gap: 20px;
}

.price {
  font-weight: bold;
  color: #2c3e50;
}

.rating {
  color: #f1c40f;
}

.lecture-contents {
  background: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.add-content-btn {
  padding: 8px 16px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.add-content-btn:hover {
  background-color: #0056b3;
}

.content-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.loading, .error, .empty {
  text-align: center;
  padding: 40px;
  color: #6c757d;
}

.error {
  color: #dc3545;
}
</style>
