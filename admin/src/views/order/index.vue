<template>
  <div>
    <el-card>
      <template #header>订单管理</template>
      <el-table :data="list" v-loading="loading">
        <el-table-column prop="id" label="订单ID" width="220" />
        <el-table-column prop="type" label="类型" />
        <el-table-column prop="amount" label="金额(分)" />
        <el-table-column prop="status" label="状态" />
        <el-table-column prop="createdAt" label="时间" />
      </el-table>
      <el-pagination v-model:current-page="query.page" :page-size="query.limit" :total="total" @current-change="loadData" layout="total, prev, pager, next" />
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, onMounted } from 'vue'
import request from '../../api/request'

const list = ref([])
const total = ref(0)
const loading = ref(false)
const query = reactive({ page: 1, limit: 20 })

const loadData = async () => {
  loading.value = true
  const res: any = await request.get('/admin/orders', { params: query })
  list.value = res.items
  total.value = res.total
  loading.value = false
}

onMounted(loadData)
</script>
