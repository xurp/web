<template>
  <a-layout class="layout">
    <a-layout-header class="header">
      <div class="logo" @click="$router.push('/')">Job Here</div>
      <a-menu
        theme="dark"
        mode="horizontal"
        :defaultSelectedKeys="['2']"
        :style="{ lineHeight: '64px', float: 'right' }"
      >
        <a-menu-item key="1">Hello, {{window.user.username}}</a-menu-item>
        <a-menu-item key="2">Exit</a-menu-item>
      </a-menu>
    </a-layout-header>
    <a-layout>
      <a-layout-sider width="200" style="background: #fff">
        <a-menu
          mode="inline"
          :selectedKeys="[$route.path]"
          :defaultOpenKeys="routes.map(o => o.path)"
          :style="{ height: '100%', borderRight: 0 }"
          @click="handleRoute"
        >
          <template v-for="route in routes">
            <template v-if="route.children">
              <a-sub-menu :key="route.path">
                <span slot="title">{{route.name}}</span>
                <a-menu-item
                  v-for="sub in route.children"
                  :key="`/${route.path}/${sub.path}`"
                >{{sub.name}}</a-menu-item>
              </a-sub-menu>
            </template>
            <template v-else>
              <a-menu-item :key="'/' + route.path">{{route.name}}</a-menu-item>
            </template>
          </template>
        </a-menu>
      </a-layout-sider>
      <a-layout style="padding: 0 24px 24px">
        <a-breadcrumb style="margin: 16px 0">
          <a-breadcrumb-item>Home</a-breadcrumb-item>
          <a-breadcrumb-item>List</a-breadcrumb-item>
          <a-breadcrumb-item>App</a-breadcrumb-item>
        </a-breadcrumb>
        <a-layout-content :style="{ background: '#fff', padding: '24px', margin: 0, minHeight: '280px' }">
          <router-view/>
        </a-layout-content>
      </a-layout>
    </a-layout>
  </a-layout>
</template>

<script>
import { routes } from '../router'
export default {
  data () {
    return {
      routes
    }
  },
  created () {
    console.log(this.$route)
  },
  methods: {
    handleRoute (e) {
      this.$router.push(e.key)
    }
  }
}
</script>

<style lang="less">
  .layout {
    height: 100vh;
    .logo {
      color: white;
      display: inline-block;
      width: 200px;
      line-height: 64px;
      margin-left: -50px;
      text-align: center;
      cursor: pointer;
    }
  }
</style>
