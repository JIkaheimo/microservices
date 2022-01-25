<template>
  <div>
    <h1>Landing Page</h1>
    <p v-if="user">Hello {{ user?.email }}!</p>
    <p v-else>You are NOT signed in</p>
  </div>
</template>

<script setup lang="ts">
import { useUser } from "~~/composables/state";

const user = useUser();
</script>
