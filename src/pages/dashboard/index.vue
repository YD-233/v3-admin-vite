<script lang="ts" setup>
import { useUserStore } from "@/pinia/stores/user"
import Admin from "./components/Admin.vue"
import Editor from "./components/Editor.vue"

const userStore = useUserStore()

// 单用户模式下，登录即为admin
const isAdmin = userStore.isLoggedIn
</script>

<template>
  <component :is="isAdmin ? Admin : Editor" />
</template>
