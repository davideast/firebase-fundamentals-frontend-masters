<script setup>
import { onMounted, reactive, onBeforeUnmount } from 'vue';
import ExpenseExcersize from '../components/ExpenseExcersize.vue'
import { getFirebase } from '../firebase';
import { collection, onSnapshot, limit, query, where, orderBy } from 'firebase/firestore';

const { firestore } = getFirebase();
const usersCol = collection(firestore, 'users');
const expensesCol = collection(firestore, 'expenses');

let expensesQuery = null;
// // 1. Get the first 200 expenses.
// expensesQuery = query(

// );

// // 2. Get all expenses categorized as 'pets'
// expensesQuery = query(

// );

// // 3. Get all expenses less than $200, ordered from greatest to least
// expensesQuery = query(

// );

// // 4. Get all expenses that occurred before July of 2021
// expensesQuery = query(

// );

// 5. Get all expenses between July 2021 and October 2021
// expensesQuery = query(

// );

// 6. Get all expenses between July 2021 and October 2021 categorized as 'fun'
// expensesQuery = query(

// );

// // 7. Get all expenses are NOT categorized as 'fun', 'clothes', 'gifts', 'home', and 'personal'
// expensesQuery = query(

// );

// // 8. Get all expenses are categorized as 'food' that occurred in January 2021, but not on 12/26/2021
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

function bindToState(state, query, transform = formatExpense) {
  return onSnapshot(query, snapshot => {
    state.results = snapshot.docs.map(transform);
  });
}

function formatExpense(docSnapshot) {
  const { uid, cost, category, date: rawDate } = docSnapshot.data();
  const dateConfig = { day: '2-digit', month: '2-digit', year: 'numeric' };
  const date = new Intl.DateTimeFormat('en', dateConfig).format(rawDate.toDate());
  const { fromCache } = docSnapshot.metadata;
  return { uid, cost, category, fromCache, date };
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
