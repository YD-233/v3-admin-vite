<script lang="ts" setup>
import { getCssVar, setCssVar } from "@@/utils/css"
import { useSettingsStore } from "@/pinia/stores/settings"
import { useResize } from "./composables/useResize"
import LeftMode from "./modes/LeftMode.vue"

// Layout 布局响应式
useResize()

const settingsStore = useSettingsStore()

const { showTagsView } = storeToRefs(settingsStore)

// #region 隐藏标签栏时删除其高度，是为了让 Logo 组件高度和 Header 区域高度始终一致
const cssVarName = "--v3-tagsview-height"

const v3TagsviewHeight = getCssVar(cssVarName)

watchEffect(() => {
  showTagsView.value ? setCssVar(cssVarName, v3TagsviewHeight) : setCssVar(cssVarName, "0px")
})
// #endregion
</script>

<template>
  <div>
    <!-- 固定使用左侧布局模式 -->
    <LeftMode />
  </div>
</template>
