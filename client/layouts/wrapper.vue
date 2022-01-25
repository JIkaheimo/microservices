<template>
  <div class="d-grid gap-4">
    <nav class="navbar navbar-dark bg-primary">
      <div class="container">
        <NuxtLink to="/" class="navbar-brand mb-0 h1">Ticketing</NuxtLink>

        <button @click="onLogout" v-if="user" class="btn btn-secondary" type="button">
          Logout
        </button>
      </div>
    </nav>
    <div class="container">
      <slot />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { getCurrentUser, logout } from "~~/api";
import { useUser } from "~~/composables/state";

const user = useUser();

user.value = await useAsyncData("currentUser", () =>
  getCurrentUser({ headers: useRequestHeaders(["cookie"]) })
).data;

const onLogout = async () => {
  await logout();
  user.value = null;
};
</script>
