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
    redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      name: 'Dashboard',
      component: () => import('@/views/dashboard/index'),
      meta: { title: '首页', icon: 'dashboard' }
    }]
  },
   // 检测仪管理
   {
    path: '/Device',
    component: Layout,
    redirect: '/Device/DeviceManage',
    name: 'Device',
    meta: { title: '检测仪管理', icon: 'el-icon-notebook-2' },
    children: [
      {
        path: 'DeviceManage',
        name: 'DeviceManage',
        component: () => import('@/views/device/index'),
        meta: { title: '检测仪登记', icon: 'list' }
      },
      {
        path: 'Agent',
        name: 'Agent',
        component: () => import('@/views/agent/index'),
        meta: { title: '经销商管理', icon: 'example' }
      },
      {
        path: 'RepairShop',
        name: 'RepairShop',
        component: () => import('@/views/repairshop/index'),
        meta: { title: '维修店管理', icon: 'example' }
      },
      
      {
        path: 'DeviceAppFile',
        name: 'DeviceAppFile',
        component: () => import('@/views/deviceAppFile/index'),
        meta: { title: 'APP软件管理', icon: 'example' }
      },
      {
        path: 'VciSoftWare',
        name: 'VciSoftWare',
        component: () => import('@/views/deviceVciFile/index'),
        meta: { title: 'VCI软件管理', icon: 'example' }
      },
      {
        path: 'DeviceUpdate',
        name: 'DeviceUpdate',
        component: () => import('@/views/table/index'),
        meta: { title: '检测仪更新日志', icon: 'example' }
      },


    ]
  },
     // 零件管理
     {
      path: '/part',
      component: Layout,
      redirect: '/part/partcategory',
      name: 'Part',
      meta: { title: '系统管理', icon: 'el-icon-notebook-2' },
      children: [
        {
          path: 'VehicleSeries',
          name: 'VehicleSeries',
          component: () => import('@/views/vehicleSeries/index'),
          meta: { title: '车系管理', icon: 'list' }
        },
        {
          path: 'partcategory',
          name: 'Partcategory',
          component: () => import('@/views/partCategory/index'),
          meta: { title: '系统模块', icon: 'list' }
        },
        {
          path: 'vspartcategory',
          name: 'VSPartcategory',
          component: () => import('@/views/vsPartCategory/index'),
          meta: { title: '车系系统', icon: 'list' }
        },
        {
          path: 'vsPartCategorySoftWare',
          name: 'vsPartCategorySoftWare',
          component: () => import('@/views/vsPartCategorySoftWare/index'),
          meta: { title: '系统软件', icon: 'list' }
        },
        
        {
          path: 'part',
          name: 'PartManage',
          component: () => import('@/views/part/index'),
          meta: { title: '零件管理', icon: 'example' }
        },
        {
          path: 'partsoftware',
          name: 'PartSoftWare',
          component: () => import('@/views/partSoftWare/index'),
          meta: { title: '软件管理', icon: 'example' }
        },
 
        {
          path: 'partFile',
          name: 'partFile',
          component: () => import('@/views/partFile/index'),
          meta: { title: '文件管理', icon: 'table' }
        },
        {
          path: 'partsoftwaredaily',
          name: 'PartsoftWareDaily',
          component: () => import('@/views/table/index'),
          meta: { title: '升级日志', icon: 'example' }
        },
  
      ]
    },
    // 车辆管理
    {
      path: '/vehicle',
      component: Layout,
      redirect: '/vehicle/VehicleSeries',
      name: 'Vehicle',
      meta: { title: '车辆管理', icon: 'el-icon-notebook-2' },
      children: [
        {
          path: 'VehicleSeries',
          name: 'VehicleSeries',
          component: () => import('@/views/vehicleSeries/index'),
          meta: { title: '车系管理', icon: 'list' }
        },
        {
          path: 'VehicleModel',
          name: 'VehicleModel',
          component: () => import('@/views/vehicleModel/index'),
          meta: { title: '车型管理', icon: 'example' }
        },
        {
          path: 'VehiclePart',
          name: 'VehiclePart',
          component: () => import('@/views/vehiclePart/index'),
          meta: { title: '车型零件', icon: 'table' }
        },
        {
          path: 'VehicleConfig',
          name: 'VehicleConfig',
          component: () => import('@/views/vehicleConfig/index'),
          meta: { title: '车型配置', icon: 'example' }
        },
        {
          path: 'VehiclePart2',
          name: 'VehiclePart2',
          component: () => import('@/views/vehiclePart2/index'),
          meta: { title: '车型配置零件', icon: 'table' }
        },
        
        {
          path: 'vehicleManage',
          name: 'VehicleManage',
          component: () => import('@/views/vehicle/index'),
          meta: { title: '车辆管理', icon: 'table' }
        },  
        // {
        //   path: 'vehicleFiles1',
        //   name: 'VehicleFiles1',
        //   component: () => import('@/views/tree/index'),
        //   meta: { title: '文件管理', icon: 'table' }
        // }
      ]
    },
    // 故障管理
    {
      path: '/Fault',
      component: Layout,
      redirect: '/Fault/FaultCategory',
      name: 'Fault',
      meta: { title: '故障管理', icon: 'el-icon-notebook-2' },
      children: [
        {
          path: 'FaultCategory',
          name: 'FaultCategory',
          component: () => import('@/views/faultCategory/index'),
          meta: { title: '故障类型', icon: 'list' }
        },
        {
          path: 'FaultManage',
          name: 'FaultManage',
          component: () => import('@/views/fault/index'),
          meta: { title: '故障管理', icon: 'example' }
        },
        // {
        //   path: 'FaultRepairManual',
        //   name: 'FaultRepairManual',
        //   component: () => import('@/views/tree/index'),
        //   meta: { title: '维修手册', icon: 'table' }
        // },
        // {
        //   path: 'FaultPart',
        //   name: 'FaultPart',
        //   component: () => import('@/views/tree/index'),
        //   meta: { title: '零件故障', icon: 'table' }
        // }  
      ]
    },
   // 检测日志管理
   {
    path: '/Test',
    component: Layout,
    redirect: '/Test/TestLog',
    name: 'Test',
    meta: { title: '检测日志管理', icon: 'el-icon-notebook-2' },
    children: [
      {
        path: 'TestLog',
        name: 'TestLog',
        component: () => import('@/views/tree/index'),
        meta: { title: '检测日志', icon: 'list' }
      },
    ]
  },
  // 系统管理
  {
    path: '/system',
    component: Layout,
    redirect: '/system/user',
    name: 'System',
    meta: { title: '系统管理', icon: 'el-icon-notebook-2' },
    children: [
      {
        path: 'user',
        name: 'User',
        component: () => import('@/views/user/index'),
        meta: { title: '用户管理', icon: 'example' }
      },
      {
        path: 'role',
        name: 'Role',
        component: () => import('@/views/role/index'),
        meta: { title: '角色管理', icon: 'list' }
      },
      {
        path: 'menu',
        name: 'Menu',
        component: () => import('@/views/menu/index'),
        meta: { title: '菜单管理', icon: 'table' }
      }
    ]
  },
  // // 博客管理
  // {
  //   path: '/blog',
  //   component: Layout,
  //   redirect: '/blog/article',
  //   name: 'Blog',
  //   meta: { title: '博客管理', icon: 'el-icon-notebook-2' },
  //   children: [
  //     {
  //       path: 'category',
  //       name: 'Category',
  //       component: () => import('@/views/tree/index'),
  //       meta: { title: '类别管理', icon: 'list' }
  //     },
  //     {
  //       path: 'article',
  //       name: 'Article',
  //       component: () => import('@/views/table/index'),
  //       meta: { title: '文章管理', icon: 'example' }
  //     },

  //     {
  //       path: 'lable',
  //       name: 'Lable',
  //       component: () => import('@/views/tree/index'),
  //       meta: { title: '标签管理', icon: 'table' }
  //     }
  //   ]
  // },
  // //广告管理
  // {
  //   path: '/advert',
  //   component: Layout,
  //   children: [
  //     {
  //       path: 'advert',
  //       name: 'Advert',
  //       component: () => import('@/views/advert/index'),
  //       meta: { title: '广告管理', icon: 'form' }
  //     }
  //   ]
  // }, 
  // {
  //   path: '/example',
  //   component: Layout,
  //   redirect: '/example/table',
  //   name: 'Example',
  //   meta: { title: 'Example', icon: 'el-icon-s-help' },
  //   children: [
  //     {
  //       path: 'table',
  //       name: 'Table',
  //       component: () => import('@/views/table/index'),
  //       meta: { title: 'Table', icon: 'table' }
  //     },
  //     {
  //       path: 'tree',
  //       name: 'Tree',
  //       component: () => import('@/views/tree/index'),
  //       meta: { title: 'Tree', icon: 'tree' }
  //     }
  //   ]
  // },

  // {
  //   path: '/form',
  //   component: Layout,
  //   children: [
  //     {
  //       path: 'index',
  //       name: 'Form',
  //       component: () => import('@/views/form/index'),
  //       meta: { title: 'Form', icon: 'form' }
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
  //       meta: { title: 'Menu1' },
  //       children: [
  //         {
  //           path: 'menu1-1',
  //           component: () => import('@/views/nested/menu1/menu1-1'),
  //           name: 'Menu1-1',
  //           meta: { title: 'Menu1-1' }
  //         },
  //         {
  //           path: 'menu1-2',
  //           component: () => import('@/views/nested/menu1/menu1-2'),
  //           name: 'Menu1-2',
  //           meta: { title: 'Menu1-2' },
  //           children: [
  //             {
  //               path: 'menu1-2-1',
  //               component: () => import('@/views/nested/menu1/menu1-2/menu1-2-1'),
  //               name: 'Menu1-2-1',
  //               meta: { title: 'Menu1-2-1' }
  //             },
  //             {
  //               path: 'menu1-2-2',
  //               component: () => import('@/views/nested/menu1/menu1-2/menu1-2-2'),
  //               name: 'Menu1-2-2',
  //               meta: { title: 'Menu1-2-2' }
  //             }
  //           ]
  //         },
  //         {
  //           path: 'menu1-3',
  //           component: () => import('@/views/nested/menu1/menu1-3'),
  //           name: 'Menu1-3',
  //           meta: { title: 'Menu1-3' }
  //         }
  //       ]
  //     },
  //     {
  //       path: 'menu2',
  //       component: () => import('@/views/nested/menu2/index'),
  //       name: 'Menu2',
  //       meta: { title: 'menu2' }
  //     }
  //   ]
  // },

  // {
  //   path: 'external-link',
  //   component: Layout,
  //   children: [
  //     {
  //       path: 'https://panjiachen.github.io/vue-element-admin-site/#/',
  //       meta: { title: 'External Link', icon: 'link' }
  //     }
  //   ]
  // },

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
