<template>
  <div class="lecture-detail">
    <!-- 강의 상세 정보 섹션 -->
    <section class="lecture-info">
      <div class="lecture-header">
        <h1>{{ lecture.title }}</h1>
        <span class="lecture-type">{{ LectureTypeLabel[lecture.lecture_type] }}</span>
      </div>
      
      <div class="lecture-content">
        <div class="lecture-image">
          <img 
            :src="getImageUrl(lecture.image)"
            :alt="lecture.title"
            @error="handleImageError"
          >
        </div>
        
        <div class="lecture-details">
          <p class="instructor">강사 : {{ lecture.instructor_id }}</p>
          <div class="meta-info">
            <span class="description">강의 설명 : {{ lecture.description }}</span>
            <span class="rating">⭐ {{ lecture.rating?.toFixed(1) || '0.0' }}</span>
          </div>
        </div>
      </div>
    </section>

    <!-- 컨텐츠/기능 섹션 -->
    <section class="lecture-actions">
      <slot name="actions"></slot>
    </section>

    <!-- 사이드바 (필요한 경우) -->
    <section class="lecture-sidebar" v-if="$slots.sidebar">
      <slot name="sidebar"></slot>
    </section>
  </div>
</template>

<script setup lang="ts">
import type { Lecture } from '@/types/lecture-type'
import { LectureTypeLabel } from '@/types/lecture-type'

const DEFAULT_IMAGE = '/images/default_lecture_image.png'

const props = defineProps<{
  lecture: Lecture
}>()

const getImageUrl = (imageUrl: string | null | undefined): string => {
  return imageUrl || DEFAULT_IMAGE
}

const handleImageError = (e: Event) => {
  const img = e.target as HTMLImageElement
  if (img.src !== DEFAULT_IMAGE) {
    img.src = DEFAULT_IMAGE
  }
}
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
  padding: 30px;
  margin-bottom: 30px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.lecture-header {
  margin-bottom: 30px;
}

.lecture-header h1 {
  font-size: 2rem;
  color: #333;
  margin-bottom: 10px;
}

.lecture-type {
  display: inline-block;
  padding: 4px 12px;
  background-color: #e9ecef;
  border-radius: 4px;
  font-size: 0.9rem;
  color: #495057;
}

.lecture-content {
  display: flex;
  gap: 30px;
}

.lecture-image {
  flex-shrink: 0;
  width: 300px;
  border-radius: 8px;
  overflow: hidden;
  background-color: #f8f9fa;
}

.lecture-image img {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

.lecture-details {
  flex-grow: 1;
}

.description {
  color: #495057;
  line-height: 1.6;
  font-size: 1.1rem;
  margin-bottom: 20px;
}

.meta-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 15px;
  border-top: 1px solid #dee2e6;
}

.instructor {
  color: #6c757d;
  font-size: 0.95rem;
}

.rating {
  color: #f1c40f;
  font-size: 1.1rem;
  font-weight: 500;
}

.lecture-actions {
  background: white;
  border-radius: 8px;
  padding: 30px;
  margin-bottom: 30px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.lecture-sidebar {
  background: white;
  border-radius: 8px;
  padding: 30px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

@media (max-width: 768px) {
  .lecture-content {
    flex-direction: column;
  }

  .lecture-image {
    width: 100%;
    max-width: none;
  }

  .lecture-header h1 {
    font-size: 1.75rem;
  }

  .meta-info {
    flex-direction: column;
    gap: 10px;
    align-items: flex-start;
  }
}
</style>
