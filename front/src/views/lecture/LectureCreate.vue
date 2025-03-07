<template>

    <div class="create-lecture-container">
      <div class="create-lecture-box">
        <h2>새 강의 등록</h2>
        <form @submit.prevent="handleSubmit">
          <div class="form-group">
            <label for="title">강의 제목</label>
            <input 
              type="text" 
              id="title"
              v-model="lectureForm.title"
              required
              placeholder="강의 제목을 입력하세요"
            >
          </div>
  
          <div class="form-group">
            <label for="description">강의 설명</label>
            <textarea 
              id="description"
              v-model="lectureForm.description"
              required
              placeholder="강의에 대한 상세 설명을 입력하세요"
              rows="4"
            ></textarea>
          </div>
  
          <div class="form-group">
          <label for="lectureType">강의 유형</label>
          <select 
            id="lectureType"
            v-model="lectureForm.lecture_type"
            required
          >
            <option value="">강의 유형을 선택하세요</option>
            <option 
              v-for="(label, type) in lectureTypes" 
              :key="type" 
              :value="type"
            >
              {{ label }}
            </option>
          </select>
        </div>
  
          <div class="form-group">
            <label for="price">가격 (원)</label>
            <input 
              type="number" 
              id="price"
              v-model="lectureForm.price"
              required
              min="0"
              step="1000"
              placeholder="가격을 입력하세요"
            >
          </div>
  
          <div class="form-actions">
            <button type="button" class="cancel-button" @click="goBack">취소</button>
            <button 
              type="submit" 
              class="submit-button" 
              :disabled="isLoading"
            >
              {{ isLoading ? '등록 중...' : '강의 등록' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref } from 'vue'
  import { useRouter } from 'vue-router'
  import { LectureType, LectureTypeLabel, type CreateLectureRequest } from '@/types/lecture-type'
  import { lectureApi } from '@/api/lecture-api'
  
  const router = useRouter()
  const isLoading = ref(false)
  const lectureTypes = LectureTypeLabel
  
  const lectureForm = ref<CreateLectureRequest>({
    title: '',
    description: '',
    lecture_type: '' as LectureType,
    price: 0
  })
  
  const handleSubmit = async () => {
    if (isLoading.value) return
    
    // 전송할 데이터 확인
    console.log('전송할 데이터:', {
      title: lectureForm.value.title,
      description: lectureForm.value.description,
      lecture_type: lectureForm.value.lecture_type,
      price: Number(lectureForm.value.price)  // 숫자로 변환
    })
    
    isLoading.value = true
    try {
      const response = await lectureApi.create({
        title: lectureForm.value.title,
        description: lectureForm.value.description,
        lecture_type: lectureForm.value.lecture_type,
        price: Number(lectureForm.value.price)  // 숫자로 변환
      })
      console.log('생성 응답:', response)
      alert('강의가 성공적으로 등록되었습니다.')
      router.push('/mypage')
    } catch (error: any) {
      console.error('강의 등록 에러:', error.response?.data || error)  // 에러 응답 데이터 확인
      alert(error.response?.data?.message || error.message || '강의 등록 중 오류가 발생했습니다.')
    } finally {
      isLoading.value = false
    }
  }
  
  const goBack = () => {
    router.back()
  }
  </script>
  
  <style scoped>
  .create-lecture-container {
    max-width: 800px;
    margin: 2rem auto;
    padding: 0 1rem;
  }
  
  .create-lecture-box {
    background: white;
    padding: 2rem;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
  
  h2 {
    text-align: center;
    margin-bottom: 2rem;
    color: #333;
  }
  
  .form-group {
    margin-bottom: 1.5rem;
  }
  
  label {
    display: block;
    margin-bottom: 0.5rem;
    color: #666;
  }
  
  input, textarea, select {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 1rem;
  }
  
  input:focus, textarea:focus, select:focus {
    outline: none;
    border-color: #4CAF50;
  }
  
  .form-actions {
    display: flex;
    gap: 1rem;
    margin-top: 2rem;
  }
  
  .submit-button, .cancel-button {
    padding: 0.75rem 1.5rem;
    border: none;
    border-radius: 4px;
    font-size: 1rem;
    cursor: pointer;
    flex: 1;
  }
  
  .submit-button {
    background-color: #4CAF50;
    color: white;
  }
  
  .submit-button:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
  }
  
  .cancel-button {
    background-color: #f5f5f5;
    color: #666;
  }
  
  .cancel-button:hover {
    background-color: #e0e0e0;
  }
  
  textarea {
    resize: vertical;
    min-height: 100px;
  }
  </style>