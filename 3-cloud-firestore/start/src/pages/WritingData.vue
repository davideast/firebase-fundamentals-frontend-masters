<script setup>
import { onMounted, reactive, onBeforeUnmount } from 'vue';
import ExpenseExcersize from '../components/ExpenseExcersize.vue'
import { getFirebase } from '../firebase';
import { collection, onSnapshot, limit, query, where, orderBy } from 'firebase/firestore';

const { firestore } = getFirebase();
const usersCol = collection(firestore, 'users');

// 1. Create a new Grocery Item with a custom ID

// 2. Update that Grocery Item

// 3. Delete that Grocery Item

// 4. Create a Grocery item with a generated ID

// 5. Create a Grocery item with a server timestamp

// 6. Increment a "like" count of Grocery Item

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
