<template>
  <div>
    <el-row :gutter="16">
      <el-col :span="8"><el-statistic title="今日新增用户" :value="stats.newUsersToday" /></el-col>
      <el-col :span="8"><el-statistic title="今日订单金额(分)" :value="stats.todayRevenue" /></el-col>
      <el-col :span="8"><el-statistic title="待审核提现" :value="stats.pendingWithdrawals" /></el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import request from '../../api/request'

const stats = ref({ newUsersToday: 0, todayRevenue: 0, pendingWithdrawals: 0 })

onMounted(async () => {
  const res: any = await request.get('/admin/dashboard')
  stats.value = res
})
</script>
