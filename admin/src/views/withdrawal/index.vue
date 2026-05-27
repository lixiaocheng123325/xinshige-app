<template>
  <div>
    <el-card>
      <template #header>提现审核</template>
      <el-form :inline="true">
        <el-form-item>
          <el-select v-model="query.status" placeholder="状态" clearable @change="loadData">
            <el-option label="待审核" value="pending" />
            <el-option label="已通过" value="approved" />
            <el-option label="已拒绝" value="rejected" />
          </el-select>
        </el-form-item>
      </el-form>
      <el-table :data="list" v-loading="loading">
        <el-table-column prop="user.nickname" label="用户" />
        <el-table-column prop="amount" label="金额(分)" />
        <el-table-column prop="accountName" label="收款人" />
        <el-table-column prop="accountNumber" label="账号" />
        <el-table-column prop="status" label="状态">
          <template #default="{row}">
            <el-tag :type="row.status==='pending'?'warning':row.status==='approved'?'success':'danger'">{{ row.status }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180">
          <template #default="{row}">
            <template v-if="row.status==='pending'">
              <el-button size="small" type="success" @click="review(row, 'approved')">通过</el-button>
              <el-button size="small" type="danger" @click="review(row, 'rejected')">拒绝</el-button>
            </template>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination v-model:current-page="query.page" :page-size="query.limit" :total="total" @current-change="loadData" layout="total, prev, pager, next" />
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import request from '../../api/request'

const list = ref([])
const total = ref(0)
const loading = ref(false)
const query = reactive({ page: 1, limit: 20, status: '' })

const loadData = async () => {
  loading.value = true
  const res: any = await request.get('/admin/withdrawals', { params: query })
  list.value = res.items
  total.value = res.total
  loading.value = false
}

const review = async (row: any, status: string) => {
  await ElMessageBox.confirm(`确定要${status==='approved'?'通过':'拒绝'}该提现申请吗？`, '确认')
  await request.put(`/admin/withdrawals/${row.id}`, { status })
  ElMessage.success('操作成功')
  loadData()
}

onMounted(loadData)
</script>
