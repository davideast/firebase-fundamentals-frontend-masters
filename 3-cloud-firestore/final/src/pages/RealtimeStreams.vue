<script setup>
import { onMounted, reactive, onBeforeUnmount } from 'vue';
import UserExcersize from '../components/UserExcersize.vue'
import { getFirebase } from '../firebase';
import { collection, onSnapshot } from 'firebase/firestore';

const { firestore } = getFirebase();
const usersCol = collection(firestore, 'users');

const state = bindToTable(usersCol);

function bindToTable(expensesQuery) {
  const state = reactive({ results: [] });
  let subscription = null;
  onMounted(() => {
    subscription = bindToState(state, expensesQuery);
  });
  onBeforeUnmount(() => {
    subscription();
  });
  return state;
}

function bindToState(state, query, transform = formatUser) {
  return onSnapshot(query, snapshot => {
    state.results = snapshot.docs.map(transform);
  });
}

function formatUser(docSnapshot) {
  const { first, last, highscore, city } = docSnapshot.data();
  const { fromCache } = docSnapshot.metadata;
  return { id: docSnapshot.id, first, last, highscore, city, fromCache, };
}
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
