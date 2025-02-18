export default [
  {
    path: '/lectures/create',
    name: 'lectureCreate',
    component: () => import('@/views/lecture/LectureCreate.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/lecture/:id',
    name: 'LectureDetail',
    component: () => import('@/views/lecture/LectureDetailView.vue'),
    meta: { requiresAuth: true }
  }
  // 나중에 다른 라우트들 추가 예정
  // {
  //   path: '/lectures',
  //   name: 'lectures',
  //   component: () => import('@/views/lectures/index.vue')
  // },
  // {
  //   path: '/lectures/:id',
  //   name: 'lectureShow',
  //   component: () => import('@/views/lectures/Show.vue')
  // }
]