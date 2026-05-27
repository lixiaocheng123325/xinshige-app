<template>
  <div>
    <el-card>
      <template #header>用户管理</template>
      <el-form :inline="true" @submit.prevent="loadData">
        <el-form-item>
          <el-input v-model="query.keyword" placeholder="手机号/昵称" clearable />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="loadData">搜索</el-button>
        </el-form-item>
      </el-form>
      <el-table :data="list" v-loading="loading">
        <el-table-column prop="phone" label="手机号" />
        <el-table-column prop="nickname" label="昵称" />
        <el-table-column prop="balance" label="余额(分)" />
        <el-table-column prop="isActive" label="状态">
          <template #default="{row}"><el-tag :type="row.isActive?'success':'danger'">{{ row.isActive?'正常':'禁用' }}</el-tag></template>
        </el-table-column>
        <el-table-column label="操作" width="120">
          <template #default="{row}">
            <el-button size="small" :type="row.isActive?'danger':'success'" @click="toggleStatus(row)">{{ row.isActive?'禁用':'启用' }}</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination v-model:current-page="query.page" :page-size="query.limit" :total="total" @current-change="loadData" layout="total, prev, pager, next" />
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import request from '../../api/request'

const list = ref([])
const total = ref(0)
const loading = ref(false)
const query = reactive({ page: 1, limit: 20, keyword: '' })

const loadData = async () => {
  loading.value = true
  const res: any = await request.get('/admin/users', { params: query })
  list.value = res.items
  total.value = res.total
  loading.value = false
}

const toggleStatus = async (row: any) => {
  await request.put(`/admin/users/${row.id}/status`, { isActive: !row.isActive })
  ElMessage.success('操作成功')
  loadData()
}

onMounted(loadData)
</script>
