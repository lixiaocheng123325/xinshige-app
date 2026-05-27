<template>
  <el-container class="layout">
    <el-aside width="200px" class="aside">
      <div class="logo">心事盒后台</div>
      <el-menu :default-active="$route.path" router class="menu" background-color="#001529" text-color="#fff">
        <el-menu-item index="/dashboard"><el-icon><DataLine /></el-icon>数据概览</el-menu-item>
        <el-menu-item index="/users"><el-icon><User /></el-icon>用户管理</el-menu-item>
        <el-menu-item index="/notes"><el-icon><Document /></el-icon>笔记管理</el-menu-item>
        <el-menu-item index="/orders"><el-icon><Money /></el-icon>订单管理</el-menu-item>
        <el-menu-item index="/withdrawals"><el-icon><Wallet /></el-icon>提现审核</el-menu-item>
      </el-menu>
    </el-aside>
    <el-container>
      <el-header class="header">
        <div style="flex:1"></div>
        <el-dropdown @command="handleCommand">
          <span>{{ auth.admin?.username }} <el-icon><ArrowDown /></el-icon></span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item command="logout">退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </el-header>
      <el-main class="main"><router-view /></el-main>
    </el-container>
  </el-container>
</template>

<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '../../stores/auth'
const route = useRoute()
const router = useRouter()
const auth = useAuthStore()

const handleCommand = (cmd: string) => {
  if (cmd === 'logout') {
    auth.logout()
    router.push('/login')
  }
}
</script>

<style scoped>
.layout { height: 100vh; }
.aside { background: #001529; }
.logo { height: 60px; line-height: 60px; text-align: center; color: #fff; font-size: 18px; font-weight: bold; border-bottom: 1px solid rgba(255,255,255,0.1); }
.menu { border-right: none; }
.header { display: flex; align-items: center; background: #fff; box-shadow: 0 1px 4px rgba(0,0,0,0.1); }
.main { background: #f5f5f5; padding: 20px; }
</style>
