<template>
  <div class="content-item">
    <div class="content-info">
      <h3>{{ content.title }}</h3>
      <p>{{ content.description }}</p>
    </div>
    <div class="content-meta">
      <span class="created-at">{{ formatDate(content.created_at) }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { LectureContent } from '@/types/content-type'

defineProps<{
  content: LectureContent
}>()

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString()
}
</script>

<style scoped>
.content-item {
  padding: 15px;
  border: 1px solid #dee2e6;
  border-radius: 4px;
  transition: transform 0.2s;
}

.content-item:hover {
  transform: translateX(5px);
  border-color: #adb5bd;
}

.content-info h3 {
  margin: 0 0 8px 0;
  color: #343a40;
}

.content-info p {
  color: #6c757d;
  margin: 0;
}

.content-meta {
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
  font-size: 0.9rem;
  color: #868e96;
}
</style> 