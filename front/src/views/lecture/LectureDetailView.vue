<template>
  <div v-if="lecture">
    <LectureDetail :lecture="lecture">
      <template #sidebar>
        <!-- 컨텐츠 리스트 - 조건부 렌더링 -->
        <InstructorContentList
          v-if="isInstructor"
          :lecture-id="lectureId"
        />
        <StudentContentList
          v-else
          :lecture-id="lectureId"
        />
      </template>
    </LectureDetail>
  </div>
  <div v-else-if="error" class="error">
    {{ error }}
  </div>
  <div v-else class="loading">
    강의 정보를 불러오는 중...
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useUserStore } from '@/stores/user-store'
import type { Lecture } from '@/types/lecture-type'
import type { ContentInList } from '@/types/content-type'
import { lectureApi } from '@/api/lecture-api'
import { contentApi } from '@/api/content-api'
import LectureDetail from '@/components/lecture/LectureDetail.vue'
import InstructorContentList from '@/components/content/InstructorContentList.vue'
import StudentContentList from '@/components/content/StudentContentList.vue'

const route = useRoute()
const userStore = useUserStore()
const lectureId = route.params.id as string

const lecture = ref<Lecture | null>(null)
const contents = ref<ContentInList[]>([])
const currentPage = ref(1)
const isLoading = ref(true)
const error = ref<string | null>(null)

const isInstructor = computed(() => 
  lecture.value?.instructor_id === userStore.user?.id
)

const fetchLectureDetail = async () => {
  try {
    const response = await lectureApi.getLectureDetail(lectureId)
    lecture.value = response
  } catch (err: any) {
    error.value = '강의 정보를 불러오는데 실패했습니다.'
    console.error('강의 상세 조회 에러:', err)
  }
}

const fetchLectureContents = async () => {
  try {
    const response = await contentApi.getOwnedContents(lectureId, currentPage.value)
    contents.value = response
  } catch (err: any) {
    error.value = '컨텐츠 목록을 불러오는데 실패했습니다.'
    console.error('컨텐츠 목록 조회 에러:', err)
  } finally {
    isLoading.value = false
  }
}

const loadUserInfo = async () => {
  try {
    const user = await userStore.fetchCurrentUser()
    if (!user) {
      error.value = '사용자 정보를 불러올 수 없습니다.'
    }
  } catch (err) {
    console.error('사용자 정보 로드 실패:', err)
    error.value = '사용자 정보를 불러올 수 없습니다.'
  }
}

onMounted(async () => {
  await loadUserInfo()
  await fetchLectureDetail()
  await fetchLectureContents()
})
</script>

<style scoped>
.loading, .error {
  text-align: center;
  padding: 40px;
  color: #6c757d;
}

.error {
  color: #dc3545;
}
</style>
