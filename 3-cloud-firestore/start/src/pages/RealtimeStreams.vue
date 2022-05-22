<script setup>
import { onMounted, reactive, onBeforeUnmount } from 'vue';
import UserExcersize from '../components/UserExcersize.vue'
import { getFirebase } from '../firebase';
import { collection, onSnapshot } from 'firebase/firestore';

const state = reactive({ results: [] });
const { firestore } = getFirebase();
const usersCol = collection(firestore, 'users');
let subscription = null;
onMounted(() => {
  bindToTable(usersCol);
});


function bindToTable(query, transform) {
  subscription = onSnapshot(query, snapshot => {
    const callbackFn = transform == null ? formatUser : transform;
    state.results = snapshot.docs.map(callbackFn);
  });
}

function formatUser(docSnapshot) {
  const { first, last, highscore, city } = docSnapshot.data();
  const { fromCache } = docSnapshot.metadata;
  return { id: docSnapshot.id, first, last, highscore, city, fromCache, };
}

onBeforeUnmount(() => {
  if(subscription != null) {
    subscription();
  }
})
</script>


<template>
  <main>    
    <UserExcersize 
      number="1"
      subtitle="Reading data"
      :results="state.results" />
  </main>

</template>

<style>

</style>
