<template>
    <div class="mypage-container">
      <!-- 프로필 섹션 -->
      <div class="profile-section">
        <div class="profile-info">
          <h2>마이페이지</h2>
          <p>{{ email }}</p>
        </div>
      </div>
  
      <!-- 메뉴 섹션 추가 -->
      <div class="menu-section">
        <router-link to="/payment/history" class="menu-item">
          <div class="menu-text">
            <h3>결제 내역</h3>
            <p>강의 구매 내역을 확인합니다</p>
          </div>
          <div class="menu-arrow">
            <i class="fas fa-chevron-right"></i>
          </div>
        </router-link>
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
  
  .menu-section {
    margin-top: 2rem;
    border-top: 1px solid #eee;
  }
  
  .menu-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1.5rem;
    border-bottom: 1px solid #eee;
    text-decoration: none;
    color: inherit;
    transition: background-color 0.2s;
  }
  
  .menu-item:hover {
    background-color: #f8f9fa;
  }
  
  .menu-text h3 {
    margin: 0;
    font-size: 1.1rem;
    color: #333;
  }
  
  .menu-text p {
    margin: 0.5rem 0 0;
    font-size: 0.9rem;
    color: #666;
  }
  
  .menu-arrow {
    color: #999;
  }
  </style>