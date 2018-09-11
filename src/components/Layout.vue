<template>
  <a-layout class="layout">
    <a-layout-header class="header">
      <div class="logo" @click="handleNavRoute({key: '/'})">Job Here</div>
      <a-menu
        theme="dark"
        mode="horizontal"
        :selectedKeys="[]"
        :style="{ lineHeight: '64px', float: 'right' }"
      >
        <a-menu-item key="1">Hello, {{window.user.username}}</a-menu-item>
        <a-menu-item key="2"><a href="javascript:void(0)" v-on:click="logout"> Exit</a></a-menu-item>
      </a-menu>
    </a-layout-header>
    <a-layout>
      <a-layout-sider width="200" style="background: #fff">
        <a-menu
          mode="inline"
          :selectedKeys="[$route.path]"
          :defaultOpenKeys="routes.map(o => o.path)"
          :style="{ height: '100%', borderRight: 0 }"
          @click="handleNavRoute"
        >
          <template v-for="route in routes" v-if="checkVisible(route)">
            <template v-if="route.children && route.children.filter(o => !o.hidden).length > 0">
              <template v-if="route.children.filter(o => !o.hidden).length === 1">
                <a-menu-item
                  v-for="sub in route.children.filter(o => !o.hidden)"
                  :key="`/${route.path}/${sub.path}`"
                >{{sub.name}}</a-menu-item>
              </template>
              <template v-else>
                <a-sub-menu :key="route.path">
                  <span slot="title">{{route.name}}</span>
                  <a-menu-item
                    v-for="sub in route.children.filter(o => !o.hidden)"
                    :key="`/${route.path}/${sub.path}`"
                  >{{sub.name}}</a-menu-item>
                </a-sub-menu>
              </template>
            </template>
            <template v-else>
              <a-menu-item :key="'/' + route.path">{{route.name}}</a-menu-item>
            </template>
          </template>
        </a-menu>
      </a-layout-sider>
      <a-layout style="padding: 0 24px 24px">
        <a-breadcrumb style="margin: 16px 0">
          <a-breadcrumb-item v-for="(bread, idx) in breads" :key="idx">
            <a @click="handleBreadRoute(idx)">{{bread.name}}</a>
          </a-breadcrumb-item>
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
    let pageHistories = localStorage.getItem('page-history')
    try {
      pageHistories = JSON.parse(pageHistories)
      if (!(pageHistories instanceof Array)) {
        pageHistories = []
      }
    } catch (e) {
      pageHistories = []
    }
    return {
      routes,
      menus: [],
      pageHistories
    }
  },
  computed: {
    breads () {
      return [
        {name: 'Home', to: '/'},
        ...this.pageHistories
      ]
    }
  },
  watch: {
    $route () {
      this.pageHistories.push({
        name: this.$route.name,
        to: this.$route.path
      })
    },
    pageHistories () {
      localStorage.setItem('page-history', JSON.stringify(this.pageHistories))
    }
  },
  created () {
    this.$fetchUser().then(r => {
      if (r.data.role === 'hr-n') {
        this.$router.push('/black')
      }
    })
  },
  methods: {
    handleNavRoute (e) {
      if (this.$route.path !== e.key) {
        this.pageHistories = []
      }
      this.$router.push(e.key)
    },
    handleBreadRoute (idx) {
      if (idx === 0) { // Home
        this.pageHistories = []
        this.$router.push('/')
      } else if (idx === this.pageHistories.length) { // current
      } else {
        const route = this.pageHistories[idx - 1]
        this.pageHistories = this.pageHistories.slice(0, idx - 1)
        this.$router.push(route.to)
      }
    },
    logout () {
      localStorage.removeItem('token')
      window.user = {}
      this.$router.push('/login')
    },
    checkVisible (route) {
      if (route.hidden === true) {
        return false
      }
      if (window.user === undefined || window.user.role === undefined) {
        return false
      }
      return this.$roleMap[window.user.role].indexOf(route.name) !== -1
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
  li{
    user-select: none;
    -moz-user-select: none;
  }
</style>
