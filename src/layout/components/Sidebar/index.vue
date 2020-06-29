<template>
  <div :class="{'has-logo':showLogo}">
    <logo v-if="showLogo" :collapse="isCollapse" />
    <el-scrollbar wrap-class="scrollbar-wrapper">
      <el-menu
        :default-active="activeMenu"
        :collapse="isCollapse"
        :background-color="variables.menuBg"
        :text-color="variables.menuText"
        :unique-opened="false"
        :active-text-color="variables.menuActiveText"
        :collapse-transition="false"
        mode="vertical"
      >
        <sidebar-item
          v-for="route in routes"
          :key="route.path"
          :item="route"
          :base-path="route.path"
        />
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import Logo from "./Logo";
import SidebarItem from "./SidebarItem";
import variables from "@/styles/variables.scss";

import Layout from "../../index";

export default {
  components: { SidebarItem, Logo },
  computed: {
    ...mapGetters(["sidebar"]),
    routes() {
      let routes = [];
      if (localStorage.getItem("Cn")) {
        routes = [
          {
            path: "/login",
            component: () => import("@/views/login/index"),
            hidden: true
          },
          {
            path: "/404",
            component: () => import("@/views/404"),
            hidden: true
          },
          {
            path: "/",
            component: Layout,
            redirect: "/home"
          },
          {
            path: "/home",
            component: Layout,
            meta: {
              title: "电子班牌",
              icon: "example"
            },
            redirect: "/home/itemClass",
            children: [
              {
                path: "itemClass",
                name: "班牌分类",
                component: () => import("@/views/itemClass/index"),
                meta: {
                  title: "班牌分类",
                  icon: "class"
                }
              },
              {
                path: "itemContent",
                name: "班牌内容",
                component: () => import("@/views/itemContent/index"),
                meta: {
                  title: "班牌内容",
                  icon: "content"
                }
              },
              {
                path: "editItem/:id",
                component: () => import("@/views/editItem/index"),
                meta: {
                  title: "编辑"
                },
                hidden: true
              },
              {
                path: "addItem",
                component: () => import("@/views/addItem/index"),
                meta: {
                  title: "添加"
                },
                hidden: true
              },
              {
                path: "editContent/:id",
                component: () => import("@/views/editContent/index"),
                meta: {
                  title: "编辑内容"
                },
                hidden: true
              },
              {
                path: "curriManage",
                name: "课程表管理",
                component: () => import("@/views/curriManage/index"),
                meta: {
                  title: "课程表管理",
                  icon: "curri-icon"
                }
              }
            ]
          },
          // 404 page must be placed at the end !!!
          {
            path: "*",
            redirect: "/404",
            hidden: true
          }
        ];
      }
      if (localStorage.getItem("Sn")) {
        routes = [
          {
            path: "/login",
            component: () => import("@/views/login/index"),
            hidden: true
          },
          {
            path: "/404",
            component: () => import("@/views/404"),
            hidden: true
          },
          {
            path: "/",
            component: Layout,
            redirect: "/home"
          },
          {
            path: "/home",
            component: Layout,
            meta: {
              title: "电子班牌",
              icon: "example"
            },
            redirect: "/home/schoolNotice",
            children: [
              {
                path: "schoolNotice",
                name: "学校公告管理",
                component: () => import("@/views/schoolNotice/index"),
                meta: {
                  title: "学校公告管理",
                  icon: "message",
                  roles: ["super_admin"]
                }
              },
              {
                path: "addSchoolNotice",
                name: "添加学校公告",
                component: () => import("@/views/addSchoolNotice/index"),
                meta: {
                  title: "添加学校公告",
                  roles: ["super_admin"]
                },
                hidden: true
              },
              {
                path: "editSchoolNotice/:id",
                name: "编辑学校公告",
                component: () => import("@/views/editSchoolNotice/index"),
                meta: {
                  title: "编辑学校公告",
                  roles: ["super_admin"]
                },
                hidden: true
              }
            ]
          },
          // 404 page must be placed at the end !!!
          {
            path: "*",
            redirect: "/404",
            hidden: true
          }
        ];
      }
      return routes;
    },
    activeMenu() {
      const route = this.$route;
      const { meta, path } = route;
      // if set path, the sidebar will highlight the path you set
      if (meta.activeMenu) {
        return meta.activeMenu;
      }
      return path;
    },
    showLogo() {
      return this.$store.state.settings.sidebarLogo;
    },
    variables() {
      return variables;
    },
    isCollapse() {
      return !this.sidebar.opened;
    }
  }
};
</script>
