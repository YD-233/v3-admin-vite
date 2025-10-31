<script setup lang="ts">
import type { FormInstance, FormRules } from "element-plus"
import type { CreateListenerRequest, ListenerData } from "./apis"
import { usePagination } from "@@/composables/usePagination"
import { CirclePlus, Delete, RefreshRight } from "@element-plus/icons-vue"
import { ElMessage, ElMessageBox } from "element-plus"
import { cloneDeep } from "lodash-es"

import { reactive, ref, watch } from "vue"
import { changeHttpsListenerStatus, createHttpsListener, deleteHttpsListener, getHttpsListeners } from "./apis"

defineOptions({
  name: "Listener"
})

const loading = ref<boolean>(false)
const batchLoading = ref<boolean>(false)
const isEditMode = ref<boolean>(false)
const { paginationData, handleCurrentChange, handleSizeChange } = usePagination()

// 表格数据
const tableData = ref<ListenerData[]>([])
const selectedRows = ref<ListenerData[]>([])

// 对话框
const dialogVisible = ref<boolean>(false)
const formRef = ref<FormInstance | undefined>()

// 默认表单数据
const DEFAULT_FORM_DATA: CreateListenerRequest = {
  name: "",
  description: "",
  listenAddress: "",
  externalAddress: "",
  heartBeatTime: 60,
  timeout: 300,
  isEnable: true
}

const formData = ref<CreateListenerRequest>(cloneDeep(DEFAULT_FORM_DATA))

// 表单校验规则
const formRules: FormRules<CreateListenerRequest> = reactive({
  name: [
    { required: true, message: "请输入监听器名称", trigger: "blur" },
    { min: 1, max: 50, message: "名称长度应在1-50个字符之间", trigger: "blur" }
  ],
  description: [
    { required: true, message: "请输入监听器描述", trigger: "blur" },
    { min: 1, max: 200, message: "描述长度应在1-200个字符之间", trigger: "blur" }
  ],
  listenAddress: [
    { required: true, message: "请输入监听地址", trigger: "blur" },
    {
      pattern: /^(\d{1,3}\.){3}\d{1,3}:\d{1,5}$/,
      message: "请输入正确的IP:端口格式",
      trigger: "blur"
    }
  ],
  externalAddress: [
    { required: true, message: "请输入外网连接地址", trigger: "blur" },
    {
      pattern: /^https?:\/\/.+/,
      message: "请输入正确的URL格式",
      trigger: "blur"
    }
  ],
  heartBeatTime: [
    { required: true, message: "请输入心跳时间", trigger: "blur" },
    { type: "number", min: 1, max: 3600, message: "心跳时间应在1-3600秒之间", trigger: "blur" }
  ],
  timeout: [
    { required: true, message: "请输入超时阈值", trigger: "blur" },
    { type: "number", min: 1, max: 3600, message: "超时阈值应在1-3600秒之间", trigger: "blur" }
  ]
})

// 选择变化
function handleSelectionChange(selection: ListenerData[]) {
  selectedRows.value = selection
}

// 新增
function handleAdd() {
  resetForm()
  dialogVisible.value = true
}

// 新增/修改
function handleCreateOrUpdate() {
  formRef.value?.validate((valid: boolean, fields) => {
    if (!valid) {
      console.error("表单校验失败", fields)
      return
    }

    if (isEditMode.value) {
      ElMessage.warning("暂不支持更新操作")
      return
    }

    loading.value = true
    const api = createHttpsListener
    api(formData.value)
      .then((response) => {
        if (response) {
          ElMessage.success("新增成功")
          dialogVisible.value = false
          getTableData()
        } else {
          ElMessage.error("操作失败")
        }
      })
      .catch((error) => {
        console.error("API调用失败:", error)
        ElMessage.error(error?.message || "操作失败")
      })
      .finally(() => {
        loading.value = false
      })
  })
}

// 删除
function handleDelete(row: ListenerData) {
  ElMessageBox.confirm(`正在删除监听器：${row.name}，确认删除？`, "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning"
  }).then(() => {
    if (!row.uuid) {
      ElMessage.error("监听器ID不存在")
      return
    }
    deleteHttpsListener(row.uuid).then((_response) => {
      ElMessage.success("删除成功")
      getTableData()
    }).catch((error) => {
      console.error("删除失败:", error)
      ElMessage.error(error?.message || "删除失败")
    })
  }).catch(() => {
    ElMessage.info("已取消删除")
  })
}

// 批量删除
function handleBatchDelete() {
  if (selectedRows.value.length === 0) {
    ElMessage.warning("请选择要删除的监听器")
    return
  }

  ElMessageBox.confirm(`确认删除选中的 ${selectedRows.value.length} 个监听器？`, "批量删除", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning"
  }).then(() => {
    batchLoading.value = true
    const deletePromises = selectedRows.value
      .filter(row => row.uuid)
      .map(row => deleteHttpsListener(row.uuid!))

    Promise.allSettled(deletePromises)
      .then((results) => {
        const successCount = results.filter(result => result.status === "fulfilled").length
        const failCount = results.length - successCount

        if (failCount === 0) {
          ElMessage.success(`成功删除 ${successCount} 个监听器`)
        } else {
          ElMessage.warning(`删除完成：成功 ${successCount} 个，失败 ${failCount} 个`)
        }

        getTableData()
        selectedRows.value = []
      })
      .catch((error) => {
        console.error("批量删除失败:", error)
        ElMessage.error("批量删除失败")
      })
      .finally(() => {
        batchLoading.value = false
      })
  }).catch(() => {
    ElMessage.info("已取消删除")
  })
}

// 修改
function handleUpdate(_row: ListenerData) {
  isEditMode.value = true
  ElMessage.warning("暂不支持更新操作")
}

// 获取表格数据
function getTableData() {
  loading.value = true
  getHttpsListeners()
    .then((response) => {
      if (response && Array.isArray(response)) {
        tableData.value = response
        paginationData.total = response.length
      } else {
        tableData.value = []
        paginationData.total = 0
        ElMessage.error("获取数据失败：响应格式错误")
      }
    })
    .catch((error) => {
      console.error("获取表格数据失败:", error)
      ElMessage.error(error?.message || "获取数据失败")
      tableData.value = []
      paginationData.total = 0
    })
    .finally(() => {
      loading.value = false
    })
}

// 切换监听器状态
function toggleListener(row: ListenerData) {
  if (!row.uuid) {
    ElMessage.error("监听器ID不存在")
    return
  }

  const originalStatus = !row.isEnable

  changeHttpsListenerStatus(row.uuid)
    .then((response) => {
      if (response) {
        ElMessage.success(`${row.isEnable ? "启用" : "禁用"}成功`)
        getTableData()
      } else {
        row.isEnable = originalStatus
        ElMessage.error("状态切换失败")
      }
    })
    .catch((error) => {
      console.error("状态切换失败:", error)
      row.isEnable = originalStatus
      ElMessage.error(error?.message || "状态切换失败")
    })
}

// 重置表单
function resetForm() {
  formData.value = cloneDeep(DEFAULT_FORM_DATA)
  formRef.value?.clearValidate()
  isEditMode.value = false
}

// 监听分页变化
watch([() => paginationData.currentPage, () => paginationData.pageSize], getTableData, { immediate: true })
</script>

<template>
  <div class="app-container">
    <el-card v-loading="loading" shadow="never">
      <div class="toolbar-wrapper">
        <div>
          <el-button type="primary" :icon="CirclePlus" @click="handleAdd">
            新增监听器
          </el-button>
          <el-button
            type="danger"
            :icon="Delete"
            :disabled="selectedRows.length === 0"
            :loading="batchLoading"
            @click="handleBatchDelete"
          >
            批量删除
          </el-button>
        </div>
        <div>
          <el-tooltip content="刷新当前页">
            <el-button type="primary" :icon="RefreshRight" circle @click="getTableData" />
          </el-tooltip>
        </div>
      </div>
      <div class="table-wrapper">
        <el-table
          :data="tableData"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="50" align="center" />
          <el-table-column prop="name" label="名称" align="center" min-width="120" />
          <el-table-column prop="description" label="描述" align="center" min-width="150" show-overflow-tooltip />
          <el-table-column prop="listenAddress" label="监听地址" align="center" min-width="140" />
          <el-table-column prop="externalAddress" label="外网连接地址" min-width="180" show-overflow-tooltip />
          <el-table-column prop="heartBeatTime" label="心跳时间(秒)" width="120" />
          <el-table-column prop="timeout" label="超时阈值(秒)" width="120" />
          <el-table-column prop="isEnable" label="状态" align="center" width="80">
            <template #default="scope">
              <el-switch
                v-model="scope.row.isEnable"
                @change="toggleListener(scope.row)"
              />
            </template>
          </el-table-column>
          <el-table-column fixed="right" label="操作" width="150" align="center">
            <template #default="scope">
              <el-button type="primary" text bg size="small" @click="handleUpdate(scope.row)">
                修改
              </el-button>
              <el-button type="danger" text bg size="small" @click="handleDelete(scope.row)">
                删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="pager-wrapper">
        <el-pagination
          background
          :layout="paginationData.layout"
          :page-sizes="paginationData.pageSizes"
          :total="paginationData.total"
          :page-size="paginationData.pageSize"
          :current-page="paginationData.currentPage"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>
    <!-- 新增/修改 -->
    <el-dialog
      v-model="dialogVisible"
      :title="isEditMode ? '修改监听器' : '新增监听器'"
      @closed="resetForm"
      width="30%"
    >
      <el-form ref="formRef" :model="formData" :rules="formRules" label-width="120px" label-position="left">
        <el-form-item prop="name" label="名称">
          <el-input
            v-model="formData.name"
            placeholder="请输入监听器名称"
            maxlength="50"
            show-word-limit
          />
        </el-form-item>
        <el-form-item prop="description" label="描述">
          <el-input
            v-model="formData.description"
            type="textarea"
            placeholder="请输入监听器描述"
            maxlength="200"
            show-word-limit
            :rows="3"
          />
        </el-form-item>
        <el-form-item prop="listenAddress" label="监听地址">
          <el-input
            v-model="formData.listenAddress"
            placeholder="例如: 0.0.0.0:8443"
            maxlength="50"
            show-word-limit
          />
        </el-form-item>
        <el-form-item label="外网连接地址" prop="externalAddress">
          <el-input
            v-model="formData.externalAddress"
            placeholder="请输入外网连接地址"
            maxlength="255"
            show-word-limit
          />
        </el-form-item>
        <el-form-item label="心跳时间(秒)" prop="heartBeatTime">
          <el-input-number
            v-model="formData.heartBeatTime"
            :min="1"
            :max="3600"
            :step="1"
            style="width: 100%"
          />
        </el-form-item>
        <el-form-item label="超时阈值(秒)" prop="timeout">
          <el-input-number
            v-model="formData.timeout"
            :min="1"
            :max="3600"
            :step="1"
            style="width: 100%"
          />
        </el-form-item>
        <el-form-item prop="isEnable" label="是否启用">
          <el-switch
            v-model="formData.isEnable"
            active-text="启用"
            inactive-text="禁用"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">
          取消
        </el-button>
        <el-button type="primary" :loading="loading" @click="handleCreateOrUpdate">
          确认
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<style lang="scss" scoped>
.app-container {
  .toolbar-wrapper {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
  }

  .table-wrapper {
    margin-bottom: 20px;
  }

  .pager-wrapper {
    display: flex;
    justify-content: flex-end;
  }
}
</style>
