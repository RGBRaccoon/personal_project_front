<template>
  <div v-if="isOpen" class="modal-overlay">
    <div class="modal-content">
      <h2>컨텐츠 추가</h2>
      
      <form @submit.prevent="handleSubmit">
        <div class="form-group">
          <label for="title">제목</label>
          <input 
            id="title"
            v-model="form.title"
            type="text"
            required
          />
        </div>

        <div class="form-group">
          <label for="description">설명</label>
          <textarea 
            id="description"
            v-model="form.description"
            rows="4"
            required
          />
        </div>

        <div class="form-group">
          <label for="video_url">동영상 URL</label>
          <input 
            id="video_url"
            v-model="form.video_url"
            type="url"
            required
          />
        </div>

        <div class="modal-actions">
          <button type="submit" class="submit-btn">추가</button>
          <button type="button" @click="close" class="cancel-btn">취소</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

interface ContentForm {
  title: string;
  description: string;
  video_url: string;
}

const props = defineProps<{
  isOpen: boolean;
  lectureId: string;
}>()

const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'submit', data: ContentForm): void;
}>()

const form = ref<ContentForm>({
  title: '',
  description: '',
  video_url: ''
})

const handleSubmit = () => {
  emit('submit', form.value)
}

const close = () => {
  form.value = {
    title: '',
    description: '',
    video_url: ''
  }
  emit('close')
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  width: 90%;
  max-width: 500px;
}

.form-group {
  margin-bottom: 1rem;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: bold;
}

input, textarea {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1.5rem;
}

.submit-btn, .cancel-btn {
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
}

.submit-btn {
  background-color: #007bff;
  color: white;
  border: none;
}

.submit-btn:hover {
  background-color: #0056b3;
}

.cancel-btn {
  background-color: #6c757d;
  color: white;
  border: none;
}

.cancel-btn:hover {
  background-color: #5a6268;
}
</style> 