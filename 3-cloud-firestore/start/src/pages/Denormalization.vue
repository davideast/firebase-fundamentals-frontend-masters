<script setup>
import { onMounted, reactive, onBeforeUnmount, nextTick } from 'vue';
import ExpenseExcersize from '../components/ExpenseExcersize.vue'
import { getFirebase } from '../firebase';
import { collection, onSnapshot, limitToLast, query, where, doc, orderBy, getDoc, limit } from 'firebase/firestore';

const state = reactive({ results: [] });
const { firestore } = getFirebase();
const usersCol = collection(firestore, 'users');
const expensesCol = collection(firestore, 'expenses');
let subscription = null;
let listenerHash = {};
onMounted(() => {

  // // 1. Get a user's top 10 expenses and their name

  // // 2. Get the first 100 expenses
  // bindToTable({ 
  //   query: query(expensesCol, limit(100)), 
  //   timerLabel: 'Get the first 100 expenses'
  // });

  // // 3. Get the first 100 expenses with the user's full name
  // bindToTable({ 
  //   query: query(expensesCol, limit(100)), 
  //   timerLabel: 'Get the first 100 expenses with full name',
  //   transform: formatExpenseWithUser,
  // });

  // // 4. Get the first 100 expenses with the user's full name, listener
  // bindToTable({ 
  //   query: query(expensesCol, limit(100)), 
  //   timerLabel: 'Get the first 100 expenses with full name',
  //   userListeners: true,
  // });

  // // 5. Get the first 100 expenses with the user's full name, denormalized
  bindToTable({ 
    query: query(expensesCol, limit(100)), 
    timerLabel: 'Get the first 100 expenses with full name'
  });
});

async function bindToTable({ query, timerLabel, transform, userListeners }) {
  console.time(timerLabel);
  const callbackFn = transform == null ? formatExpense : transform;
  subscription = onSnapshot(query, async snapshot => {
    const results = snapshot.docs.map(d => {
      return callbackFn(snapshot, d);
    });
    const allData = await Promise.all(results);
    console.timeEnd(timerLabel);
    state.results = allData;
    if(userListeners != null) {
      listenerHash = attachUserListeners(state.results);
    }
  });
}

function attachUserListeners(expense) {
  let listenerHash = {};
  expense.forEach(expense => {
    let sub = onSnapshot(doc(usersCol, expense.uid), snapshot => {
      const { first, last } = snapshot.data();
      const updateIndex = state.results.findIndex(r => {
        return r.uid === snapshot.id;
      });
      const result = state.results[updateIndex]
      state.results[updateIndex] = {
        ...result,
        uid: `${first} ${last}` 
      };
    });
    listenerHash[expense.uid] = sub;
  })
  return listenerHash;
}

function formatExpense(snapshot, d) {
  const { user, cost, category, date: rawDate } = d.data();
  const name = `${user.first} ${user.last}`;
  const dateConfig = { day: '2-digit', month: '2-digit', year: 'numeric' };
  const date = new Intl.DateTimeFormat('en', dateConfig).format(rawDate.toDate());
  const { fromCache } = snapshot.metadata;
  return { name, cost, category, fromCache, date };
}

async function formatExpenseWithUser(snapshot, d) {
  const expense = formatExpense(snapshot, d);
  const { userRef } = d.data();
  const userSnapshot = await getDoc(userRef);
  const { first, last } = userSnapshot.data();
  // console.log({ fromCache: userSnapshot.metadata.fromCache});
  const fullName = `${first} ${last}`;
  delete expense.uid;
  return { fullName, ...expense };
}

onBeforeUnmount(() => {
  subscription();
  // Unsubscribe to all entries
  Object.entries(listenerHash).filter(sub => sub != null).map(sub => sub());
})

const headings = [
  { value: "name" },
  { value: "cost", type: "numeric" },
  { value: "category" },
  { value: "fromCache" },
  { value: "date", type: "numeric" }
]
</script>


<template>
  <main>    
    <ExpenseExcersize 
      number="2"
      subtitle="The basics of querying"
      :results="state.results"
      :headings="headings" />
  </main>

</template>

<style>

</style>
