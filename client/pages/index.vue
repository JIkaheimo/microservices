<template>
  <h1>Landing Page</h1>
  <p>User {{ user?.email }}</p>
  <p>User2 {{ user2 }}</p>
</template>

<script setup lang="ts">
import { api, getCurrentUser } from "~~/api";

definePageMeta({
  layout: "wrapper",
});

const { data: user } = await useAsyncData(
  "currentUser",
  () => getCurrentUser({ headers: useRequestHeaders(["cookie"]) }),
  {
    pick: ["email"],
  }
);

const user2 = await api.get("users/current-user");
</script>
