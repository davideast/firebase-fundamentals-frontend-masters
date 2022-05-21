<script setup>
import { onMounted, reactive, onBeforeUnmount } from 'vue';
import ExpenseExcersize from '../components/ExpenseExcersize.vue'
import { getFirebase } from '../firebase';
import { collection, onSnapshot, limit, query, where, orderBy } from 'firebase/firestore';

const state = reactive({ results: [] });
const { firestore } = getFirebase();
const usersCol = collection(firestore, 'users');
const expensesCol = collection(firestore, 'expenses');
let subscription = null;
onMounted(() => {
  let expensesQuery = null;
  // // 1. Get the first 200 expenses.
  expensesQuery = query(expensesCol, limit(200));

  // // 2. Get all expenses categorized as 'pets'
  // expensesQuery = query(expensesCol, where('category', '==', 'pets'))

  // // 3. Get all expenses less than $200, ordered from greatest to least
  // expensesQuery = query(expensesCol, where('cost', '<', 200), orderBy('cost', 'desc'));

  // // 4. Get all expenses that occurred before July of 2021
  // expensesQuery = query(
  //   expensesCol, 
  //   where('date', '<', new Date('7/01/2021')), 
  //   orderBy('date', 'desc'),
  // );


  // 5. Get all expenses between July 2021 and October 2021
  // expensesQuery = query(
  //   expensesCol, 
  //   where('date', '>', new Date('6/30/2021')), 
  //   where('date', '<', new Date('10/01/2021')), 
  //   orderBy('date', 'desc'),
  // );

  // 6. Get all expenses between July 2021 and October 2021 categorized as 'fun'
  // expensesQuery = query(
  //   expensesCol, 
  //   where('date', '>', new Date('6/30/2021')), 
  //   where('date', '<', new Date('10/01/2021')), 
  //   where('category', '==', 'fun'), 
  //   orderBy('date', 'desc'),
  // );

  // // 7. Get all expenses are NOT categorized as 'fun', 'clothes', 'gifts', 'home', and 'personal'
  // expensesQuery = query(
  //   expensesCol, 
  //   where('category', 'not-in', ['fun', 'clothes', 'gifts', 'home', 'personal']),
  // );

  // // 8. Get all expenses are categorized as 'food' that occurred in January 2021, but not on 12/26/2021
  // expensesQuery = query(
  //   expensesCol, 
  //   where('category', '==', 'food'),
  //   where('date', '>', new Date('11/31/2021')), 
  //   where('date', '<', new Date('01/01/2022')), 
  //   where('date', '!=', new Date('12/26/2021')),
  //   orderBy('date', 'desc'),
  // );

  // // 8. Get all expenses are categorized as 'food' that occurred in January 2021, 
  // // but not on 12/26/2021 12/23/2021, or 12/28/2021
  // expensesQuery = query(
  //   expensesCol, 
  //   where('category', '==', 'food'),
  //   where('date', '>', new Date('11/31/2021')), 
  //   where('date', '<', new Date('01/01/2022')), 
  //   where('date', 'not-in', [new Date('12/26/2021'), new Date('12/23/2021'), new Date('12/28/2021')]),
  //   orderBy('date', 'desc'),
  // );

  bindToTable(expensesQuery);
});

function bindToTable(query, transform) {
  subscription = onSnapshot(query, snapshot => {
    const callbackFn = transform == null ? formatExpense : transform;
    state.results = snapshot.docs.map(d => {
      return callbackFn(snapshot, d);
    });
  });
}

function formatExpense(snapshot, d) {
  const { uid, cost, category, date: rawDate } = d.data();
  const dateConfig = { day: '2-digit', month: '2-digit', year: 'numeric' };
  const date = new Intl.DateTimeFormat('en', dateConfig).format(rawDate.toDate());
  const { fromCache } = snapshot.metadata;
  return { uid, cost, category, fromCache, date };
}

onBeforeUnmount(() => {
  subscription();
})
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
