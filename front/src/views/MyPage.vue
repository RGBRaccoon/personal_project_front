<template>
    <div class="mypage-container">
      <!-- 프로필 섹션 -->
      <div class="profile-section">
        <div class="profile-info">
          <h2>마이페이지</h2>
          <p>{{ email }}</p>
        </div>
      </div>
  
      <!-- 강의 섹션들 -->
      <div class="lectures-container">
        <!-- 내가 등록한 강의 -->
        <div class="lecture-section">
          <h3>내가 등록한 강의</h3>
          <MyLectureSection />
        </div>
  
        <!-- 수강 중인 강의 -->
        <div class="lecture-section">
          <h3>수강 중인 강의</h3>
          <RentedLectureSection />
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref } from 'vue'
  import MyLectureSection from '@/components/lecture/MyLectures.vue'
  import RentedLectureSection from '@/components/lecture/RentedLectures.vue'
  import { useAuthStore } from '@/stores/auth-store'
  
  const authStore = useAuthStore()
  const email = ref(authStore.user?.email)
  </script>
  
  <style scoped>
  .mypage-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem;
  }
  
  .profile-section {
    background-color: white;
    padding: 2rem;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    margin-bottom: 2rem;
  }
  
  .profile-info h2 {
    margin: 0;
    color: #333;
  }
  
  .lectures-container {
    display: flex;
    flex-direction: column;
    gap: 2rem;
  }
  
  .lecture-section {
    background-color: white;
    padding: 2rem;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
  
  .lecture-section h3 {
    margin-top: 0;
    margin-bottom: 1.5rem;
    color: #333;
  }
  </style>