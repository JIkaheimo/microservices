<template>
  <div class="d-grid gap-4">
    <nav class="navbar navbar-dark bg-primary">
      <div class="container">
        <NuxtLink to="/" class="navbar-brand mb-0 h1">Ticketing</NuxtLink>

        <div>
          <template v-if="!user">
            <NuxtLink to="/auth/register" class="btn btn-secondary mx-1"
              >Register</NuxtLink
            >
            <NuxtLink to="/auth/login" class="btn btn-secondary">Login</NuxtLink>
          </template>
          <button @click="onLogout" v-else class="btn btn-secondary" type="button">
            Logout
          </button>
        </div>
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

const router = useRouter();
const user = useUser();

user.value = await useAsyncData("currentUser", () =>
  getCurrentUser({ headers: useRequestHeaders(["cookie"]) })
).data;

const onLogout = async () => {
  await logout();
  user.value = null;
  await router.push("/auth/login");
};
</script>
