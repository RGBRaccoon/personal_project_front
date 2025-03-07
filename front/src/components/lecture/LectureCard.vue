<template>
    <div class="lecture-card">
      <div class="lecture-image">
        <img 
          :src="getImageUrl(lecture.image)"
          :alt="lecture.title"
          @error="handleImageError"
          class="lecture-img"
        >
      </div>
      <div class="lecture-info">
        <span class="lecture-type">{{ LectureTypeLabel[lecture.lecture_type] }}</span>
        <h3>{{ lecture.title }}</h3>
        <p class="description">{{ lecture.description }}</p>
        <div class="lecture-meta">
          <span class="price">{{ lecture.price.toLocaleString() }}원</span>
          <span class="rating">⭐ {{ lecture.rating?.toFixed(1) || '0.0' }}</span>
        </div>
        <div class="lecture-date">
          등록일: {{ formatDate(lecture.created_at) }}
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import type { Lecture } from '@/types/lecture-type'
  import { LectureTypeLabel } from '@/types/lecture-type'
  
  defineProps<{
    lecture: Lecture
  }>()
  
  const DEFAULT_IMAGE = '/images/default_lecture_image.png'
  
  const getImageUrl = (imageUrl: string | null | undefined): string => {
    return imageUrl || DEFAULT_IMAGE
  }
  
  const handleImageError = (e: Event) => {
    const img = e.target as HTMLImageElement
    if (img.src !== DEFAULT_IMAGE) {
      img.src = DEFAULT_IMAGE
    }
  }
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString()
  }
  </script>
  
  <style scoped>
  .lecture-card {
    border: 1px solid #ddd;
    border-radius: 8px;
    overflow: hidden;
    background: white;
    transition: transform 0.2s;
    cursor: pointer;
  }
  
  .lecture-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
  
  .lecture-image {
    position: relative;
    height: 160px;
    overflow: hidden;
    background-color: #f8f9fa;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .lecture-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: opacity 0.3s ease;
  }
  
  .lecture-image::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: #f8f9fa;
    z-index: -1;
  }
  
  .lecture-info {
    padding: 15px;
  }
  
  .lecture-type {
    display: inline-block;
    padding: 4px 8px;
    background-color: #e9ecef;
    border-radius: 4px;
    font-size: 0.8rem;
    color: #495057;
    margin-bottom: 8px;
  }
  
  h3 {
    margin: 8px 0;
    font-size: 1.2rem;
    color: #333;
  }
  
  .description {
    color: #666;
    font-size: 0.9rem;
    margin-bottom: 12px;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
  
  .lecture-meta {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 12px;
  }
  
  .price {
    font-weight: bold;
    color: #2c3e50;
  }
  
  .rating {
    color: #f1c40f;
  }
  
  .lecture-date {
    margin-top: 8px;
    font-size: 0.8rem;
    color: #999;
  }
  </style>