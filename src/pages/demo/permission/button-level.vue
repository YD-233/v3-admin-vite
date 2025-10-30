<script lang="ts" setup>
// 单用户admin模式，移除权限相关功能
</script>

<template>
  <div class="app-container">
    <el-card shadow="never">
      <el-alert
        title="单用户Admin模式"
        type="success"
        description="当前系统已简化为单用户admin模式，移除了复杂的权限控制功能。"
        show-icon
        :closable="false"
      />
    </el-card>

    <el-card header="原权限指令演示（已简化）" shadow="never" class="margin-top-20">
      <el-text type="info" size="large" class="margin-bottom-20">
        在单用户admin模式下，所有按钮都对登录用户可见，无需权限控制。
      </el-text>
      <div class="margin-top-20">
        <el-button type="primary">
          Admin按钮（始终可见）
        </el-button>
        <el-button type="success">
          通用按钮（始终可见）
        </el-button>
      </div>
    </el-card>

    <el-card header="原权限函数演示（已简化）" shadow="never" class="margin-top-20">
      <el-text type="warning" size="large">
        在单用户模式下，不再需要复杂的权限判断函数，所有功能都对登录用户开放。
      </el-text>
      <el-tabs type="border-card" class="margin-top-20">
        <el-tab-pane label="Admin功能">
          <el-tag size="large" type="success">
            Admin功能（始终可用）
          </el-tag>
        </el-tab-pane>
        <el-tab-pane label="通用功能">
          <el-tag size="large" type="primary">
            通用功能（始终可用）
          </el-tag>
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<style lang="scss" scoped>
.margin-top-20 {
  margin-top: 20px;
}

.margin-bottom-20 {
  margin-bottom: 20px;
  display: block;
}
</style>
