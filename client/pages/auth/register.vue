<template>
  <form @submit.prevent="register" class="card">
    <div class="card-header">
      <h1 class="h5">Register</h1>
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
        autocomplete="new-password"
        id="password"
        type="password"
        :error="getErrorMessage('password')"
      />
      <button class="btn btn-primary">Register</button>
    </div>
  </form>
</template>

<script setup lang="ts">
import { api } from "~~/api";
import { required, email } from "@vuelidate/validators";
import { useVuelidation } from "~~/compositions/useVuelidation";
import BaseInput from "~~/components/base/BaseInput.vue";

const router = useRouter();

const form = reactive({
  email: "",
  password: "",
});

const validations = {
  email: { required, email },
  password: { required },
};

const { getErrorMessage, submitForm, setErrors } = useVuelidation({
  validations,
  state: form,
});

definePageMeta({
  layout: "wrapper",
});

const register = submitForm(async () => {
  const user = await api.post("users/register", form);
  await router.push("/");
});
</script>
