<script lang="ts" setup>
// 单用户admin模式，移除角色切换组件
</script>

<template>
  <div class="app-container">
    <el-card shadow="never" class="content">
      <el-alert
        title="单用户Admin模式"
        type="success"
        description="当前系统已简化为单用户admin模式，登录用户即拥有所有权限，无需角色切换。"
        show-icon
        :closable="false"
      />
      <div class="margin-top-20">
        <el-text size="large">
          在单用户模式下，所有页面对登录用户都是可见的，这个页面演示了页面级权限的概念。
        </el-text>
      </div>
    </el-card>
  </div>
</template>

<style lang="scss" scoped>
.content {
  margin-top: 20px;
}

.margin-top-20 {
  margin-top: 20px;
}
</style>
