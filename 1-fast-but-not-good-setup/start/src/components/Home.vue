<script setup>
import { useRouter } from 'vue-router'

const router = useRouter();

async function signIn() {
  router.push(`/dashboard`);
}

</script>

<template>
  <h1>I am the home page</h1>
  <h5>You should sign in here</h5>
  <button @click="signIn">Sign In</button>
</template>
