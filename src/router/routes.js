
const routes = [
  {
    path: '/',
    component: () => import('layouts/WelcomePage.vue'),
    children: [
      {
        path: '',
        component: () => import('pages/Login/WelcomePage.vue')
      }
    ]
  },
  {
    path: '/Login',
    component: () => import('layouts/Login.vue'),
    children: [
      {
        path: '',
        component: () => import('pages/Login/LoginIndex.vue')
      }
    ]
  },
  {
    path: '/Administration',
    component: () => import('layouts/SiriusSystem.vue'),
    meta: { auth: true },
    children: [
      {
        path: '/homes',
        meta: { auth: true },
        component: () => import('pages/SiriusSystem/HomeIndex.vue')
      },
      {
        path: '/rooms',
        meta: { auth: true },
        component: () => import('pages/SiriusSystem/RoomIndex.vue')
      },
      {
        path: '/devices',
        meta: { auth: true },
        component: () => import('pages/SiriusSystem/DeviceIndex.vue')
      },
      {
        path: '/charts',
        meta: { auth: true },
        component: () => import('pages/SiriusSystem/MeasureIndex.vue')
      }
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '*',
    component: () => import('pages/Error404.vue')
  }
]

export default routes
