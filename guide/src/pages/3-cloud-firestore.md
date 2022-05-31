---
layout: ../layouts/GuideLayout.astro
title: Cloud Firestore
order: 3
subtitle: <span class="highlight">Realtime</span> streams, advanced <span class="highlight">querying</span>, and when to <span class="highlight">denormalize</span>.
previous:
  name: Setting up
  href: /2-setup
next:
  name: Firebase Authentication
  href: /4-firebase-authentication
---

Up until this point we've been covering Firebase from a general point of view. From here on out, we'll be getting really specific and focusing on individual products and their features. 

<div aria-hidden="true" class="slide" data-type="main" data-title="General to Focused">
  <div class="heading-group">
    <div class="main-title">General to <span class="highlight">Focused</span></div>
  </div>
  <p class="title">
    From here on out, we'll be getting focusing on individual <span class="highlight">Firebase services</span>.
  </p>
</div>

We saw that with security it's really important to have authentication figured out. But! We're going to start with the database, because well that's the fun part.

#### What is Firestore?
Firestore is a _NoSQL_ document database, with _realtime_ and _offline_ capabilities. Firestore is designed to reduce if not eliminate slow queries. In fact, if you manage to write a slow query with Firestore it's likely because you're downloading too many documents at once. With Firestore you can query for data, and receive updates within `500ms` every time a data updates within the database. 

<div aria-hidden="true" class="slide" data-type="main" data-title="What is Firestore?">

  <div class="title">What is <span class="highlight">Firestore</span>?</div>
  <div class="side-grid firestore">
    <div class="numeric-side">
      <div class="highlight mega-number">NoSQL</div>
      <div class="subtitle">Database</div>
    </div>
    <div class="subtitle">
      <span class="highlight">Firestore</span> is a <span class="highlight">NoSQL</span> database with <span class="highlight">realtime</span> and <span class="highlight">offline</span> capabilities.
    </div>
  </div>
  
</div>

Firestore is extremely powerful, but there's a bit of a perspective shift if you're coming from a SQL background.

#### SQL and NoSQL
Many developers come to NoSQL with at least some SQL experience. They are used to a world of schemas, normalization, joins, and rich querying features. NoSQL tends to be a bit of jarring experience at first because it has different priorities. SQL prioritizes having data in a _uniform_ and _distinct_ model. 

<div aria-hidden="true" class="slide" data-type="main" data-title="SQL and NoSQL">
  <div class="heading-group">
    <div class="main-title"><span class="highlight">SQL</span> and <span class="highlight">NoSQL</span></div>
  </div>
  <p class="title">
    NoSQL tends to be a bit of jarring experience at first because it has <span class="highlight">different priorities</span>.
  </p>
</div>

<div aria-hidden="true" class="slide" data-type="main" data-title="Tables">
  <img src="/tbl_users.svg" alt="Two SQL tables" class="height-80">
</div>

<div aria-hidden="true" class="slide" data-type="main" data-title="Relations">
  <img src="/tbl_join.svg" alt="Two SQL tables" class="height-80">
</div>

This data model is built through tables. You can think of tables in two dimensions: _rows_ and _columns_. Rows are a single record or object within the table. Columns are the properties on that object. Columns provide a rigid but high level of integrity to your data structure.

<div aria-hidden="true" class="slide" data-type="main" data-title="Querying">
  <div class="heading-group">
    <div class="main-title"><span class="highlight">Querying</span></div>
  </div>

```sql
SELECT id, cost, date, uid
  FROM tbl_expenses
  WHERE uid = 'david_123'
```
</div>

<div aria-hidden="true" class="slide total-center" data-type="main" data-title="Rows and Columns">
  <div>
    <img src="/tbl_expenses.svg" alt="A table of expenses">
  </div>
</div>

This table has uniform _schema_ that all records must follow. This gives us a high amount of integrity within the data model at the cost of making variants of this record. You can't add a single column onto a single row. If a new column is created, every row gets that column, even if the value is just null. Let's say we wanted to add another column to this `tbl_expenses` table: `approval`. 

<div aria-hidden="true" class="slide" data-type="main" data-title="Adding columns">
  <div>
    <img src="/tbl_expenses_approval.svg" alt="A table of expenses now with a new column">
  </div>
</div>

<div aria-hidden="true" class="slide" data-type="main" data-title="Tables">
  <img src="/tbl_both_expenses.svg" alt="Two SQL tables" class="height-80">
</div>

Expenses can be personal so this column may not make sense for every column. For those cases how do we fill the column? Do we make it `false`? Well, that might communicate that the manager didn't approve a personal charge and it could also accidentally end up a query looking for all unapproved expenses. How about making it `null`? This value is supposed to be a `boolean`, but if we make it `nullable`, it can have three states. If you can have three states, is it really a `boolean`? 

<div aria-hidden="true" class="slide" data-type="main" data-title="Joins">
  <div class="heading-group">
    <div class="main-title"><span class="highlight">Joins</span></div>
  </div>

```sql
-- Union expenses with business expenses
SELECT id, cost, date, uid
  FROM tbl_expenses
  WHERE uid = 'david_123'
UNION
SELECT id, cost, date, uid
  FROM tbl_business_expenses
  WHERE uid = 'david_123'
```
</div>

Usually in those cases you would have to create another table such as: `tbl_business_expenses`. Now, to get a list of personal and buisness expenses back you'd have to write a query.

```sql
-- Union expenses with business expenses
SELECT id, cost, date, uid
  FROM tbl_expenses
  WHERE uid = 'david_123'
UNION
SELECT id, cost, date, uid
  FROM tbl_business_expenses
  WHERE uid = 'david_123'
```

<div aria-hidden="true" class="slide" data-type="main" data-title="Pros/Cons">
  <div class="heading-group">
    <div class="main-title"><span class="highlight">Pros/Cons</span></div>
  </div>

  <ul>
    <li>PRO: Data integrity is high</li>
    <li>CON: Complex queries can get slow</li>
    <li>CON: Data structures are rigid and can force you into queries</li>
    <li>CON: Scaling SQL, means scaling vertically.
  </ul>

</div>

The advantage here is that the data integrity is high, however it's at the cost the read time. Anytime you have to write a `JOIN` or some other clause you are tacking on the time to complete the query. In simple queries this isn't a big deal, but as data models grow more complicated the queries do as well. If you aren't careful, you can end up with a 7 way `INNER JOIN` and just to get a list of expenses. 

A query like that can be rather slow. If this kind of query is one of the most important aspects of your site, it needs to be fast, even as more and more records are added to the database. As the database needs to scale, you'll need to put it on beefier and beefier machines, this is known as _scaling vertically_.

<div aria-hidden="true" class="slide" data-type="main" data-title="Scaling">

  <div class="main-title"><span class="highlight">Scaling</span></div>
  <div class="side-grid scaling">
    <div class="">
      <div class="highlight numeric">Vertically</div>
      <div class="subtitle">Get beefier machines</div>
    </div>
    <div class="">
      <div class="highlight numeric">Horizontally</div>
      <div class="subtitle">Distributed across several machines</div>
    </div>
  </div>

</div>

##### Reads over Writes
NoSQL databases don't care as much about uniformity and definitely not as much about having a distinct model. What Firestore priorities is fast reads. In many applications it's common to have more reads than writes. Take a second and think about some of the most common apps and sites in your life. Now think about how much more you consume the content from them versus write updates to them. Even if you are an avid poster, it's still likely that you scroll through your feed more.

<div aria-hidden="true" class="slide" data-type="main" data-title="Reads over writes">
  <img src="/reads_over_writes.svg" alt="A diagram showing more reads than writes">
</div>

<div aria-hidden="true" class="slide" data-type="main" data-title="A perspective shift">
  <img src="/away_towards.svg" alt="An image illustrating that in this workshop we'll be shifting away from SQL concepts to NoSQL ones.">
</div>

In the Firestore world, we're going to be shifting away from data normalization and strong distinctive models. What we'll get in return are _blazing fast queries_ with _realtime_ streaming. In addition, as your database scales up to support more data it can be distributed across several machines to handle the work behind the scenes. This concept is known as _scaling horizontally_ and it's how Firestore scales up automatically for you.

With all that out of the way, let's see how you store and model data in Firestore.

##### Tables -> Collections 
If SQL databases use tables to structure data, what do NoSQL database use? Well, in Firestore's case data is stored in a hierarchical folder like structure using collections and documents.

<div aria-hidden="true" class="slide" data-type="main" data-title="Data structure">
  <div class="heading-group">
    <div class="main-title">How is data <span class="highlight">structured</span>?</div>
  </div>
</div>

<div aria-hidden="true" class="slide" data-type="main" data-title="Data structure">
  <div class="heading-group">
    <div class="main-title">With <span class="highlight">hierarchy</span></div>
  </div>
  <div class="light-code">collection/<span class="highlight">document</span>/collection/...</div>
</div>

<div aria-hidden="true" class="slide" data-type="main" data-title="Tables -> Collections">
  <div class="heading-group">
    <div class="main-title">Tables -> <span class="highlight">Collections</span></div>
  </div>
  <img class="width-50" src="/collection_document.svg" alt="Diagram of two documents in an expenses collection with different schemas" />
</div>

![Diagram of two documents in an expenses collection with different schemas](/collection_document.svg)

Collections are really just a concept for documents all stored at a similar path name. All data within Firestore is stored in documents.

##### Rows -> Documents
Firestore consists of documents, which are like objects. They're not just basic JSON objects, they can store complex types of data like binary data, references to other documents, timestamps, geo-coordinates, and so on and so forth. Now in SQL all rows had to have the same columns. But that's not the case in NoSQL every document can have whatever structure it wants.

<div aria-hidden="true" class="slide" data-type="main" data-title="Rows -> Documents">
  <div class="heading-group">
    <div class="main-title">Rows -> <span class="highlight">Documents</span></div>
  </div>
  <img class="width-90" src="/row_doc.svg" alt="Comparing a SQL row to a NoSQL document" />
</div>

Each document can be totally different from the other if you want. That's usually not the case in practice, but you have total flexibility at the database level. You can lock down the schema with security rules, but we'll get into that later. 

#### Retrieving data
With SQL you think about retrieving data in terms of queries. While that is still true here, you should primarily think about data in terms of locations with path names. In the JavaScript SDK we call this a reference.

<div aria-hidden="true" class="slide" data-type="main" data-title="Rows -> Documents">
  <div class="heading-group">
    <div class="main-title">Retrieving <span class="highlight">Data</span></div>
  </div>
</div>

##### References
Documents and collections are identified by a unique path, to refer to this location you create a reference.

<div aria-hidden="true" class="slide" data-type="main" data-title="References">
  <div class="heading-group">
    <div class="main-title"><span class="highlight">References</span></div>
  </div>

```js
import { collection, doc, getFirestore } from 'firebase/firestore';

const firestore = getFirestore();
const usersCollectionReference = collection(firestore, 'users');
// or for short
const usersCol = collection(firestore, 'users');
// get a single user
const userDoc = doc(firestore, 'users/david');
```

</div>


```js
import { collection, doc } from 'firebase/firestore';

const usersCollectionReference = collection(db, 'users');
// or for short
const usersCol = collection(db, 'users');
// get a single user
const userDoc = doc(db, 'users/david');
```

Both of those references will allow you to get all of the data at that location. For collections, we can query to restrict the result set down a bit more. For single documents, you retrieve the whole document so there's no querying needed.

##### Using the Emulator
Firestore has a fully functional offline emulator for development and CI/CD environments. In the last section we set up our project to run against the emulators. But as a review, you setup and run the emulators with the Firebase CLI and then use the JavaScript SDK to connect out to the emulator.

```js
import { initializeApp } from 'firebase/app';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import { config } from './config';

const firebaseApp = initializeApp(config.firebase);
const firestore = getFirestore(firebaseApp);
if(location.hostname === 'localhost') {
  connectFirestoreEmulator(firestore, 'localhost', 8080);
}
```

Whenever you are on running on `localhost` your app won't connect out to production services. 

##### onSnapshot()
With a reference made, we have a decision to make. Do we want to get the data one time, or do we want the realtime synchronized data state every time there's an update at that location? The realtime option sounds fun, so let's do that first.

<div aria-hidden="true" class="slide" data-type="main" data-title="onSnapshot()">
  <div class="heading-group">
    <div class="main-title"><span class="highlight">onSnapshot()</span></div>
  </div>

```js
import { onSnapshot } from 'firebase/firestore';

onSnapshot(userDoc, snapshot => {
  console.log(snapshot);
});

onSnapshot(usersCol, snapshot => {
  console.log(snapshot);
});
```

</div>

```js
import { onSnapshot } from 'firebase/firestore';

onSnapshot(userDoc, snapshot => {
  console.log(snapshot);
});

onSnapshot(usersCol, snapshot => {
  console.log(snapshot);
});
```

The `onSnapshot()` function takes in either a collection or document reference. It returns the state of the data in the callback function and will fire again for any updates that occur at that location. What you notice too is that it doesn't return the data directly. It returns an object called a snapshot. A snapshot is an object that contains the data and a lot of important information about its state as well. We'll get into the other info in a bit, but to get the actual data, you tap into the data function.

<div aria-hidden="true" class="slide no-gap" data-type="main" data-title="onSnapshot() data">
  <div class="heading-group">
    <div class="main-title"><span class="highlight">onSnapshot() data</span></div>
  </div>

```js
onSnapshot(userDoc, snapshot => {
  // this one one doc
  console.log(snapshot);
  // this is the data
  console.log(snapshot.data());
});

onSnapshot(usersCol, snapshot => {
  // this is an array of docs
  console.log(snapshot.docs);
  // you can iterate through and map what you need
  console.log(snapshot.docs.map(d => d.data()));
});
```
</div>


```js
onSnapshot(userDoc, snapshot => {
  // this one one doc
  console.log(snapshot);
  // this is the data
  console.log(snapshot.data());
});

onSnapshot(usersCol, snapshot => {
   // this is an array of docs
  console.log(snapshot.docs);
  // you can iterate through and map what you need
  console.log(snapshot.docs.map(d => d.data()));
});
```

What makes this realtime? Well, whenever an update occurs at this location it will re-fire this callback. For example:

```js
onSnapshot(userDoc, snapshot => {
  console.log(snapshot.data());
  // First time: "David"
  // Second time: "David!"
});

updateDoc(userDoc, { name: 'David!' });
```

<div aria-hidden="true" class="slide" data-type="main" data-title="Realtime updates">
  <div class="heading-group">
    <div class="main-title"><span class="highlight">Realtime updates</span></div>
  </div>

```js
onSnapshot(userDoc, snapshot => {
  console.log(snapshot.data());
  // First time: "David"
  // Second time: "David!"
});

updateDoc(userDoc, { name: 'David!' });
```
</div>

This isn't just local, this callback fires across all connected devices.

#### Writing data
Speaking of updates. What we see right here is one of the several update functions or as we call them _mutation functions_.

<div aria-hidden="true" class="slide" data-type="main" data-title="Writing data">
  <div class="heading-group">
    <div class="main-title">Writing <span class="highlight">data</span></div>
  </div>
  <div class="title">Using <span class="highlight numeric">mutation functions</span></div>
</div>

##### setDoc()
In Firestore calling `setDoc()` is considered a "destructive" operation. It will overwrite any data at that given path with the new data provided.

<div aria-hidden="true" class="slide" data-type="main" data-title="setDoc()">
  <div class="heading-group">
    <div class="main-title"><span class="highlight">setDoc()</span></div>
  </div>

```js
const davidDoc = doc(firestore, 'users/david_123');
setDoc(davidDoc, { name: 'David' });
```
</div>

```js
const davidDoc = doc(firestore, 'users/david_123');
setDoc(davidDoc, { name: 'David' });
```

For the instances where you want to granularly update a document, you can use another function.

##### updateDoc()
The `updateDoc()` function can take in a partial set of data and apply that update to an existing document.

```js
const davidDoc = doc(firestore, 'users/david_123');
updateDoc(davidDoc, { highscore: 82 });
```

<div aria-hidden="true" class="slide" data-type="main" data-title="updateDoc()">
  <div class="heading-group">
    <div class="main-title"><span class="highlight">updateDoc()</span></div>
  </div>

```js
const davidDoc = doc(firestore, 'users/david_123');
updateDoc(davidDoc, { highscore: 82 });
```
</div>

It's important to note that `updateDoc()` will fail if the document does not already exist. In the case where you can't be certain if a document exists but you don't want to perform a desctructive set, you can merge the update.

```js
const newDoc = doc(firestore, 'users/new_user_maybe');
setDoc(newDoc, { name: 'Darla' }, { merge: true });
```

<div aria-hidden="true" class="slide" data-type="main" data-title="setDoc() w/ merge">
  <div class="heading-group">
    <div class="main-title"><span class="highlight">setDoc()</span> with a merge</div>
  </div>

```js
const newDoc = doc(firestore, 'users/new_user_maybe');
setDoc(newDoc, { name: 'Darla' }, { merge: true });
```
</div>

This will create a new document if needed and if the document exists, it will only update with the data provided. It's the best of both worlds.

##### deleteDoc()
Deleting a document is fairly straighfoward.

```js
const davidDoc = doc(firestore, 'users/david_123');
deleteDoc(davidDoc);
```

<div aria-hidden="true" class="slide" data-type="main" data-title="deleteDoc()">
  <div class="heading-group">
    <div class="main-title"><span class="highlight">deleteDoc()</span></div>
  </div>

```js
const davidDoc = doc(firestore, 'users/david_123');
deleteDoc(davidDoc);
```
</div>

##### Generating Ids
Now that's for single documents. What about adding new items to a collection? Do you have to think of a new ID every time?

```js
// Don't want to have to name everthing? Good!
const someDoc = doc(firestore, 'users/some-name');
const usersCol = collection(firestore, 'users');
// Generated IDs!
addDoc(usersCol, { name: 'Darla' });
```

<div aria-hidden="true" class="slide" data-type="main" data-title="Generating">
  <div class="heading-group">
    <div class="main-title"><span class="highlight">Generating</span> Ids</div>
  </div>

```js
// Don't want to have to name everthing? Good!
const someDoc = doc(firestore, 'users/some-name');
const usersCol = collection(firestore, 'users');
// Generated IDs!
addDoc(usersCol, { name: 'Darla' });
```
</div>

The `addDoc()` function will create a document reference behind the scenes, assign it a generated id, and then data is sent to the server. What if you need access to this generated ID before you send its data off to the server?

```js
// The ids are generated locally as well
const newDoc = doc(userCol);
console.log(newDoc.id); // generated id, no data sent to the server
setDoc(newDoc, { name: 'Fiona' }); // Now it's sent to the server
```

<div aria-hidden="true" class="slide" data-type="main" data-title="Generated Ids are local">
  <div class="heading-group">
    <div class="main-title"><span class="highlight">Generated</span> Ids are local</div>
  </div>

```js
// The ids are generated locally as well
const newDoc = doc(userCol);
console.log(newDoc.id); // generated id, no data sent to the server
setDoc(newDoc, { name: 'Fiona' }); // Now it's sent to the server
```
</div>

Generated Ids in Firestore are created on the client. By creating an empty named child document reference from a collection reference, it will automatically assign it an generated id. From there you can use that id for whatever you need before sending data up to the server.

##### Timestamps
One of the tricky aspects with client devices are dates and timestamps. Firestore allows you to set dates on documents.

```js
const newDoc = doc(firestore, 'marathon_results/david_123');
// Imagine this runs automatically when a runner crosses the finish line
setDoc(newDoc, { 
  name: 'David', 
  finishedAt: new Date() // Something like: '5/1/2022 9:32:12 EDT'
});
```

<div aria-hidden="true" class="slide" data-type="main" data-title="Don't trust local date">
  <div class="heading-group">
    <div class="main-title">Don't <span class="highlight">trust</span> local dates</div>
  </div>

```js
const newDoc = doc(firestore, 'marathon_results/david_123');
// Imagine this runs automatically when a runner crosses the finish line
setDoc(newDoc, { 
  name: 'David', 
  finishedAt: new Date() // Something like: '5/1/2022 9:32:12 EDT'
});
```
</div>

In this example, this user document is added with an `finishedAt` field set to the device date. But it's only the current date based on that machine. Imagine if this was an app one the user's phone that ran this code when they crossed the finish line. The user could change their device settings and set the world record if they wanted to. Instead, we rarely use local dates for timestamps and we use value to tell Firestore to apply a time on the server.

<div aria-hidden="true" class="slide" data-type="main" data-title="Use server timestamps">
  <div class="heading-group">
    <div class="main-title">Use <span class="highlight">server timestamps</span></div>
  </div>

```js
const newDoc = doc(firestore, 'marathon_results/david_123');
// Imagine this runs automatically when a runner crosses the finish line
setDoc(newDoc, { 
  name: 'David', 
  finishedAt: serverTimestamp()
});
```
</div>

```js
const newDoc = doc(firestore, 'marathon_results/david_123');
// Imagine this runs automatically when a runner crosses the finish line
setDoc(newDoc, { 
  name: 'David', 
  finishedAt: serverTimestamp()
});
```

This function acts as a placeholder on the client that tells Firestore to apply the time when reaching the server.

##### Incrementing values
One of the most common tasks with data is just simply incrementing and decrementing values. The math is simple, but the edge cases in a realtime system can be really tricky. 

<div aria-hidden="true" class="slide" data-type="main" data-title="Incrementing values">
  <div class="heading-group">
    <div class="main-title"><span class="highlight">Incrementing</span> values</div>
  </div>

1. You first need to know the state of the data
2. Then you need to add or substract from the value
3. Then you update the new score
</div>

1. You first need to know the state of the data
2. Then you need to add or substract from the value
3. Then you update the new score

But what happens if that value was updated during that process? The new value will likely be wrong. Firestore has a few ways of handling these types of updates, but the most convienent are the `increment()` and `decrement()` functions.

<div aria-hidden="true" class="slide" data-type="main" data-title="Incrementing values problems">
  <div class="heading-group">
    <div class="main-title"><span class="highlight">Incrementing</span> values</div>
  </div>
  <div class="title">But what happens if that value was updated during that process?</div>
</div>

```js
const davidScoreDoc = doc(firestore, 'scores/david_123');
const darlaScoreDoc = doc(firestore, 'scores/darla_999');

updateDoc(davidScoreDoc, {
  score: decrement(10),
})
updateDoc(darlaScoreDoc, {
  score: increment(100),
})
```

<div aria-hidden="true" class="slide" data-type="main" data-title="increment()">
  <div class="heading-group">
    <div class="main-title"><span class="highlight">increment()</span></div>
  </div>

```js
const davidScoreDoc = doc(firestore, 'scores/david_123');
const darlaScoreDoc = doc(firestore, 'scores/darla_999');

updateDoc(davidScoreDoc, {
  score: decrement(10),
})
updateDoc(darlaScoreDoc, {
  score: increment(100),
})
```
</div>

<div aria-hidden="true" class="slide" data-type="main" data-title="One write per second">
  <div class="heading-group">
    <div class="main-title"><span class="highlight">One</span> write per second</div>
  </div>
  <div class="title">Firestore can only reliably handle 1 write per second on a document.</div>
</div>

The functions ensure that the incrementing and decrementing operations happen the latest value in the database. It's important to note that these functions can only work reliably if ran at most once per second. If you need updates faster than that you can use a solution called a _distributed counter_. But that's for another class.

Now there's one thing you should notice here. We're making updates to the server, but nowhere are we awaiting the result of the update. It's still an async operation, but why aren't we awaiting the result?

#### Synchronization
I'm about to dive into one of the core principles of the Firebase SDKs: unidirectional data-flow. If you've ever used React, Redux, or something similar you'll be familiar with this concept.

<div aria-hidden="true" class="slide" data-type="main" data-title="CRUD vs Synch">
  <div class="heading-group">
    <div class="main-title">CRUD vs. <span class="highlight">Synchronization</span></div>
  </div>

```js
const response = await fetch('/api/users', { method: 'POST', body: bodyData });
const newUser = await response.json();
console.log(newUser.id);
```
</div>

##### Redux-like updates

In a CRUD like system you'll make a request to a server to create a resource and get the result back in the response.

```js
const response = await fetch('/api/users', { method: 'POST', body: bodyData });
const newUser = await response.json();
console.log(newUser.id);
```

<div aria-hidden="true" class="slide" data-type="main" data-title="Synchronization">
  <div class="heading-group">
    <div class="main-title"><span class="highlight">Synchronization</span></div>
  </div>

```js
onSnapshot(userDoc, snapshot => {
  const user = snapshot.data();
  console.log(data);
  // First time: { name: "David" }
  // Second time: { name: "David!" }  
});

updateDoc(userDoc, { name: 'David!' });
```
</div>

During this process we're waiting on the server response to continue. We're not locking up the main thread obviously, but the response is what makes the app function. What if we could instantly get the response back? That's what happens with listeners in Firestore.

```js
onSnapshot(userDoc, snapshot => {
  const user = snapshot.data();
  console.log(data);
  // First time: { name: "David" }
  // Second time: { name: "David!" }  
});

updateDoc(userDoc, { name: 'David!' });
```

This is a similar example to what we saw before. But notice that there is no await or even a result returned from `updateDoc()`. Calling `updateDoc()` triggers an update to `onSnapshot()` and that's where we get the update or new resource. Now you might be asking, can I await the result of mutation function? Yes, you can, but it's rare that you'd want to do it. Why? Let's take a look.

<div aria-hidden="true" class="slide" data-type="main" data-title="Awaiting mutation functions">
  <div class="heading-group">
    <div class="main-title"><span class="highlight">Awaiting</span> mutation funcs</div>
  </div>

```js
onSnapshot(userDoc, snapshot => {
  const user = snapshot.data();
  console.log(data);
  // First time: { name: "David" }
  // Second time: { name: "David!" }  
});

const result = await updateDoc(userDoc, { name: 'David!' });
console.log(result); // { id, path, path, parent }
```
</div>


```js
onSnapshot(userDoc, snapshot => {
  const user = snapshot.data();
  console.log(data);
  // First time: { name: "David" }
  // Second time: { name: "David!" }  
});

const result = await updateDoc(userDoc, { name: 'David!' });
console.log(result); // { id, path, path, parent }
```

In this example we await the `updateDoc()` function. This is like a server receipt that the operation was received and completed. It returns a promise of a document reference, but not the data. You can get the newly created ID, but as we saw before that ID is created on the client. If you need it, you can create a blank child document and then use `setDoc()` instead. So we don't need to use await to get the ID. What about if we just want to be really certain that the object was sent to the server? You can do that and in some cases it might be necessary. However, it's important to realize what that does.

<div aria-hidden="true" class="slide no-gap" data-type="main" data-title="Redux-like updates">
  <div class="heading-group">
    <div class="main-title">Redux<span class="highlight">-like</span> updates</div>
  </div>

```js
const App = () => {
  const store = useStore();
  const state = store.getState(); 
  // First render: { users: [] }
  // Second render: { users: [ { name: 'David' } ] };

  // Trigger a re-render
  store.dispatch({ type: 'USER_ADDED', data: { name: 'David'  }});
  return (
    // …
  );
}
```
</div>

Firestore is capable of working while offline. It synchronizes changes within IndexedDB, so if your app loses connection, it keeps working against the it's local cache of data. However, if you are using `await` to get the result of mutation functions, you're going to have to wait until the app regains connection for them to resolve. Remember, it's a receipt from the server. This potentially can make your app unresponsive while offline. 

```js
const App = () => {
  const store = useStore();
  const state = store.getState(); 
  // First render: { users: [] }
  // Second render: { users: [ { name: 'David' } ] };

  // Trigger a re-render
  store.dispatch({ type: 'USER_ADDED', data: { name: 'David'  }});
  return (
    // …
  );
}
```

I strongly recommend not using `await` for mutation functions and getting the result back in `onSnapshot()` function. If you use Redux, you can think of this as "dispatching" changes to the store.

Don't think in terms of "request/response", think in terms of triggering or dispatching updates to a central store. This is especially useful when dealing with collections. 

##### Document change types

Remember how I told you that the `Snapshot` was really useful? Get used to me saying that, because I'm going to be saying it often. Rather than just getting the data outright, you can also see the changes happening since the listener was created using `snapshot.docChanges`.

<div aria-hidden="true" class="slide" data-type="main" data-title="Document change types">
  <div class="heading-group">
    <div class="main-title">Document <span class="highlight">change</span> types</div>
  </div>

```js
onSnapshot(usersCol, snapshot => {
  console.log(snapshot.docChanges[0]);
  // { type: 'added', doc: {}, oldIndex: -1, newIndex: 1 }

  // Create an object indexed by changes
  const changes = snapshot.docChanges.reduce((acc, curr) => {
    acc[curr.type] = curr;
  }, { added: [], modified: [], removed: [] });
  console.log(changes);
  // { added: [{ type: 'added', doc: {} … }], modified: [], removed: [] } 
});

addDoc(usersCol, { name: 'David!' });
```
</div>

```js
onSnapshot(usersCol, snapshot => {
  console.log(snapshot.docChanges[0]);
  // { type: 'added', doc: {}, oldIndex: -1, newIndex: 1 }

  // Create an object indexed by changes
  const changes = snapshot.docChanges.reduce((acc, curr) => {
    acc[curr.type] = curr;
  }, { added: [], modified: [], removed: [] });
  console.log(changes);
  // { added: [{ type: 'added', doc: {} … }], modified: [], removed: [] } 
});

addDoc(usersCol, { name: 'David!' });
```

In this case when we add a new user it will fire the callback of `onSnapshot()`, and from there we can tap into the `docChanges` array. This tells us what changes have happened since the listener was created. We can see the type of change (`"added"`, `"removed"`, and `"modified"`), the document itself, and the old and new indexes of the array position. This makes it really easy to implement reordering and animations to show updates to the data. When an item is added, it can flash in green, when it's updated it can flash yellow, and then red and fade out when deleted. A lot of framework libraries in my experience have made reordering plug-and-play. Angular Material deserves a shout out here. The DragList object works perfectly with these changes.

And that's not all you can get from a `Snapshot`. I don't know if I said this, but it's really useful.

##### The offline cache
Firestore is designed to work even when the client loses connection. When data is downloaded using the SDK, it is stored in a cache that is backed by `IndexedDB`. You don't have to write your code in an "offline" and "online" modes either. Firestore will continue to fire events and work. Once the connection is regained, Firestore will synchronize the changes back to the server. The only code change you need to make is to enable the caching behavior.

<div aria-hidden="true" class="slide" data-type="main" data-title="The offline cache">
  <div class="heading-group">
    <div class="main-title">The <span class="highlight">offline</span> cache</div>
  </div>

```js
import { getFirestore, enableMultiTabIndexedDbPersistence } from 'firebase/firestore';

enableMultiTabIndexedDbPersistence(getFirestore());
```
</div>

```js
import { getFirestore, enableMultiTabIndexedDbPersistence } from 'firebase/firestore';

enableMultiTabIndexedDbPersistence(getFirestore());
```

Firestore actually has two caching behaviors: single tab and multi tab. This function sets up multitab synchronization, which enables all tabs to synchronize from the same cache. If you've ever opened up two tabs of an offline web app, you'll like have ran into a message saying offline is only available in one tab. With Firestore, you don't have that problem.

###### Snapshot metadata
For the most part the cache is hidden away from you. However, you do have access to some important cache information when dealing with a `Snapshot`, like its `metadata`. 

```js
onSnapshot(userDoc, snapshot => {
  console.log(snapshot.data());
  // First time: { name: "David" }
  // Second time: { name: "David!" }  

  console.log(snapshot.metadata);
  // Very first time, data is loaded: 
  // { fromCache: false, hasPendingWrite: false }

  // Second time, data is updated locally: 
  // { fromCache: true, hasPendingWrite: true } 
});

updateDoc(userDoc, { name: 'David!' });
```

This tells you information about whether the data has been sent to the server and the snapshot was delivered from Firestore's local cache or directly from the network.

<div aria-hidden="true" class="slide no-gap" data-type="main" data-title="Snapshot metadata">
  <div class="heading-group">
    <div class="main-title">Snapshot <span class="highlight">metadata</span></div>
  </div>

```js
onSnapshot(userDoc, snapshot => {
  console.log(snapshot.data());
  // First time: { name: "David" }
  

  console.log(snapshot.metadata);
  // Very first time, data is loaded: 
  // { fromCache: false, hasPendingWrite: false }


  
});

updateDoc(userDoc, { name: 'David!' });
```
</div>

<div aria-hidden="true" class="slide no-gap" data-type="main" data-title="Snapshot metadata">
  <div class="heading-group">
    <div class="main-title">Snapshot <span class="highlight">metadata</span></div>
  </div>

```js
onSnapshot(userDoc, snapshot => {
  console.log(snapshot.data());
  // First time: { name: "David" }
  // Second time: { name: "David!" }  

  console.log(snapshot.metadata);
  // Very first time, data is loaded: 
  // { fromCache: false, hasPendingWrite: false }

  // Second time, data is updated locally: 
  // { fromCache: true, hasPendingWrite: true } 
});

updateDoc(userDoc, { name: 'David!' });
```
</div>

As you can see, Firestore is really powerful when it comes to realtime synchronization and offline capabilities. We haven't even begun to see querying yet either, but don't worry, it's just up ahead.

<div aria-hidden="true" class="slide" data-type="main" data-title="Demo & excerise">
  <div class="heading-group">
    <div class="main-title">Demo & exercise</div>
  </div>

  <ul class="code-callout">
    <li>cd /3-cloud-firestore/start</li>
    <li>npm i</li>
    <li>npm run dev</li>
    <li>http://localhost:3000/1/realtime-streams</li>
  </ul>
</div>

##### Demo & Exercise
Let's take a break to write some code.

<ul class="code-callout">
  <li>cd /3-cloud-firestore/start</li>
  <li>npm i</li>
  <li>npm run dev</li>
  <li>http://localhost:3000/1/realtime-streams</li>
</ul>

Once we're done. We'll get into querying.

#### Simple queries
Cloud Firestore is designed to scale up queries despite the number of documents it queries. A Firestore query has to search through `50` documents to only return `5`, will roughly be the same as a query that searches through `5,000,000` that also only returns `5`. These queries have to be fast every time not only because fast is good, but also because these queries have to work in realtime as well. Every query you can formulate in Firestore works with `onSnapshot()` for realtime streams and also works offline as well.

<div aria-hidden="true" class="slide" data-type="main" data-title="Query types">
  <div class="heading-group">
    <div class="main-title"><span class="h">Query</span> types</div>
  </div>

  <div class="title">Cloud Firestore has <em>two types</em> of queries: <em>simple</em> and <em>composite</em>.</div>
</div>

<div aria-hidden="true" class="slide" data-type="main" data-title="Demo & excerise">
  <div class="heading-group">
    <div class="main-title"><span class="h">Simple</span> queries</div>
  </div>

  <div class="title"><em>Simple queries</em> involve querying based on <em>one field</em>.</div>
</div>

Cloud Firestore has _two types_ of queries: _simple_ and _composite_. _Simple queries_ involve querying based on _one field_.

<div aria-hidden="true" class="slide" data-type="main" data-title="Simple queries">
  <div class="heading-group">
    <div class="main-title"><span class="h">Simple</span> queries</div>
  </div>

```js
import { collection, query, where, limit, getFirestore } from 'firebase/firestore';

const db = getFirestore();
const expensesCol = collection(db, 'expenses');
const expensesQuery = query(
  expensesCol,
  where('cost', '>', 200),
  limit(100),
);
```
</div>

```js
import { collection, query, where, limit, getFirestore } from 'firebase/firestore';

const db = getFirestore();
const expensesCol = collection(db, 'expenses');
const expensesQuery = query(
  expensesCol,
  where('cost', '>', 200),
  limit(100),
);
```

This query looks for expenses greater than `$200` and returns the first `100`. The only field that is used for the query is `cost`. The `limit()` function is just a restriction of the amount returned. Simple queries can have more than one where clause as well, as long as it's on the same field.

Firestore comes with a whole set of operators that help you query through your data. 

##### Equality Operators

<div aria-hidden="true" class="slide" data-type="main" data-title="Equality Operators">
  <div class="heading-group">
    <div class="main-title">Equality operators</div>
    <div class="light-code"><span class="h">==</span></div>
  </div>

```js
let expensesQuery = query(
  expensesCol,
  where('category', '==', 'food'),
  limit(100)
);
```
</div>

Use the `==` operator for straightforward equality queries.

```js
let expensesQuery = query(
  expensesCol,
  where('category', '==', 'food'),
  limit(100)
);
```

This query returns the first `100` expenses that have a category of `'food'`. It's still a simple query because the only field involved in the query is still `cost`. In Firestore you can also query within objects/maps.

<div aria-hidden="true" class="slide" data-type="main" data-title="== on maps">
  <div class="heading-group">
    <div class="main-title"><span class="h">==</span> on maps</div>
  </div>

```js
let expensesQuery = query(
  expensesCol,
  where('user.city', '==', 'Maputo'),
  limit(100)
);
```
</div>

```js
let expensesQuery = query(
  expensesCol,
  where('user.city', '==', 'Maputo'),
  limit(100)
);
```

The "dot" notation allows you to drill into an object/map, this works up to about `20` nested objects deep. Now this equality query may not look too exciting, so let's spice it up a bit and look for multiple cities.

<div aria-hidden="true" class="slide" data-type="main" data-title="in operator">
  <div class="heading-group">
    <div class="main-title"><span class="h">in</span> operator</div>
  </div>

```js
let expensesQuery = query(
  expensesCol,
  where('user.city', 'in', ['Maputo', 'Buenos Aires', 'Santiago']),
  limit(100)
);
```
</div>

```js
let expensesQuery = query(
  expensesCol,
  where('user.city', 'in', ['Maputo', 'Buenos Aires', 'Santiago']),
  limit(100)
);
```

You can query for multiple ranges on one field as well.

<div aria-hidden="true" class="slide" data-type="main" data-title="greater/less than">
  <div class="heading-group">
    <div class="main-title"><span class="h">greater/less than</span></div>
  </div>

```js
import { collection, query, where, limit, getFirestore } from 'firebase/firestore';

const db = getFirestore();
const expensesCol = collection(db, 'expenses');
const expensesQuery = query(
  expensesCol,
  where('cost', '>=', 200),
  where('cost', '=<', 210),
  limit(100),
);
```
</div>

```js
import { collection, query, where, limit, getFirestore } from 'firebase/firestore';

const db = getFirestore();
const expensesCol = collection(db, 'expenses');
const expensesQuery = query(
  expensesCol,
  where('cost', '>=', 200),
  where('cost', '=<', 210),
  limit(100),
);
```

This query gets the first `100` expenses that are between `200` and `210`. All of these queries help find data within equality ranges, but you can also do the opposite with inequality operators.

##### Inequality Operators

Firestore supports a `!=` operator.

<div aria-hidden="true" class="slide" data-type="main" data-title="Inequality operator">
  <div class="heading-group">
    <div class="main-title"><span class="h">Inequality</span> operators</div>
  </div>

```js
let expensesQuery = query(
  expensesCol,
  where('category', '!=', 'transportation'),
  limit(30),
);
```
</div>


```js
let expensesQuery = query(
  expensesCol,
  where('category', '!=', 'transportation'),
  limit(30),
);
```

This returns the first `30` expenses that do not have `'transportation'` as a category. Going back to the `user.city` query, you can query for a set of users who are not in a city.

<div aria-hidden="true" class="slide no-gap" data-type="main" data-title="not-in">
  <div class="heading-group">
    <div class="main-title"><span class="h">not-in</span> operator</div>
  </div>

```js
let expensesQuery = query(
  expensesCol,
  where('user.city', 'not-in', [
    'Maputo',
    'Buenos Aires',
    'Santiago',
    'Stockholm',
    'San Francisco',
    'Dubai',
  ]),
  limit(100)
);
```
</div>

```js
let expensesQuery = query(
  expensesCol,
  where('user.city', 'not-in', [
    'Maputo',
    'Buenos Aires',
    'Santiago',
    'Stockholm',
    'San Francisco',
    'Dubai',
  ]),
  limit(100)
);
```

This will exclude all these cities from the query. It's worth mentioning that the `not-in` clause does come with some limitations, you can supply only `10` values. 

##### Ordering
Another aspect of composite querying is ordering results with `orderBy()`.

<div aria-hidden="true" class="slide" data-type="main" data-title="ordering">
  <div class="heading-group">
    <div class="main-title"><span class="h">not-in</span> operator</div>
  </div>

```js
const expensesQuery = query(
  expensesCol,
  where('cost', '>=', 200),
  where('cost', '<=', 210),
  orderBy('cost', 'desc'),
  limit(100),
);
```
</div>

```js
const expensesQuery = query(
  expensesCol,
  where('cost', '>=', 200),
  where('cost', '<=', 210),
  orderBy('cost', 'desc'),
  limit(100),
);
```

In this example we're querying for expenses that `cost` between `200` and `210`. By using `orderBy()` we're ordering the result set returned by `cost` and sorting the results in a descending order. This means the results will start at `210` and move down towards `200`.

<div aria-hidden="true" class="slide" data-type="main" data-title="Because...">
  <div class="mega-title">Demo & Exercise</div>

  <ul class="code-callout">
    <li>cd /3-cloud-firestore/start</li>
    <li>npm i</li>
    <li>npm run dev</li>
    <li>http://localhost:3000/2/foundational-querying</li>
  </ul>
</div>

#### Composite Queries
Firestore will allow you to query based on two fields and return them just as fast as ever.

<div aria-hidden="true" class="slide" data-type="main" data-title="Composite Queries">
  <div class="heading-group">
    <div class="main-title"><span class="h">Composite</span> queries</div>
  </div>

  <div class="title"><em>Composite queries</em> involve querying based on <em>more than one field</em>.</div>
</div>

```js
const expensesQuery = query(
  expensesCol,
  where('cost', '>', 200),
  where('cost', '<', 210),
  where('category', 'in', ['fun', 'food', 'kids']),
  limit(100),
);
```

However, there's a catch. You need to explicity ask Firestore to create an index for this kind of query. Fortunately these indexes can be automatically created for you. When you run a composite query that doesn't have an index created we'll log out a link to the browser console for you to click on and then create a new index.

<div aria-hidden="true" class="slide" data-type="main" data-title="Creating composite indexes">
  <div class="heading-group">
    <div class="main-title">Creating <span class="h">composite</span> indexes</div>
  </div>
  <div class="total-center">
    <img class="width-50" src="/composite_index.png" alt="A screenshot of creating a composite index in the Firebase Console." />
  </div>
</div>

![A screenshot of creating a composite index in the Firebase Console.](/composite_index.png)

If you're using the Emulator, you can execute composite quries without needing to create an index. But what's an index anyway? And why do you need to ask Firestore to create them?

##### Indexes
In Firestore _the time it takes to run a query is proportional to the number of results you get back, not the number of documents you're searching through._ How exactly does that? Well, that's through the magic of indexing.

Whenever you create a document in the database, Cloud Firestore creates an index for every field in that document. An index is a sorted list of all the values in the field that are being indexed. An index stores the value and the id of the document in the database. This makes it fast and easy to query on a single field. 

<div aria-hidden="true" class="slide" data-type="main" data-title="Indexes">
  <div class="heading-group">
    <div class="main-title"><span class="h">Indexes</span></div>
  </div>
  <img class="width-50" src="/cost_index_range.svg" alt="A diagram showing a index list for the cost field." />
</div>


![A diagram showing a index list for the cost field](/cost_index_range.svg)

However, what about two fields? Each field has an index and its sorted by its own values, so they can't be queried together. 

<div aria-hidden="true" class="slide" data-type="main" data-title="Multiple indexes">
  <div class="heading-group">
    <div class="main-title"><span class="h">Multiple</span> indexes</div>
  </div>
  <img class="width-90" src="/multiple_indexes.svg" alt="A diagram showing two indexes lists sorted in different order" />
</div>


![A diagram showing two indexes lists sorted in different order](/multiple_indexes.svg)

Instead we explicitly ask Firestore to create a new index that is based on these two fields and with their values properly sorted.

![A diagram showing a composite index list sorted by category and cost](/category_cost_composite_index.svg)

<div aria-hidden="true" class="slide" data-type="main" data-title="Composite indexes">
  <div class="heading-group">
    <div class="main-title"><span class="h">Composite</span> indexes</div>
  </div>
  <img class="width-50" src="/category_cost_composite_index.svg" alt="A diagram showing a composite index list sorted by category and cost" />
</div>

This is called a _composite index_ and it's what enables you to query beyond one field in Firestore. You might be thinking at this point: _"Why doesn't Firestore automatically create composite indexes for every document?"_ The problem there is that there are far too many possible combinations when it comes to composite indexing. A document of `20` fields would create 6,000,000,000,000,000 different combinations.

<div aria-hidden="true" class="slide" data-type="main" data-title="Why not...?">
  <div class="title">Why doesn't Firestore <span class="h">automatically create</span.> composite indexes for <span class="h">every document</span>?</div>
</div>

<div aria-hidden="true" class="slide" data-type="main" data-title="Because...">
  <div class="title">A document of <span class="h numeric">20</span> fields would create <span class="h numeric">6,000,000,000,000,000</span> different combinations.</div>
</div>

<div aria-hidden="true" class="slide" data-type="main" data-title="Demo & exercise">
  <div class="mega-title">Demo & Exercise</div>

  <ul class="code-callout">
    <li>cd /3-cloud-firestore/start</li>
    <li>npm i</li>
    <li>npm run dev</li>
    <li>http://localhost:3000/2/foundational-querying</li>
  </ul>
</div>

##### Demo
Demo time! Let's write some queries! Back the same 

<ul class="code-callout">
  <li>cd /3-cloud-firestore/start</li>
  <li>npm i</li>
  <li>npm run dev</li>
  <li>http://localhost:3000/2/foundational-querying</li>
</ul>

Now let's start looking into how Cloud Firestore handles arrays.

#### Array queries
Arrays in a realtime system can be pretty tricky. Array indexes are numeric and when data is being updated on the fly it really can shift things around and make them unpredictable. Firestore has a few conveniences in place to make dealing with arrays a lot easier.

<div aria-hidden="true" class="slide" data-type="main" data-title="Array queries">
  <div class="heading-group">
    <div class="main-title"><span class="h">Array</span> queries</div>
  </div>

  <div class="title"><em>Arrays</em> in a realtime system can be pretty tricky.</div>
</div>

Right now in our expenses collection, each document has a `category` field that is assigned to one string. But what if users wanted to be able to tag an expense with multiple categories? What would you do in that case? You could create a map and use its keys as the category names.

<div aria-hidden="true" class="slide" data-type="main" data-title="Using a map">
  <div class="heading-group">
    <div class="main-title">Using a <span class="h">map</span></div>
  </div>

```js
// don't do this!
const expenseQuery = query(
  expensesCol,
  where('categories.fun', '==', true),
  where('categories.food', '==' true),
);
```
</div>

The document would look like this:

<div aria-hidden="true" class="slide" data-type="main" data-title="Using a map">
  <div class="heading-group">
    <div class="main-title">Using a <span class="h">map</span></div>
  </div>

```js
{ 
  categories: {
    food: true,
    fun: true
  }
}
```
</div>

```js
{ 
  categories: {
    food: true,
    fun: true
  }
}
```

And the query would be a little awkward as well.

```js
// don't do this!
const expenseQuery = query(
  expensesCol,
  where('categories.fun', '==', true),
  where('categories.food', '==' true),
);
```

I mean this works, but it's not great. Instead we can use arrays.

<div aria-hidden="true" class="slide" data-type="main" data-title="Use arrays">
  <div class="heading-group">
    <div class="main-title">Using a <span class="h">map</span></div>
  </div>

```js
{ 
  categories: ['fun', 'food']
}
```
</div>


```js
{ 
  categories: ['fun', 'food']
}
```

In Firestore we have special queries for arrays.

##### array-contains
The `array-contains` operator allows you to query for documents using the values within an array.

<div aria-hidden="true" class="slide" data-type="main" data-title="array-contains">
  <div class="heading-group">
    <div class="main-title"><span class="h">array-contains</span></div>
  </div>

```js
const expenseQuery = query(
  expensesCol,
  where('categories', 'array-contains', 'fun'),
  limit(10),
);
```
</div>

```js
const expenseQuery = query(
  expensesCol,
  where('categories', 'array-contains', 'fun'),
  limit(10),
);
```

This query will return expenses which contain the `category` of `'fun'`. This is great when you have a use case for `AND` style queries. But if you need to find a document with more than one value, you need an `OR` style query.

##### array-contains-any
Using `array-contains-any` you can find documents by multiple `OR` values in an array.

```js
expensesQuery = query(
  expensesCol,
  where('categories', 'array-contains-any', ['fun', 'kids']),
  limit(25),
);
```

<div aria-hidden="true" class="slide" data-type="main" data-title="array-contains-any">
  <div class="heading-group">
    <div class="main-title"><span class="h">array-contains-any</span></div>
  </div>

```js
expensesQuery = query(
  expensesCol,
  where('categories', 'array-contains-any', ['fun', 'kids']),
  limit(25),
);
```
</div>

The result of this query will return expenses that contain the category of `'fun'` or `'kids'`. You might end up getting back an expense tagged as `'kids'` and 'transportation', maybe `'fun'` and 'food', or in some cases you'll get `'fun'` and `'kids'` if that pair exists.

##### Demo
Let's dive back into the code 

<ul class="code-callout">
  <li>cd /3-cloud-firestore/start</li>
  <li>npm i</li>
  <li>npm run dev</li>
  <li>http://localhost:3000/3/querying-arrays</li>
</ul>

Now this whole time we've been getting back an entire dataset or we've been limiting the result set. But how do you page through your data?

#### Range and Cursor queries
It's unlikely that you'll want to get all of your data back, that's bad for bandwidth and the amount of reads you'll be issuing. Instead we use Firestore's set of range and cursoring functions for pagination.

<div aria-hidden="true" class="slide" data-type="main" data-title="Range & Cursor queries">
  <div class="heading-group">
    <div class="main-title"><span class="h">Range</span> and cursor queries</div>
  </div>

  <div class="title"><em>Paginate</em> through <em>query results</em>.</div>
</div>

We've seen `limit()` this entire time, it returns only the first specified number of results. However, you can also return the _last_ specified number of results: with `limitToLast()`

```js
expensesQuery = query(
  expensesCol,
  where('date' ,'>=', new Date('1/1/2022')),
  orderBy('date'),
  limitToLast(10),
);
```

This query returns the _last_ `10` expenses from the date range greater than `1/1/2022`. If you wanted to keep expanding the set of results as a user scrolled or clicked a button you could be increasing the range in `limitToLast()`. Eventually, you would make it back to `1/1/2022`.

However, that would keep pulling back more and more data with every scroll or click. Instead it would querying for a range of values and moving the range as you go through the data set. This is known as _cursoring_ and Firestore comes with a set of useful cursor functions.

<div aria-hidden="true" class="slide" data-type="main" data-title="startAt">
  <div class="heading-group">
    <div class="main-title"><span class="h">startAt</span></div>
  </div>

```js
expensesQuery = query(
  expensesCol,
  orderBy('date'),
  startAt(new Date('1/1/2022')),
  limitToLast(10),
);
```
</div>

```js
expensesQuery = query(
  expensesCol,
  orderBy('date'),
  startAt(new Date('1/1/2022')),
  limitToLast(10),
);
```

This query returns the _last_ `10` expenses from the date range greater than `1/1/2022`, just like before, but now we have the ability to create a range with the `startAt()` function, now we can end the range with the `endAt()` function.

<div aria-hidden="true" class="slide" data-type="main" data-title="endAt">
  <div class="heading-group">
    <div class="main-title"><span class="h">endAt</span></div>
  </div>

```js
expensesQuery = query(
  expensesCol,
  orderBy('date'),
  startAt(new Date('1/1/2022')),
  endAt(new Date('2/1/2022')),
  limitToLast(10),
);
```
</div>

```js
expensesQuery = query(
  expensesCol,
  orderBy('date'),
  startAt(new Date('1/1/2022')),
  endAt(new Date('2/1/2022')),
  limitToLast(10),
);
```

This query will display the last `10` expenses starting from `2/1/2022` moving back towards `1/1/2022`. Given the size of the data set, it won't go back to `1/1/2022` within `10` results. So how do we get continue to get back without increasing the `limitToLast()` size? Cursor functions can also accept _document references_ as either starting or ending points.

<div aria-hidden="true" class="slide no-gap" data-type="main" data-title="References">
  <div class="main-title"><span class="h">References</span></div>

```js
expensesQuery = query(
  expensesCol,
  orderBy('date'),
  startAt(new Date('1/1/2022')),
  endAt(new Date('2/1/2022')),
  limitToLast(10),
);

// Click to get the next 10 or something
const querySnap = await getDocs(expensesQuery);
const firstDoc = querySnap.docs.at(0);
expensesQuery = query(
  expensesCol,
  orderBy('date'),
  startAt(new Date('1/1/2022')),
  endBefore(firstDoc),
  limitToLast(10),
);
```
</div>

```js
expensesQuery = query(
  expensesCol,
  orderBy('date'),
  startAt(new Date('1/1/2022')),
  endAt(new Date('2/1/2022')),
  limitToLast(10),
);

// Click to get the next 10 or something
const querySnap = await getDocs(expensesQuery);
const firstDoc = querySnap.docs.at(0);
expensesQuery = query(
  expensesCol,
  orderBy('date'),
  startAt(new Date('1/1/2022')),
  endBefore(firstDoc),
  limitToLast(10),
);
```

This one may look a little complicated, but let's take a moment to step through what's happening. We start by creating the same query as before. The last `10` expenses within `1/1/2022` to `2/1/2022`. Then we retrieve the docs in the query. In this case let's assume the user clicked on a button or scrolled to issue the query. After we have the documents, we'll get the very first one `.at(0)` and use that to create a new query that ends just right before that document. The `endBefore()` cursor function knows to cut off the range just right before it sees that document. If we repeat this process we'll eventually get back to the last `10` expenses in the full data set.

##### Demo & Exercise
Let's get to the code.

<div aria-hidden="true" class="slide" data-type="main" data-title="Demo & exercise">
  <div class="mega-title">Demo & Exercise</div>

  <ul class="code-callout">
    <li>cd /3-cloud-firestore/start</li>
    <li>npm i</li>
    <li>npm run dev</li>
    <li>http://localhost:3000/4/ranges-cursoring</li>
  </ul>
</div>

<ul class="code-callout">
  <li>cd /3-cloud-firestore/start</li>
  <li>npm i</li>
  <li>npm run dev</li>
  <li>http://localhost:3000/4/ranges-cursoring</li>
</ul>

#### NoSQL and joins
This entire time we've only queried _from one collection._ I'm sure a lot of you SQL developers are asking: How do you _join data_ from other collections?

<div aria-hidden="true" class="slide" data-type="main" data-title="Joins">
  <div class="heading-group">
    <div class="main-title">Where's the <span class="h">joins</span>?</div>
  </div>
</div>

The answer, just like anything in web development, is _that it depends on your situation_. This is another situation where it's helpful to look at what you might be used to in the SQL world.

##### Normalization
A cornerstone of SQL is data normalization. Normalization seeks to ensure that data is not duplicated across the database. This is commonly done through the use of foreign keys. Each row has a column that corresponds to another record in another table. 

<div aria-hidden="true" class="slide" data-type="main" data-title="Normalization">
  <img class="width-90" src="/tbl_join.svg" alt="Two SQL queries" />
</div>

![Two SQL tables](/tbl_join.svg)

<div aria-hidden="true" class="slide" data-type="main" data-title="Join query">

```sql
-- Can I have the user data and all of their expenses data as well? kthx!
SELECT e.id, e.cost, e.date, u.uid, u.first, u.last 
FROM tbl_expenses as e
INNER JOIN tbl_users as u ON e.uid = u.id
WHERE e.uid = 'david';
```
</div>

```sql
-- Can I have the user data and all of their expenses data as well? kthx!
SELECT e.id, e.cost, e.date, u.uid, u.first, u.last 
FROM tbl_expenses as e
INNER JOIN tbl_users as u ON e.uid = u.id
WHERE e.uid = 'david';
```

In this case we have `tbl_users` and `tbl_expenses`. Each expense row has a `uid` column that corresponds to a record in the users table. Referencing the data in a foreign key keeps the data from being duplicated, and possibly inconsistent, throughout the database. But what it does do, is it requires a query to build the result set of data. A query is pretty much a question:

This computes a result set back with all the data needed. Each time we need to ask this question we'll have to run this query, but we won't have to duplicate the data needed. _NoSQL is a bit different._

##### Denormalization
In NoSQL databases _you rely less on queries_ and more straightforward read operations. Let's remodel this the expenses app for a NoSQL database:

<div aria-hidden="true" class="slide" data-type="main" data-title="Denormalization">
  <img src="/denormalization.svg" alt="Denormalization" />
</div>

![Denormalization](/denormalization.svg)

Here we have two collections, users are indexed using the `uid` key. When I say "indexed" I mean what key are we using to find the record? In this case we are using the `uid` key to find a specific user. Expenses are indexed using a generated expenseId key. If you look at expenses, it has the expense data but also the user data as well. So getting the data is easy as a single query.

<div aria-hidden="true" class="slide" data-type="main" data-title="Simple query">

```js
let expensesQuery = query(
  collection(firestore, 'expenses'),
  where('user.uid', '==', 'david_123'),
);
```
</div>

```js
let expensesQuery = query(
  collection(firestore, 'expenses'),
  where('user.uid', '==', 'david_123'),
);
```

Now I can feel my ears burning which tells me that some of you out there are completely aghast to the data duplication going on. You might be saying "What if the user updates their name or other information! That data is going to be inconsistent!" Well, that's true. With NoSQL databases you do need to update that user data in every expense record.

That's a technique known as _fanout_. However, this isn't as bad of a concept as you might think. Fanout works really well in the case where data isn't often updated, much like a user's name. It's extremely fast to retrieve the data without having to calculate a complex query.

Fanout can be done behind the scenes, so the user can continue to use their app while the data is updating.

##### The denormalization spectrum
Now just because I can use fanout, it doesn't mean I always have to. In reality, I would not use fanout in this data structure. This is a _one-to-many_ data structure. _One user, many expenses._ I would get the logged in user with Firebase Authentication, then use their `uid` to get their profile data, and then get their expenses. 

<div aria-hidden="true" class="slide" data-type="main" data-title="Denormalization spectrum">

```js
let userQuery = doc(firestore, `users/${auth.currentUser.uid}`);
let expensesQuery = query(
  collection(firestore, 'expenses'),
  where('user.uid', '==', auth.currentUser.uid)
);











```
</div>

<div aria-hidden="true" class="slide" data-type="main" data-title="one-to-many">

```js
let userQuery = doc(firestore, `users/${auth.currentUser.uid}`);
let expensesQuery = query(
  collection(firestore, 'expenses'),
  where('user.uid', '==', auth.currentUser.uid)
);

// Issue a one-time read for the user
const userSnap = await getDoc(userQuery);








```
</div>

<div aria-hidden="true" class="slide" data-type="main" data-title="one-to-many">

```js
let userQuery = doc(firestore, `users/${auth.currentUser.uid}`);
let expensesQuery = query(
  collection(firestore, 'expenses'),
  where('user.uid', '==', auth.currentUser.uid)
);

// Issue a one-time read for the user
const userSnap = await getDoc(userQuery);
// Create a realtime listener for expenses
onSnapshot(expensesQuery, snapshot => {




});
```
</div>

<div aria-hidden="true" class="slide" data-type="main" data-title="one-to-many">

```js
let userQuery = doc(firestore, `users/${auth.currentUser.uid}`);
let expensesQuery = query(
  collection(firestore, 'expenses'),
  where('user.uid', '==', auth.currentUser.uid)
);

// Issue a one-time read for the user
const userSnap = await getDoc(userQuery);
// Create a realtime listener for expenses
onSnapshot(expensesQuery, snapshot => {
  console.log({
    user: userSnap.data(),
    expenses: 
  });
});
```
</div>

<div aria-hidden="true" class="slide" data-type="main" data-title="one-to-many">

```js
let userQuery = doc(firestore, `users/${auth.currentUser.uid}`);
let expensesQuery = query(
  collection(firestore, 'expenses'),
  where('user.uid', '==', auth.currentUser.uid)
);

// Issue a one-time read for the user
const userSnap = await getDoc(userQuery);
// Create a realtime listener for expenses
onSnapshot(expensesQuery, snapshot => {
  console.log({
    user: userSnap.data(),
    expenses: snapshot.docs.map(d => d.data()),
  });
});
```
</div>

```js
let userQuery = doc(firestore, `users/${auth.currentUser.uid}`);
let expensesQuery = query(
  collection(firestore, 'expenses'),
  where('user.uid', '==', auth.currentUser.uid)
);

// Issue a one-time read for the user
const userSnap = await getDoc(userQuery);
// Create a realtime listener for expenses
onSnapshot(expensesQuery, snapshot => {
  console.log({
    user: userSnap.data(),
    expenses: snapshot.docs.map(d => d.data()),
  });
});
```

This situation works really well for many types of data structures and especially _one-to-many_ relationships. Just because you're using a NoSQL database doesn't always mean you have to go full onboard the denormalization train. A lot of developers coming from SQL are worried that if they use a NoSQL database they'll have to pre-compute all their queries and into structures and fan out every data update for the rest of their life. But that's not the case.

_Denormalization isn't a rigid specification_, it's a spectrum. You decide how much data duplication is needed, if at all. While Firestore is not like a SQL database, it does have a sizable set of query features that help you find your right spot in this spectrum.

However, if I were in a scenario where I needed to query all expenses across all users: a _many-to-one_ relationship. I would strongly consider a denormalized strategy with an embedded `user` object/map like shown above. Otherwise my options would be to issue a read to get the user for each and every expense. And while this isn't as complicated as you think, how often is it that a user updates their profile information?

<div aria-hidden="true" class="slide" data-type="main" data-title="Flexible">
  <div class="heading-group">
    <div class="main-title"><span class="h">Flexible</span></div>
  </div>

  <div class="title">Denormalization isn't a rigid specification</div>
</div>


#### Hierarchy
Another thing we've done this entire time, is that we've only queried data from top level collections. In Firestore you can structure your data hierarchically. Collections contain documents, and documents can contain collections themselves, known as _subcollections_.

<div aria-hidden="true" class="slide" data-type="main" data-title="Hierarchy">
  <div class="heading-group">
    <div class="main-title"><span class="h">Hierarchy</span></div>
  </div>

1. Many _structures make sense_ in a hierarchy: think folders and files.
1. Hierarchies are based on paths, which can _reduce_ or _simplify queries_.
</div>

Why is the hierarchy important? Two main reasons:

1. Many _structures make sense_ in a hierarchy: think folders and files.
1. Hierarchies are based on paths, which can _reduce_ or _simplify queries_.

Let's take a look at this expenses database structure. The expenses collection has an index of a generated key. To get a user's expenses you'll need to run a query based on the `uid` field. As we've learned so far, when you begin to query on more than one field you start to have to build composite indexes, which you only have a limited number of. 

_What if we didn't have to build a query at all to get a user's expenses?_ What if we could do it with a straightforward read? Well, it turns out we can _if we use subcollections._

<div aria-hidden="true" class="slide" data-type="main" data-title="Subcollection">
  <img src="/subcollection.svg" alt="A diagram of a subcollection of expenses under a user document" />
</div>

![A diagram of a subcollection of expenses under a user document](/subcollection.svg)

Once you have a user's `uid` in hand all you'd have to do is read the expenses subcollection. 

<div aria-hidden="true" class="slide" data-type="main" data-title="Subcollection query">

```js
let expensesQuery = query(
  collection(firestore, 'users/david_123/expenses')
);
```
</div>

```js
let expensesQuery = query(
  collection(firestore, 'users/david_123/expenses')
);
```

No `where` clause needed. This not only makes it easier to query a single user's expenses, but it frees up a field for querying as well. 

One thing to note: _queries in Firestore are shallow_. This means when you query a document, you only get the document's data and not its subcollections.

<div aria-hidden="true" class="slide" data-type="main" data-title="Shallow">
  <div class="heading-group">
    <div class="main-title">Queries are <span class="h">shallow</span></div>
  </div>

  <div class="title">When you query a document, you only get the document's data and not its subcollections.</div>
</div>

Subcollections simplifies querying for all expenses from a _single user_. However, since queries are shallow, did we just lose the ability to query for all expenses across all users? Not quite, because Firestore has a special kind of query that handles this scenario.


<div aria-hidden="true" class="slide" data-type="main" data-title="How to get all?">
  <div class="heading-group">
    <div class="title">How do we query for <span class="h">all</span> expenses?</div>
  </div>

```js
let expensesQuery = query(
  collection(firestore, 'users/david_123/expenses')
);
```
</div>


##### Collection Group Queries
Whenver you have a common subcollection name is Firestore, you can create an index for a special kind of query called a _Collection Group Query._

<div aria-hidden="true" class="slide" data-type="main" data-title="Collection Group Queries">
  <img class="width-90" src="/collection_group_query.svg" alt="A diagram showing the common subcollection name of expenses across many documents" />
</div>

![A diagram showing the common subcollection name of expenses across many documents](/collection_group_query.svg)

In this case, each user document has a subcollection named expenses. Using the Firestore Console or just by clicking on a link, you can create an index and you'll be able to query across all expenses.

<div aria-hidden="true" class="slide" data-type="main" data-title="CSG example">

```js
let expenseGroup = collectionGroup(firestore, 'expenses');
expensesQuery = query(
  expenseGroup,
  where('categories', 'array-contains-any', ['food']),
);
```
</div>

<div aria-hidden="true" class="slide" data-type="main" data-title="CSG example">

```js
let expenseGroup = collectionGroup(firestore, 'expenses');
expensesQuery = query(
  expenseGroup,
  where('categories', 'array-contains-any', ['food']),
  where('cost', '>', 200),
  where('cost', '<', 210),
);
```
</div>

```js
let expenseGroup = collectionGroup(firestore, 'expenses');
expensesQuery = query(
  expenseGroup,
  where('cost', '>', 200),
  where('cost', '<', 210),
  where('categories', 'array-contains-any', ['food']),
);
```

Now we have the best of both worlds. We can query across single users and we can query across all expenses.

##### Demo
Time for another demo!

<div aria-hidden="true" class="slide" data-type="main" data-title="Demo & Exercise">
  <div class="heading-group">
    <div class="main-title">Demo & exercise</div>
  </div>

  <ul class="code-callout">
    <li>cd /3-cloud-firestore/start</li>
    <li>npm i</li>
    <li>npm run dev</li>
    <li>http://localhost:3000/5/collection-group-queries</li>
  </ul>
</div>

<ul class="code-callout">
  <li>cd /3-cloud-firestore/start</li>
  <li>npm i</li>
  <li>npm run dev</li>
  <li>http://localhost:3000/5/collection-group-queries</li>
</ul>

#### Atomicity
One of the most important aspects of a database is being able to handle multiple operations in an _all or nothing_ fashion. If one operation fails, rollback the entire process. This concept is known as _atomicity._

<div aria-hidden="true" class="slide" data-type="main" data-title="Atomicity">
  <div class="heading-group">
    <div class="main-title"><span class="h">Atomicity</span></div>
  </div>

  <div class="title">If one operation fails, rollback the entire process.</div>
</div>

<div aria-hidden="true" class="slide" data-type="main" data-title="batches and transactions">
  <div class="heading-group">
    <div class="main-title"><span class="h">Batched Writes</span> and <span class="h">Transactions</span></div>
  </div>
</div>

In Firestore you can achieve atomicity through two but different ways: _batched writes_ and _transactions._

##### Batched Write
A Batched Write allows you to store an entire set of set, update, or delete operations into a single "batch" and them "commit" these operations. 

<div aria-hidden="true" class="slide" data-type="main" data-title="Atomicity">

```js
import { writeBatch, doc, collection, serverTimestamp } from "firebase/firestore"; 

let batch = writeBatch(firestore);
// batch.set(), batch.update(), batch.delete()
// batch.commit()
```
</div>


```js
import { writeBatch, doc, collection, serverTimestamp } from "firebase/firestore"; 

let batch = writeBatch(firestore);
// batch.set(), batch.update(), batch.delete()
// batch.commit()
```

If even one operation fails the entire batch won't go through.

```js
import { writeBatch, doc, collection, serverTimestamp } from "firebase/firestore"; 

let batch = writeBatch(firestore);
let expensesCol = collection(firestore, 'users/david_123/expenses');
batch.set(doc(expensesCol), { 
  categories: ['food'], 
  cost: 123.23, 
  date: serverTimestamp(),
})
batch.update(doc(expensesCol, 'i-know-this-id'), { 
  categories: ['transportation', 'fun'],
})
batch.delete(doc(expensesCol, 'i-know-another-id'));

try {
  await batch.commit();
} catch(error) {
  // was there a problem? if so, roll it all back
}
// If not, we're done!
```

<div aria-hidden="true" class="slide" data-type="main" data-title="BW sample">

```js
import { writeBatch, doc, collection, serverTimestamp } from "firebase/firestore"; 

let batch = writeBatch(firestore);
let expensesCol = collection(firestore, 'users/david_123/expenses');
















```
</div>

<div aria-hidden="true" class="slide" data-type="main" data-title="BW sample">

```js
import { writeBatch, doc, collection, serverTimestamp } from "firebase/firestore"; 

let batch = writeBatch(firestore);
let expensesCol = collection(firestore, 'users/david_123/expenses');
batch.set(doc(expensesCol), { 
  categories: ['food'], 
  cost: 123.23, 
  date: serverTimestamp(),
})











```
</div>

<div aria-hidden="true" class="slide" data-type="main" data-title="BW sample">

```js
import { writeBatch, doc, collection, serverTimestamp } from "firebase/firestore"; 

let batch = writeBatch(firestore);
let expensesCol = collection(firestore, 'users/david_123/expenses');
batch.set(doc(expensesCol), { 
  categories: ['food'], 
  cost: 123.23, 
  date: serverTimestamp(),
})
batch.update(doc(expensesCol, 'i-know-this-id'), { 
  categories: ['transportation', 'fun'],
})








```
</div>

<div aria-hidden="true" class="slide" data-type="main" data-title="BW sample">

```js
import { writeBatch, doc, collection, serverTimestamp } from "firebase/firestore"; 

let batch = writeBatch(firestore);
let expensesCol = collection(firestore, 'users/david_123/expenses');
batch.set(doc(expensesCol), { 
  categories: ['food'], 
  cost: 123.23, 
  date: serverTimestamp(),
})
batch.update(doc(expensesCol, 'i-know-this-id'), { 
  categories: ['transportation', 'fun'],
})
batch.delete(doc(expensesCol, 'i-know-another-id'));







```
</div>

<div aria-hidden="true" class="slide" data-type="main" data-title="BW sample">

```js
import { writeBatch, doc, collection, serverTimestamp } from "firebase/firestore"; 

let batch = writeBatch(firestore);
let expensesCol = collection(firestore, 'users/david_123/expenses');
batch.set(doc(expensesCol), { 
  categories: ['food'], 
  cost: 123.23, 
  date: serverTimestamp(),
})
batch.update(doc(expensesCol, 'i-know-this-id'), { 
  categories: ['transportation', 'fun'],
})
batch.delete(doc(expensesCol, 'i-know-another-id'));

try {
  await batch.commit();
} catch(error) {
  
}

```
</div>

<div aria-hidden="true" class="slide" data-type="main" data-title="BW sample">

```js
import { writeBatch, doc, collection, serverTimestamp } from "firebase/firestore"; 

let batch = writeBatch(firestore);
let expensesCol = collection(firestore, 'users/david_123/expenses');
batch.set(doc(expensesCol), { 
  categories: ['food'], 
  cost: 123.23, 
  date: serverTimestamp(),
})
batch.update(doc(expensesCol, 'i-know-this-id'), { 
  categories: ['transportation', 'fun'],
})
batch.delete(doc(expensesCol, 'i-know-another-id'));

try {
  await batch.commit();
} catch(error) {
  // was there a problem? if so, roll it all back
}
```
</div>

A good usecase for Batched Writes are for when you are updating denormalized data across the database. If you aren't able to successfully update everything in one go, you likely want to roll back and try again.

<div aria-hidden="true" class="slide" data-type="main" data-title="500 limit">
  <div class="heading-group">
    <div class="title"><span class="h">Batched Writes</span> have a limit of <span class="h numeric">500</span> documents per batch.</div>
  </div>
</div>

<div aria-hidden="true" class="slide" data-type="main" data-title="500 limit">
  <div class="heading-group">
    <div class="title"><span class="h">Updaing</span> over a period of time is common.</div>
  </div>
</div>

One thing to note is that Batched Writes have a limit of `500` documents per batch. If you need to update more than `500` documents at time you'll need to create multiple batches. This does mean you could be in a state where some batches succeed and some fail. For these multi-batch situations it's best to execute them using our server libraries. In general though, updating data over a period of time is a common practice many NoSQL databases.

Batched Writes are good for atomic processess, but they are only good for updating data _without caring about the existing data in place._ They are an overwrite style operation and they have no knowledge of the given set of data. In fact, if you needed to know the current state of data you'd have to read the data first and then update it via a Batched Write. 

The problem there is that the read isn't an atomic operation. That data could be out of date well before the batch commits, which could lead to all sorts of inconsistent states in your database. This is especially problematic for games or systems that need rules followed in certain order. For those situations, you can use transactions.

##### Transactions
Transactions allow you to run multiple operations in an atomic process including the access to reading data. This allows you to do important things in order, like update scores, and other process based data. This keeps users or events from going "out of turn."

<div aria-hidden="true" class="slide" data-type="main" data-title="Transactions">
  <div class="heading-group">
    <div class="main-title"><span class="h">Transactions</span></div>
  </div>

  <div class="title">Run multiple operations in an atomic process including the access to reading data</div>
</div>

In many databases, transactions will lock the entity until the transaction is completed. The Firestore client libraries want to avoid locking a document. Clients are often unpredictable in their network state, imagine if a client locked a document and then went offline. 

<div aria-hidden="true" class="slide" data-type="main" data-title="Optimistic concurrency control">
  <div class="heading-group">
    <div class="main-title"><span class="h">Optimistic Concurrency Control</span></div>
  </div>

  <div class="title">Instead of locking, Firestore will retry the transaction if something has changed from the first read.</div>
</div>

Instead of locking, Firestore will retry the transaction if something has changed. This is known as _optimistic concurrency control_, which will make you sound very fancy to say at parties.

<div aria-hidden="true" class="slide" data-type="main" data-title="Transaction">

```js
import { runTransaction } from "firebase/firestore";

const pointsAwarded = // get from web app;

try {
  
   
    
      
    

    
    
    
    
    
  
  console.log('Transaction successfully committed!');
} catch (e) {
  console.log('Transaction failed: ', e);
}
```
</div>

<div aria-hidden="true" class="slide" data-type="main" data-title="Transaction">

```js
import { runTransaction } from "firebase/firestore";

const pointsAwarded = // get from web app;

try {
  await runTransaction(firestore, async (transaction) => {
    
    
      
    

    
    
    
    
    
  });
  console.log('Transaction successfully committed!');
} catch (e) {
  console.log('Transaction failed: ', e);
}
```
</div>

<div aria-hidden="true" class="slide" data-type="main" data-title="Transaction">

```js
import { runTransaction } from "firebase/firestore";

const pointsAwarded = // get from web app;

try {
  await runTransaction(firestore, async (transaction) => {
    const gameDoc = await transaction.get(gameRef);
    if (!gameDoc.exists()) {
      throw "Document does not exist!";
    }

    
    
    
    
    
  });
  console.log('Transaction successfully committed!');
} catch (e) {
  console.log('Transaction failed: ', e);
}
```
</div>

<div aria-hidden="true" class="slide" data-type="main" data-title="Transaction">

```js
import { runTransaction } from "firebase/firestore";

const pointsAwarded = // get from web app;

try {
  await runTransaction(firestore, async (transaction) => {
    const gameDoc = await transaction.get(gameRef);
    if (!gameDoc.exists()) {
      throw "Document does not exist!";
    }

    const data = gameDoc.data();
    // Add to the score state
    const score = data.score + pointsAwarded;
    
    
  });
  console.log('Transaction successfully committed!');
} catch (e) {
  console.log('Transaction failed: ', e);
}
```
</div>

<div aria-hidden="true" class="slide" data-type="main" data-title="Transaction">

```js
import { runTransaction } from "firebase/firestore";

const pointsAwarded = // get from web app;

try {
  await runTransaction(firestore, async (transaction) => {
    const gameDoc = await transaction.get(gameRef);
    if (!gameDoc.exists()) {
      throw "Document does not exist!";
    }

    const data = gameDoc.data();
    // Add to the score state
    const score = data.score + pointsAwarded;
    // Run the transaction
    transaction.update(gameDoc, { score });
  });
  console.log('Transaction successfully committed!');
} catch (e) {
  console.log('Transaction failed: ', e);
}
```
</div>

```js
import { runTransaction } from "firebase/firestore";

const pointsAwarded = // get from web app;

try {
  await runTransaction(firestore, async (transaction) => {
    const gameDoc = await transaction.get(gameRef);
    if (!gameDoc.exists()) {
      throw "Document does not exist!";
    }

    const data = gameDoc.data();
    // Add to the score state
    const score = data.score + pointsAwarded;
    // Run the transaction
    transaction.update(gameDoc, { score });
  });
  console.log('Transaction successfully committed!');
} catch (e) {
  console.log('Transaction failed: ', e);
}
```

In this example we're getting new points awarded from a game. The transaction will run and attempt to update the new score. If the score is updated before this transaction runs, the transaction will try to run again to keep the state correct. 

With transactions it's important to follow a process:

1. Read first - Get the state you need to update
2. Update state - Perform the business logic (e.g. update game state)
3. First attempt - Then a write is attempted and will succeed if the data is up to date.
4. Double checking - Firestore looks to ensure that nothing indeed has changed from the first reed.
5. Something change? - If data has changed from the first read, the transaction is re-tried.

Since transactions can retry, they can act a little funny. First of all, don't modifiy any application or UI state within a transaction. This can lead to some seriously confusing bugs within your app because they will run more than once when a transaction is retried. If you want to open a `<dialog>`, don't do it within the transaction, wait for the transaction to complete.

```js
try {
  await runTransaction(firestore, async (transaction) => {
    // Do your transaction stuff
  });
  // Only after the promise has resolved
  successDialog.open();
} catch (error) {
  
}
```

Secondly, transactions will fail when an app goes offline, which is a good thing. Transactions are based off having the most up to date read, and that can't happen while you're offline.

#### Authentication and security
The database is still not secure, any user can read, write, update, or delete anything they want from the database. Like I've said before, the fix is security rules, however before we can get to writing these rules we have to cover our basis with authentication.

<div aria-hidden="true" class="slide" data-type="main" data-title="Authentication and security">
  <div class="heading-group">
    <div class="main-title"><span class="h">Authentication</span> and security</div>
  </div>

  <div class="title">The database is still not secure.</div>
</div>
