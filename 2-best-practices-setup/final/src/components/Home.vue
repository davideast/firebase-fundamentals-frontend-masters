<script setup>
import { onBeforeMount } from 'vue';
import { getFirebase } from '../firebase';
import { signInAnonymously, onAuthStateChanged } from 'firebase/auth';
import { useRouter } from 'vue-router'

const { auth } = getFirebase();
const router = useRouter();

onBeforeMount(() => {
  onAuthStateChanged(auth, result => {
    if(result != null) {
      console.log(result.user);
      router.push(`/dashboard`);
    }
  });
});

function signIn() {
  signInAnonymously(auth);
}

</script>

<template>
  <h1>I am the home page</h1>
  <h5>You should sign in here</h5>
  <button @click="signIn">Sign In</button>
</template>
