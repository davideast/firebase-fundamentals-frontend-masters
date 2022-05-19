<script setup>
import { onMounted, reactive, onBeforeMount } from 'vue';
import { initializeApp } from 'firebase/app';
import { getFirestore, onSnapshot, collection, setDoc, doc } from 'firebase/firestore';
import { signInAnonymously, getAuth, onAuthStateChanged } from 'firebase/auth';
import { config } from '../config';
import { useRouter } from 'vue-router';

const state = reactive({ markdowns: [] });
const app = initializeApp(config.firebase);
const db = getFirestore(app);
const auth = getAuth(app);
const markdownsCol = collection(db, 'markdowns');
const router = useRouter();

// Note: This is not a best practice
function getUser() {
  return new Promise((resolve, reject) => {
    const sub = onAuthStateChanged(auth, user => {
      if(user != null) {
        resolve(user);
      } else {
        reject(null);
      }
    })
  })
}

onBeforeMount(async () => {
  try {
    const user = await getUser();
    state.uid = user.uid;
  } catch {
    router.push('/');
  }
})

onMounted(() => {
  onSnapshot(markdownsCol, snapshot => {
    state.markdowns = snapshot.docs.map(d => {
      return { id: d.id, ...d.data() };
    });
  });
})

function newMarkdown() {
  const docToAdd = doc(markdownsCol);
  setDoc(docToAdd, { docOwnerUid: state.uid })
  router.push(`/editor/${docToAdd.id}`)
}
</script>

<template>
  <h1>I am the dashboard</h1>

  <ul v-for="markdown in state.markdowns" :key="markdown.id">
    <li>
      <router-link :to="{ path: `/editor/${markdown.id}` }">{{ markdown.id }}</router-link>
    </li>
  </ul>

  <button @click="newMarkdown">New</button>

</template>
