<script setup>
import { onBeforeUnmount, onMounted, reactive } from "vue";
import { getFirebase } from "./firebase";
import {
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithRedirect,
  getRedirectResult,
  GoogleAuthProvider,
  linkWithCredential,
  EmailAuthProvider,
  linkWithRedirect,
  signOut,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { getDocs, collection, query, where } from 'firebase/firestore';

const { auth, firestore } = getFirebase();
let subscription = null;
const state = reactive({ expenses: [] });
const expensesCol = collection(firestore, 'expenses');

function getFormDetails(event) {
  const formData = new FormData(event.target);
  const email = formData.get("email");
  const password = formData.get("password");  
  return { email, password };
}

async function signIn(event) {
  event.preventDefault();
  const { email, password } = getFormDetails(event);
  signInWithEmailAndPassword(auth, email, password);
}

async function createAccount(event) {
  event.preventDefault();
  const { email, password } = getFormDetails(event);  
  createUserWithEmailAndPassword(auth, email, password);
}

async function mergeEmail({ email, password }) {
  const credential = EmailAuthProvider.credential(email, password);
  try {
    const user = linkWithCredential(auth.currentUser, credential);
    console.log("Account linking success", user);
  } catch (error) {
    console.log("Account linking error", error);
  }
}

function linkWithGoogle() {
  linkWithRedirect(auth.currentUser, new GoogleAuthProvider())
}

function signInGoogle() {
  signInWithRedirect(auth, new GoogleAuthProvider());
}

function signUserOut() {
  signOut(auth);
}

onMounted(async () => {
  try {
    await getRedirectResult(auth);
  } catch (error) {
    console.error(error);
  }

  subscription = onAuthStateChanged(auth, async (user) => {
    state.user = user;
    if(user != null) {
      const expensesQuery = query(expensesCol, where('uid', '==', user.uid));
      const snapshot = await getDocs(expensesQuery);
      state.expenses = snapshot.docs.map(d => {
        const { category, cost } = d.data();
        return { id: d.id, text: `${category} - $${cost}` };
      });
    }
  });
});

onBeforeUnmount(() => {
  if(subscription) {
    subscription();
  }
});
</script>

<template>
  <main>
    <form v-on:submit="createAccount">
      <h3>Create account</h3>
      <input
        placeholder="david@example.com"
        name="email"
        type="email"
        value="fprescote30@posterous.com"
      />
      <input name="password" type="password" value="1234Firebase" />
      <button type="submit">Create In</button>
    </form>

    <form v-on:submit="signIn">
      <h3>Sign in</h3>
      <input
        placeholder="david@example.com"
        name="email"
        type="email"
        value="fprescote30@posterous.com"
      />
      <input name="password" type="password" value="1234Firebase" />
      <button type="submit">Sign In</button>
    </form>

    <div>
      <h3>Social</h3>
      <button @click="signInGoogle">Sign In with Google</button>
    </div>

    <div v-if="state.user">
      <h3>Sign Out</h3>
      <button @click="signUserOut">Sign Out</button>
    </div>

    <div v-if="state.user">
      <h3>Link</h3>
      <button @click="linkWithGoogle">Link with Google</button>
    </div>

    <div v-if="state.user">
      <h3>User Expenses</h3>
      <ol>
        <li v-bind:key="expense.id" v-for="expense in state.expenses">
          {{ expense.text }}
        </li>
      </ol>
    </div>

  </main>
</template>

<style>
main {
  max-width: 960px;
  margin: 0 auto;
  margin-block-start: var(--size-10);
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--size-10);
}

h3 {
  margin-block-end: var(--size-4);
}

form {
  display: grid;
  gap: var(--size-2);
}
</style>
