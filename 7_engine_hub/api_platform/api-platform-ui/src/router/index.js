import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },
  {
    path: '/',
    component: Layout,
    children: [
      {
        path: 'index',
        component: () => import('@/views/ocr/index'),
        name: 'inference',
        meta: { title: '自由文本识别', icon: 'el-icon-picture' }
      }
    ]
  },
  {
    path: '/detection',
    component: Layout,
    children: [
      {
        path: 'detection',
        component: () => import('@/views/face/detection'),
        name: 'detection',
        meta: { title: '人脸检测', icon: 'el-icon-picture' }
      }
    ]
  },
  {
    path: '/feature',
    component: Layout,
    children: [
      {
        path: 'feature',
        component: () => import('@/views/face/feature'),
        name: 'feature',
        meta: { title: '人脸特征提取', icon: 'el-icon-picture' }
      }
    ]
  },
  {
    path: '/comparison',
    component: Layout,
    children: [
      {
        path: 'comparison',
        component: () => import('@/views/face/comparison'),
        name: 'comparison',
        meta: { title: '人脸比对 (1:1)', icon: 'el-icon-picture' }
      }
    ]
  },
  {
    path: '/fire-smoke-detect',
    component: Layout,
    children: [
      {
        path: 'fire-smoke-detect',
        component: () => import('@/views/hub/fire-smoke-detect'),
        name: 'fire-smoke-detect',
        meta: { title: '烟火检测', icon: 'el-icon-picture' }
      }
    ]
  },
  {
    path: '/helmet-detection',
    component: Layout,
    children: [
      {
        path: 'helmet-detection',
        component: () => import('@/views/hub/helmet-detection'),
        name: 'helmet-detection',
        meta: { title: '安全帽检测', icon: 'el-icon-picture' }
      }
    ]
  },
  {
    path: '/oral-detection',
    component: Layout,
    children: [
      {
        path: 'oral-detection',
        component: () => import('@/views/hub/oral-detection'),
        name: 'oral-detection',
        meta: { title: '口咽检测', icon: 'el-icon-picture' },
        // hidden: true
      }
    ]
  },
  {
    path: '/speech-asr',
    component: Layout,
    children: [
      {
        path: 'speech-asr',
        component: () => import('@/views/hub/speech-asr'),
        name: 'speech-asr',
        meta: { title: '语音识别', icon: 'el-icon-picture' },
      }
    ]
  },
  {
    path: '/speech-tts',
    component: Layout,
    children: [
      {
        path: 'speech-tts',
        component: () => import('@/views/hub/speech-tts'),
        name: 'speech-tts',
        meta: { title: '语音合成', icon: 'el-icon-picture' },
      }
    ]
  },
  {
  path: '/audio',
  component: Layout,
  children: [
    {
      path: 'audio',
      component: () => import('@/views/hub/audio'),
      name: 'audio',
      meta: { title: '录音', icon: 'el-icon-picture' },
    }
  ]
},
  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
