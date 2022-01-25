<template>
  <h1>Landing Page</h1>
  <p v-if="user">Hello {{ user?.email }}!</p>
  <p v-else>You are NOT signed in</p>
</template>

<script setup lang="ts">
import { getCurrentUser } from "~~/api";

definePageMeta({
  layout: "wrapper",
});

const { data: user } = await useAsyncData("currentUser", () =>
  getCurrentUser({ headers: useRequestHeaders(["cookie"]) })
);
</script>
