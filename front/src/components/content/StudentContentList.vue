<template>
  <div class="content-list-section">
    <div class="section-header">
      <h2>강의 컨텐츠</h2>
      <div class="progress-info">
        진도율: {{ progressRate }}%
      </div>
    </div>

    <div v-if="isLoading" class="loading">로딩 중...</div>
    <div v-else-if="error" class="error">{{ error }}</div>
    <div v-else-if="!contents || contents.length === 0" class="empty">
      등록된 컨텐츠가 없습니다.
    </div>
    <div v-else class="content-list">
      <ContentCard
        v-for="content in sortedContents"
        :key="content.content_id"
        :content="content"
        :is-completed="completedContents.includes(content.content_id)"
        @click="handleContentClick"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
// ... imports ...

const props = defineProps<{
  lectureId: string
}>()

// ... 나머지 로직 ...
</script> 