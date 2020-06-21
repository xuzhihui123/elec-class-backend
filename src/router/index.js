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
    icon: 'svg-name'             the icon show in the sidebar
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
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },
  {
    path: '/',
    component: Layout,
    redirect: '/home',
  },
  {
    path: '/home',
    component: Layout,
    meta: {title: '电子班牌', icon: 'example'},
    redirect: '/home/itemClass',
    children: [
      {
        path: 'itemClass',
        name: '班牌分类',
        component: () => import('@/views/itemClass/index'),
        meta: {title: '班牌分类', icon: 'class'},
      },
      {
        path: 'itemContent',
        name: '班牌内容',
        component: () => import('@/views/itemContent/index'),
        meta: {title: '班牌内容', icon: 'content'}
      },
      {
        path:'editItem/:id',
        component: () => import('@/views/editItem/index'),
        meta: {title: '编辑'},
        hidden:true
      },
      {
        path:'addItem',
        component:()=>import('@/views/addItem/index'),
        meta: {title: '添加'},
        hidden:true
      },
      {
        path:'editContent/:id',
        component:()=>import('@/views/editContent/index'),
        meta: {title: '编辑内容'},
        hidden:true
      },
      {
        path:'curriManage',
        name:'课程表管理',
        component:()=>import('@/views/curriManage/index'),
        meta: {title: '课程表管理',icon:'curri-icon'},
      },
      {
        path:'schoolNotice',
        name:'学校公告管理',
        component:()=>import('@/views/schoolNotice/index'),
        meta:{
          title:'学校公告管理',
          icon:'message'
        }
      },
      {
        path:'addSchoolNotice',
        name:'添加学校公告',
        component:()=>import('@/views/addSchoolNotice/index'),
        meta:{
          title:'添加学校公告'
        },
        hidden:true
      },
      {
        path:'editSchoolNotice/:id',
        name:'编辑学校公告',
        component:()=>import('@/views/editSchoolNotice/index'),
        meta:{
          title:'编辑学校公告'
        },
        hidden:true
      }
      // {
      //   path:'countDown',
      //   name:"倒计数配置",
      //   component:()=>import('@/views/countDown/index'),
      //   meta: {title: '倒计时配置',icon:'clock'},
      // }
    ]
  },
  // {
  //   path: '/form',
  //   component: Layout,
  //   children: [
  //     {
  //       path: 'index',
  //       name: 'Form',
  //       component: () => import('@/views/form/index'),
  //       meta: {title: 'Form', icon: 'form'}
  //     }
  //   ]
  // },

  // {
  //   path: '/nested',
  //   component: Layout,
  //   redirect: '/nested/menu1',
  //   name: 'Nested',
  //   meta: {
  //     title: 'Nested',
  //     icon: 'nested'
  //   },
  //   children: [
  //     {
  //       path: 'menu1',
  //       component: () => import('@/views/nested/menu1/index'), // Parent router-view
  //       name: 'Menu1',
  //       meta: {title: 'Menu1'},
  //       children: [
  //         {
  //           path: 'menu1-1',
  //           component: () => import('@/views/nested/menu1/menu1-1'),
  //           name: 'Menu1-1',
  //           meta: {title: 'Menu1-1'}
  //         },
  //         {
  //           path: 'menu1-2',
  //           component: () => import('@/views/nested/menu1/menu1-2'),
  //           name: 'Menu1-2',
  //           meta: {title: 'Menu1-2'},
  //           children: [
  //             {
  //               path: 'menu1-2-1',
  //               component: () => import('@/views/nested/menu1/menu1-2/menu1-2-1'),
  //               name: 'Menu1-2-1',
  //               meta: {title: 'Menu1-2-1'}
  //             },
  //             {
  //               path: 'menu1-2-2',
  //               component: () => import('@/views/nested/menu1/menu1-2/menu1-2-2'),
  //               name: 'Menu1-2-2',
  //               meta: {title: 'Menu1-2-2'}
  //             }
  //           ]
  //         },
  //         {
  //           path: 'menu1-3',
  //           component: () => import('@/views/nested/menu1/menu1-3'),
  //           name: 'Menu1-3',
  //           meta: {title: 'Menu1-3'}
  //         }
  //       ]
  //     },
  //     {
  //       path: 'menu2',
  //       component: () => import('@/views/nested/menu2/index'),
  //       meta: {title: 'menu2'}
  //     }
  //   ]
  // },
  // 404 page must be placed at the end !!!
  {path: '*', redirect: '/404', hidden: true}
]

const createRouter = () => new Router({
  mode: 'history', // require service support
  scrollBehavior: () => ({y: 0}),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
