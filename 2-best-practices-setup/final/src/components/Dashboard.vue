<script setup>
import { onMounted, reactive, onBeforeMount } from 'vue';
import { getFirebase } from '../firebase';
import { onSnapshot, collection, setDoc, doc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { useRouter } from 'vue-router';

const state = reactive({ markdowns: [] });
const { firestore, auth } = getFirebase();
const markdownsCol = collection(firestore, 'markdowns');
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
