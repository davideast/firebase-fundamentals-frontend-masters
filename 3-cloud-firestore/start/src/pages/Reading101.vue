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
  subscription = onSnapshot(usersCol, snapshot => {
    state.results = snapshot.docs.map((d) => {
      const { first, last, highscore, city } = d.data();
      const id = d.id;
      const { fromCache } = d.metadata;
      return {
        id,
        first,
        last,
        highscore,
        city,
        fromCache,
      };
    });
  });

});

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
