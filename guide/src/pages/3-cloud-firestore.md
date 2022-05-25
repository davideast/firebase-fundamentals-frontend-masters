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

We saw that with security it's really important to have authentication figured out. But! We're going to start with the database, because well that's the fun part.

#### SQL and NoSQL
Firestore is a NoSQL document database, with realtime and offline capabilities. Firestore is designed to not allow slow queries. In fact, if you manage to write a slow query with Firestore it's likely because you're downloading too many documents at once. With Firestore you can query for data, and receive updates within `500ms` every time a data updates within the database. 

Many developers come to NoSQL with at least some SQL experience. They are used to a world of schemas, normalization, joins, and rich querying features. NoSQL tends to be a bit of jarring experience at first because it has different priorities. With Firestore we priorize database reads over writes. In a SQL world uniformity and reducing data duplication are at the utmost priority.

READS / WRITES

This is shown with the basic data structures.

##### Tables and Collections 
SQL databases use tables to structure data.

##### Rows & Columns, Documents & Fields
You can think of tables in two dimensions: rows and columns. Rows are a single record or object within the table. Columns are the properties on that object. Columns provide a rigid but high level of integrity to your data structure. You can't add a single column onto a single row. If a new column is created, every row gets that column even if the value is just null.

NoSQL databases are a bit different. Firestore consists of documents, which are like enhanced objects. They're not just basic JSON objects, they can store complex types of data like binary data, references to other documents, timestamps, geo-coordinates, and so on and so forth. Now in SQL all rows had to have the same columns. But that's not the case in NoSQL every document can have whatever structure it wants. Each document can be totally different from the other if you want. That's usually not the case in practice, but you have total flexibility at the database level. You can lock down the schema with security rules, but we'll get into that later.

#### Data types

##### Core types

##### Complex types

#### Retrieving data
With SQL you think about retrieving data in terms of queries. While that is still true here, you should primarily think about data in terms of locations with path names. In the JavaScript SDK we call this a reference.

##### References

Documents and collections are identified by a unique path, to refer to this location you create a reference.

```js
const usersCollectionReference = collection(db, 'users');
// or for short
const usersCol = collection(db, 'users');
// get a single user
const userDoc = doc(db, 'users/david');
```

Both of those references will allow you to get all of the data at that location. For collections, we can query to restrict the result set down a bit more. For single documents, you retrieve the whole document so there's no querying needed.

##### onSnapshot()
With a reference made, we have a decision to make. Do we want to get the data one time, or do we want the realtime synchronized data state every time there's an update at that location? The realtime option sounds fun, so let's do that first.

```js
onSnapshot(userDoc, snapshot => {
  console.log(snapshot);
});

onSnapshot(usersCol, snapshot => {
  console.log(snapshot);
});
```

The `onSnapshot()` function takes in either a collection or document reference. It returns the state of the data in the callback function and will fire again for any updates that occur at that location. What you notice too is that it doesn't return the data directly. It returns an object called a snapshot. A snapshot is an object that contains the data and a lot of important information about its state as well. We'll get into the other info in a bit, but to get the actual data, you tap into the data function.

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
  console.log(snapshot.docs.map(d => d.data());
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

This isn't just local, this callback fires across all connected devices.

##### Mutation functions
Speaking of updates. What we see right here is one of the several update functions or as we call them mutation functions.

- `setDoc()`
- `updateDoc()`
- `deleteDoc()`
- `setDoc(..., { merge: true })`

Now that's for single documents. What about adding new items to a collection? Do you have to think of a new ID every time?

```js
const someDoc = doc(db, 'users/some-name'); // ??
// Generated IDs!
addDoc(usersCol, { name: 'Darla' });
// The ids are generated locally as well
const newDoc = doc(userCol);
console.log(newDoc.id); // generated id, no data sent to the server
setDoc(newDoc, { name: 'Fiona' }); // Now it's sent to the server
```

Now there's one thing you should notice here. We're making updates to the server, but nowhere are we awaiting the result of the update. It's still an async operation, but why aren't we awaiting the result?

##### Synchronization
I'm about to dive into one of the core principles of the Firebase SDKs: unidirectional data-flow. If you've ever used React, Redux, or something similar you'll be familiar with this concept.

In a CRUD like system you'll make a request to a server to create a resource and get the result back in the response.

```js
const response = await fetch('/api/users', { method: 'POST', body: bodyData });
const newUser = await response.json();
console.log(newUser.id);
```

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

##### The Cache
One of the important properties of a snapshot is metadata. 

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

  // Third time, data is verified by the server: 
  // { fromCache: false, hasPendingWrite: false }
});

updateDoc(userDoc, { name: 'David!' });
```

This tells you information about whether the data has been sent to the server and the snapshot was delivered from Firestore's local cache or directly from the network.

// TODO: Run this test to make sure the 2nd emission happens this way. You may need to use the listen config. Also check out duplication logic within listeners. Maybe just take the time to meet with the SDK team as well.

As you can see, Firestore is really powerful when it comes to realtime synchronization and offline capabilities. We haven't even begun to see querying yet either, but don't worry, it's just up ahead.

##### Exercise
Let's take a break to write some code. I'll start with a small demo and I'll have you repeat after me.

<ul class="code-callout">
  <li>cd /3-cloud-firestore/start</li>
  <li>npm i</li>
  <li>npm run dev</li>
  <li>http://localhost:3000/1/realtime-streams</li>
</ul>

Once we're done. We'll get into querying.

#### Simple queries
Cloud Firestore is designed to scale up queries despite the number of documents it queries. A Firestore query has to search through `50` documents to only return `5`, will roughly be the same as a query that searches through `5,000,000` that also only returns `5`. These queries have to be fast every time not only because fast is good, but also because these queries have to work in realtime as well. Every query you can formulate in Firestore works with `onSnapshot()` for realtime streams and also works offline as well.

In Cloud Firestore we mainly have _two types_ of queries: _simple_ and _composite_. _Simple queries_ involve querying based on _one field_.

```js
import { collection, query, where, limit, getFirestore } from 'firebase/firestore';

const db = getFirestore();
const expensesCol = collection(db, 'expenses');
const expensesQuery = query(
  where('cost', '>', 200),
  limit(100),
);
```

This query looks for expenses greater than `$200` and returns the first `100`. The only field that is used for the query is `cost`. The `limit()` function is just a restriction of the amount returned. Simple queries can have more than one where clause as well, as long as it's on the same field.

```js
import { collection, query, where, limit, getFirestore } from 'firebase/firestore';

const db = getFirestore();
const expensesCol = collection(db, 'expenses');
const expensesQuery = query(
  where('cost', '>', 200),
  where('cost', '<', 210),
  limit(100),
);
```

This is still a simple query because the only field involved in the query is still `cost`. In Firestore you can also query within objects/maps.

```js
let expensesQuery = query(
  expensesCol,
  where('user.city', '==', 'Maputo'),
  limit(100)
);
```

The "dot" notation allows you to drill into an object/map, this works up to about `20` nested objects deep. Now this equality query may not look too exciting, so let's spice it up a bit and look for multiple cities.

```js
let expensesQuery = query(
  expensesCol,
  where('user.city', 'in', ['Maputo', 'Buenos Aires', 'Santiago']),
  limit(100)
);
```

Still only using one field, we're looking for all expenses for users located in three cities. What about the opposite? Can we query based on a not-equals clause?

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

This will exclude all these cities from the query. It's worth mentioning that the not-in clause does come with some limitations, you can supply only 10 values.

Some segue into query operators.

##### Equality Operators
Blah. Blah.

##### Inequality Operators
Blah. Blah.

#### Composite Queries
So far though, we've only seen what queries look like on one field. How do we specify queries for two or more fields? Well, there's some good news and… less great news on this front. Firestore will allow you to query based on two fields and return them just as fast as ever.

```js
const expensesQuery = query(
  expensesCol,
  where('cost', '>', 200),
  where('cost', '<', 210),
  where('category', 'in', ['fun', 'food', 'kids']),
  limit(100),
);
```

The catch is that these queries require a special index called a composite index. Fortunately these indexes can be automatically created for you. When you run a composite query that doesn't have an index created we'll log out a link to the browser console for you to click on and then create a new index.

##### Exercise
Exercise time! Let's write some queries! Back the same 

<ul class="code-callout">
  <li>cd /3-cloud-firestore/start</li>
  <li>npm i</li>
  <li>npm run dev</li>
  <li>http://localhost:3000/2/foundational-querying</li>
</ul>

Now let's start looking into how Cloud Firestore handles arrays.

#### Array queries
Arrays in a realtime system can be pretty tricky. Array indexes are numeric and when data is being updated on the fly it really can shift things around and make them unpredictable. Firestore has a few conveniences in place to make dealing with arrays a lot easier.

Right now in our expenses collection, each document has a `category` field that is assigned to one string. But what if users wanted to be able to tag an expense with multiple categories? What would you do in that case? You could create a map and use its keys as the category names.

The document would look like this:

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

```js
{ 
  categories: ['fun', 'food']
}
```

In Firestore we have special queries for arrays.

##### array-contains
The `array-contains` operator allows you to query for documents using the values within an array.

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

The result of this query will return expenses that contain the category of `'fun'` or `'kids'`. You might end up getting back an expense tagged as `'kids'` and 'transportation', maybe `'fun'` and 'food', or in some cases you'll get `'fun'` and `'kids'` if that pair exists.

##### in, not-in
We saw this a bit before, but in and not-in can also be used on arrays.

##### Exercise
Let's dive back into the code 

<ul class="code-callout">
  <li>cd /3-cloud-firestore/start</li>
  <li>npm i</li>
  <li>npm run dev</li>
  <li>http://localhost:3000/4/querying-arrays</li>
</ul>

Now this whole time we've been getting back an entire dataset or we've been limiting the result set. But how do you page through your data?

#### Range and Cursor queries
It's unlikely that you'll want to get all of your data back.

##### Exercise
Go to the code for this.

<ul class="code-callout">
  <li>cd /3-cloud-firestore/start</li>
  <li>npm i</li>
  <li>npm run dev</li>
  <li>http://localhost:3000/5/ranges-cursoring</li>
</ul>

#### Hierarchy, normalization, denormalization
Talk about how hierarchy is good for keys and stuff like that.

##### Normalization
```sql
-- Can I have the user data and all of their expenses data as well? kthx!
SELECT e.id, e.cost, e.date, u.user_id, u.first, u.last 
FROM tbl_expenses as e
INNER JOIN tbl_users as u ON e.user_id = u.id
WHERE e.user_id = 'david';
```

A cornerstone of SQL is data normalization. Normalization seeks to ensure that data is not duplicated across the database. This is commonly done through the use of foreign keys. Each row has a column that corresponds to another record in another table. In this case we have `tbl_users` and `tbl_expenses`. Each expense row has a `user_id` column that corresponds to a record in the users table. Referencing the data in a foreign key keeps the data from being duplicated, and possibly inconsistent, throughout the database. But what it does do, is it requires a query to build the result set of data. A query is pretty much a question:

This computes a result set back with all the data needed. Each time we need to ask this question we'll have to run this query, but we won't have to duplicate the data needed. NoSQL is a bit different.

#### Denormalization
In NoSQL databases you rely less on queries and more straightforward read operations. Let's remodel this the expenses app for a NoSQL database:

```txt
/users/{uid}
  - { first, last, birthday }
/expenses/{expenseId}
  - { cost, date, category, uid, first, last }
```

```js
getDocs(collection(db, 'expenses'))
```

Here we have two collections, users are indexed using the userId key. When I say "indexed" I mean what key are we using to find the record? In this case we are using the "userId" key to find a specific user. Expenses are indexed using a generated expenseId key. If you look at expenses, it has the expense data but also the user data as well. So getting the data is easy as…

No real "query" is needed. No where statements, or other clauses. Now I can feel my ears burning which tells me that some of you out there are completely aghast to the data duplication going on. You might be saying "What if the user updates their name or other information! That data is going to be inconsistent!" Well, that's true. With NoSQL databases you do need to update that user data in every expense record. That's a technique known as fanout. However, this isn't as bad of a concept as you might think. Fanout works really well in the case where data is rarely updated, much like a user's name. Also fanout can be done without locking up the database, so the user can continue to use their app while the data is updating. There's no wait time unlike a query.

#### The denormalization spectrum
Now this is a contrived situation. In reality, I would not use fanout in this data structure. This is a 1-to-many data model. One user, many expenses. I would simply read the user data first, and then get their expenses. Just because you're using a NoSQL database doesn't always mean you have to go full onboard the denormalization train. A lot of developers coming from SQL are worried that if they use a NoSQL database they'll have to pre-compute all their queries and into structures and fan out every data update for the rest of their life. But that's not the case.

Denormalization isn't a rigid specification, it's a spectrum. You decide how much data duplication is needed, if at all. While Firestore is not like a SQL database, it does have a sizable set of query features that help you find your right spot in this spectrum. And the awesome thing about Firestore, is that while the query capabilities are limited, the queries are designed to be fast and scalable. This means it's a lot harder to write a query that will take forever to compute. And actually the way queries work in Firestore is that: The time it takes to run a query is proportional to the number of results you get back, not the number of documents you're searching through.

With all of the NoSQL primer out of the way, let's take a look at the types that make up the data.

##### Hierarchy

##### Collection Group Queries

##### Exercise
Go to the code for this.

<ul class="code-callout">
  <li>cd /3-cloud-firestore/start</li>
  <li>npm i</li>
  <li>npm run dev</li>
  <li>http://localhost:3000/6/collection-group-quries</li>
</ul>

#### Authentication and security
The database is still not secure, any user can read, write, update, or delete anything they want from the database. Like I've said before, the fix is security rules, however before we can get to writing these rules we have to cover our basis with authentication.

