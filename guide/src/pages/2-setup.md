---
layout: ../layouts/GuideLayout.astro
title: Setting up
order: 2
subtitle: Working from best practices. <span class="highlight">Emulators</span>, <span class="highlight">security</span>, and <span class="highlight">preview channels</span>.
previous:
  name: Intro
  href: /1-intro
next:
  name: Cloud Firestore
  href: /3-cloud-firestore
---

#### What went wrong?
We saw a lot happen in that naive project. There was some good there, we created a realtime listener, did anonymous authentication, but there was no real good foundation. What was wrong?

#### Security
Security is obviously the most glaring problem. With one DELETE request the entire database went away. In Firebase we use security rules and we'll cover that IN DEPTH later today. I'll also speak to them when designing the database and auth patterns. Maybe discuss AppCheck.

#### Code structure
I used `initializeApp()` everywhere. I had firebase imports littered in every file.

#### Production services
The entire site connects out to a production service. This is bad for billing, data integrity, and for general developer convenience. Emulators.

#### Deployment
Deploying to production each and every time is risky. Preview channels.

#### Data Model
I didn't take any time to think about my data model. Firestore is a NoSQL database that is not as query rich as other databases. There's many advantages and disadvantages to this. The primary advantages being, it's realtime, scales horizontally, and it's flexible with its data storage. When building for any database you want to lean into the advantages and that's not happening here.

#### Synchronization
One of the cornerstones of Firebase is data synchronization. But what does that fancy term really mean? One mechanism of realtime messaging is called pub/sub. You publish a message and any client that is subscribed, receives it in realtime. But the kicker is that, you only get the message. That sounds normal right? But let's say you're building a todo app and you add a new todo, so you publish that message. Well each client receives that message and then adds it to the local data model. Each client could have slightly different code or logic, and that makes the data representation different and causes bugs. Synchronization is different. With synchronization, you publish a todo item as a message, and the server adds it to a database, and publishes the whole new data model that every client would have needed to compute. That's what Firestore does inside of the listener.

#### Unidirectional Data Flow
You may have noticed that there was a common pattern with the Firebase SDK. We never asked for updates explicitly. We would issue a change of some kind then listen for it in a callback. This is sometimes different for many developers, but it really helps keep an app snappy and responsive to user input. 

Take a look at `addDoc()`. We're not returning the new array data from the collection, it's just a receipt that the server got the update. 

#### Let's do this again
Let's take this project and give it a proper Firebase foundation.

<ul class="code-callout">
  <li>cd /2-best-practices-setup</li>
  <li>npm i</li>
  <li>npm run dev</li>
  <li># or follow along</li>
</ul>
