<template>
  <form @submit.prevent="register" class="card">
    <div class="card-header">
      <h1 class="h5">Register</h1>
    </div>

    <div class="card-body d-grid gap-3">
      <div class="form-group" :class="{ 'has-danger': hasError('email') }">
        <label class="form-label" for="email">Email Address</label>
        <input
          v-model="form.email"
          id="email"
          name="email"
          type="email"
          class="form-control"
          :class="{ 'is-invalid': hasError('email') }"
        />
        <div class="invalid-feedback" v-if="hasError('email')">
          {{ getErrorMessage("email") }}
        </div>
      </div>
      <div class="form-group" :class="{ 'has-danger': hasError('password') }">
        <label class="form-label" for="password">Password</label>
        <input
          v-model="form.password"
          id="password"
          name="password"
          type="password"
          class="form-control"
          :class="{ 'is-invalid': hasError('password') }"
        />
        <div class="invalid-feedback" v-if="hasError('password')">
          {{ getErrorMessage("password") }}
        </div>
      </div>
      <button class="btn btn-primary">Register</button>
    </div>
  </form>
</template>

<script setup lang="ts">
import { api } from "~~/api";
import { required, email } from "@vuelidate/validators";
import { useVuelidation } from "~~/compositions/useVuelidation";

const form = reactive({
  email: "",
  password: "",
});

const validations = {
  email: { required, email },
  password: { required },
};

const { getErrorMessage, submitForm, setErrors, hasError } = useVuelidation({
  validations,
  state: form,
});

definePageMeta({
  layout: "wrapper",
});

const register = async () => {
  submitForm(async () => {
    const user = await api.post("users/register", form);
  }, setErrors);
};
</script>
