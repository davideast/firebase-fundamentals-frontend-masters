<script setup>
import { onMounted, reactive, onBeforeUnmount } from 'vue';
import ExpenseExcersize from '../components/ExpenseExcersize.vue'
import { getFirebase } from '../firebase';
import { collection, onSnapshot, limit, limitToLast, query, where, orderBy, startAt, startAfter, endBefore, endAt, getDocs, doc } from 'firebase/firestore';

const { firestore } = getFirebase();
const expensesCol = collection(firestore, 'expenses');
let expensesQuery = null;

// // 1. Get the first 20 categories in 2022
// expensesQuery = query(

// );

// // 2. Get the first 20 expenses the contain the category of 'transportation' or 'housing'
// // that cost between $100 and $120
// expensesQuery = query(

// );

// // 3. Get the last 10 expenses that contain the category of 'food'
// // that are occurred in December of 2021
// expensesQuery = query(

// );

// // 4. Get the first 10 expenses that contain the category of 'food', 'fun', 'kids'
// // that cost between 100 and 200 then get the next 10

// // Step 1: First query to begin the range
// const firstQuery = query(

// );

// // Step 2: Second query, imagine the user clicks a 'next page' button
// const results = await getDocs(firstQuery);
// const lastDoc = results.docs.at(results.length);

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
    const results = snapshot.docs.map(d => {
      return callbackFn(snapshot, d);
    });
    console.log({ results });
    state.results = results;
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
