<template>
  <div class="content-list-section">
    <div class="section-header">
      <h2>강의 컨텐츠</h2>
      <button @click="handleAddContent" class="add-content-btn">
        컨텐츠 추가
      </button>
    </div>

    <div v-if="isLoading" class="loading">로딩 중...</div>
    <div v-else-if="error" class="error">{{ error }}</div>
    <div v-else-if="!contents || contents.length === 0" class="empty">
      등록된 컨텐츠가 없습니다.
    </div>
    <div v-else class="content-list">
      <div v-for="content in contents" :key="content.content_id" class="content-item">
        <h3>{{ content.title }}</h3>
        <p>{{ content.description }}</p>
        <!-- 필요한 다른 컨텐츠 정보들 -->
      </div>
    </div>

    <AddContentModal 
      :is-open="isModalOpen"
      :lecture-id="lectureId"
      @close="closeModal"
      @submit="handleContentSubmit"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import AddContentModal from './AddContentModal.vue'
import { contentApi } from '@/api/content-api'
import type { ContentCreate } from '@/types/content-type'

const props = defineProps<{
  lectureId: string
}>()

const contents = ref<Content[]>([])
const isModalOpen = ref(false)
const isLoading = ref(false)
const error = ref<string | null>(null)

// 컨텐츠 목록 조회 함수 추가
const fetchContents = async () => {
  try {
    isLoading.value = true
    const response = await contentApi.getOwnedContents(props.lectureId, 1)
    console.log('받아온 컨텐츠 데이터:', response)  // 응답 데이터 확인
    contents.value = response.data
    console.log('contents value:', contents.value)  // contents ref 값 확인
  } catch (err) {
    console.error('컨텐츠 목록 조회 실패:', err)
    error.value = '컨텐츠 목록을 불러오는데 실패했습니다.'  
  } finally {
    isLoading.value = false
  }
}

const handleAddContent = () => {
  console.log('컨텐츠 추가 버튼 클릭')
  isModalOpen.value = true
}

const closeModal = () => {
  isModalOpen.value = false
}

const handleContentSubmit = async (formData: Omit<ContentCreate, 'lecture_id' | 'content_number'>) => {
  try {
    const contentData: Omit<ContentCreate, 'content_number'> = {
      ...formData,
      lecture_id: props.lectureId
    }
    
    await contentApi.createContent(contentData)
    closeModal()
    await fetchContents()
  } catch (err) {
    console.error('컨텐츠 추가 실패:', err)
  }
}

// 초기 데이터 로드
onMounted(() => {
  fetchContents()
})
</script>

<style scoped>
.content-list-section {
  padding: 1rem;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.content-list {
  display: grid;
  gap: 1rem;
}

.content-item {
  padding: 1rem;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.add-content-btn {
  padding: 0.5rem 1rem;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.add-content-btn:hover {
  background-color: #0056b3;
}

.loading, .error, .empty {
  text-align: center;
  padding: 2rem;
}

.error {
  color: red;
}
</style> 