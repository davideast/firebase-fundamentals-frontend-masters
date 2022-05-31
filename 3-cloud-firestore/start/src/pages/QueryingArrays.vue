<script setup>
import { onMounted, reactive, onBeforeUnmount } from 'vue';
import ExpenseExcersize from '../components/ExpenseExcersize.vue'
import { getFirebase } from '../firebase';
import { collection, onSnapshot, limit, query, where, orderBy } from 'firebase/firestore';

const { firestore } = getFirebase();
const expensesCol = collection(firestore, 'expenses');
let expensesQuery = null;

// // 1. Get the first 100 categories that are categorized as 'fun' AND 'kids'

// // 2. Get the first 25 categories that are categorized as ONLY 'fun' OR 'kids'
// expensesQuery = query(

// );

// // 3. Get the first 10 categories that contain the 'fun' category
// expensesQuery = query(

// );

// // 4. Get the first 25 categories that contain the 'fun' OR 'kids' category
// expensesQuery = query(

// );

// // 5. Get the first 25 expenses that occurred in January 2021, 
// // but not on 12/30/2021, 12/26/2021, 12/23/2021, or 12/28/2021
// expensesQuery = query(

// );

const state = bindToTable(expensesQuery)

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

function bindToState(state, query, transform) {
  return onSnapshot(query, snapshot => {
    const callbackFn = transform == null ? formatExpense : transform;
    state.results = snapshot.docs.map(d => {
      return callbackFn(snapshot, d);
    });
  });
}

function formatExpense(snapshot, d) {
  const { uid, cost, categories, date: rawDate } = d.data();
  const dateConfig = { day: '2-digit', month: '2-digit', year: 'numeric' };
  const date = new Intl.DateTimeFormat('en', dateConfig).format(rawDate.toDate());
  const { fromCache } = snapshot.metadata;
  return { uid, cost, categories: categories.join(', ') , fromCache, date };
}
</script>


<template>
  <main>    
    <ExpenseExcersize 
      number="2"
      subtitle="The basics of querying"
      :results="state.results" />
  </main>

</template>

<style>

</style>
