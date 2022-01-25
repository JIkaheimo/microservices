<template>
  <form @submit.prevent="login" class="card">
    <div class="card-header">
      <h1 class="h5">Login</h1>
    </div>

    <div class="card-body d-grid gap-3">
      <BaseInput
        v-model:value="form.email"
        label="Email Address"
        autocomplete="email"
        id="email"
        type="email"
        :error="getErrorMessage('email')"
      />

      <BaseInput
        v-model:value="form.password"
        label="Password"
        autocomplete="password"
        id="password"
        type="password"
        :error="getErrorMessage('password')"
      />

      <p v-if="generalError" class="text-danger">{{ generalError }}</p>

      <button class="btn btn-primary">Login</button>
    </div>

    <div class="card-footer">
      <NuxtLink class="card-link" to="register">Don't have an account?</NuxtLink>
    </div>
  </form>
</template>

<script setup lang="ts">
import { api } from "~~/api";
import { required, email } from "@vuelidate/validators";
import BaseInput from "~~/components/base/BaseInput.vue";
import { useVuelidation } from "~~/composables/useVuelidation";
import { useUser } from "~~/composables/state";

const user = useUser();
const router = useRouter();

const form = reactive({
  email: "",
  password: "",
});

const validations = {
  email: { required, email },
  password: { required },
};

const { getErrorMessage, submitForm, generalError } = useVuelidation({
  validations,
  state: form,
});

const login = submitForm(async () => {
  user.value = await api.post("users/login", form);
  await router.push("/");
});
</script>
