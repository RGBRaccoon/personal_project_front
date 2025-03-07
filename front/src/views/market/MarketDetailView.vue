<template>
  <div v-if="lecture">
    <LectureDetail :lecture="lecture">
      <template #actions>
        <div class="price-card">
          <h3>수강 신청</h3>
          <p class="price">{{ formatPrice(lecture.price) }}원</p>
          
          <div class="action-buttons">
            <button 
              v-if="!isAuthenticated" 
              @click="goToLogin" 
              class="login-button"
            >
              로그인하고 수강하기
            </button>
            <template v-else>
              <button 
                v-if="!isOwner && !isRented"
                @click="handleRentLecture" 
                class="rent-button"
                :disabled="isRenting"
              >
                {{ isRenting ? '처리중...' : '수강 신청하기' }}
              </button>
              <button 
                v-if="isRented"
                @click="goToLecture" 
                class="go-lecture-button"
              >
                강의 보러가기
              </button>
              <button 
                v-if="isOwner"
                @click="goToLectureManagement" 
                class="manage-button"
              >
                강의 관리하기
              </button>
            </template>
          </div>
        </div>
      </template>
    </LectureDetail>
  </div>
  <div v-else-if="error" class="error-container">
    {{ error }}
  </div>
  <div v-else class="loading-container">
    강의 정보를 불러오는 중...
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth-store'
import { marketApi } from '@/api/market-api'
import type { Lecture } from '@/types/lecture-type'
import LectureDetail from '@/components/lecture/LectureDetail.vue'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

const DEFAULT_IMAGE = '/images/default_lecture_image.png'

const lecture = ref<Lecture | null>(null)
const error = ref<string | null>(null)
const isRenting = ref(false)

const isAuthenticated = computed(() => authStore.isAuthenticated)
const isOwner = computed(() => 
  lecture.value?.instructor_id === authStore.user?.id
)
const isRented = computed(() => {
  // TODO: 실제 대여 여부 확인 로직 구현 필요
  return false
})

const getImageUrl = (imageUrl: string | null | undefined): string => {
  return imageUrl || DEFAULT_IMAGE
}

const handleImageError = (e: Event) => {
  const img = e.target as HTMLImageElement
  if (img.src !== DEFAULT_IMAGE) {
    img.src = DEFAULT_IMAGE
  }
}

const fetchLectureDetail = async () => {
  try {
    const lectureId = route.params.lecture_id as string
    const response = await marketApi.getMarketLectureDetail(lectureId)
    lecture.value = response
  } catch (err: any) {
    console.error('강의 상세 정보 조회 에러:', err)
    error.value = '강의 정보를 불러오는데 실패했습니다.'
  }
}

const formatPrice = (price: number) => {
  return price.toLocaleString()
}

const goToLogin = () => {
  router.push('/login')
}

const goToLecture = () => {
  router.push(`/lecture/${lecture.value?.lecture_id}`)
}

const goToLectureManagement = () => {
  router.push(`/lecture/management/${lecture.value?.lecture_id}`)
}

const handleRentLecture = async () => {
  if (!lecture.value || isRenting.value) return
  
  isRenting.value = true
  try {
    await marketApi.rentLecture(lecture.value.lecture_id)
    router.push(`/lecture/${lecture.value.lecture_id}`)
  } catch (err: any) {
    console.error('강의 대여 에러:', err)
    error.value = '강의 대여에 실패했습니다.'
  } finally {
    isRenting.value = false
  }
}

onMounted(() => {
  fetchLectureDetail()
})
</script>

<style scoped>
.price-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
}

.price-card h3 {
  font-size: 1.2rem;
  color: #333;
}

.price {
  font-size: 2rem;
  font-weight: bold;
  color: #4CAF50;
}

.action-buttons {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 100%;
  max-width: 400px;
}

.action-buttons button {
  width: 100%;
  padding: 1rem;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.2s;
}

.login-button {
  background-color: #2196F3;
  color: white;
}

.login-button:hover {
  background-color: #1976D2;
}

.rent-button {
  background-color: #4CAF50;
  color: white;
}

.rent-button:hover {
  background-color: #45a049;
}

.rent-button:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

.go-lecture-button {
  background-color: #FF9800;
  color: white;
}

.go-lecture-button:hover {
  background-color: #F57C00;
}

.manage-button {
  background-color: #9C27B0;
  color: white;
}

.manage-button:hover {
  background-color: #7B1FA2;
}

.loading-container, .error-container {
  text-align: center;
  padding: 4rem;
  color: #666;
}

.error-container {
  color: #dc3545;
}
</style> 