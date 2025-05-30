<template>
  <div class="admin">
    <h1>账号管理</h1>
  </div>
</template>

<script setup>
import { authAdmin } from "../../../api";
import { onMounted, reactive } from "vue";
const paginationData = reactive({
  pageNum: 1,
  pageSize: 10,
});

onMounted(() => {
  authAdmin(paginationData).then(({ data }) => {
    console.log(data, "authAdmin");
  });
});
</script>

<style scoped></style>
