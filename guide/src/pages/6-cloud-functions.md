---
layout: ../layouts/GuideLayout.astro
title: Cloud Functions
order: 6
subtitle: <span class="highlight">Serverless triggers</span>, <span class="highlight">server-side</span> rendering, and <span class="highlight">denormalization</span>.
previous:
  name: Security Rules
  href: /5-security-rules
next: 
  name: Home
  href: /
---

Firebase architecture can be heavily based on the client at times. However, sometimes you need a server. You might need to process payments, send emails, or handle admin actions that should be accessible by a client. For all those things we have _Cloud Functions_.

<div aria-hidden="true" class="slide" data-type="main" data-title="Cloud Functions">

  <div class="title">Cloud <span class="highlight">Functions</span></div>
  <div class="side-grid firestore">
    <div class="numeric-side">
      <div class="highlight mega-number">Events</div>
      <div class="subtitle">Serverless</div>
    </div>
    <div class="subtitle">
      <span class="highlight">Cloud Functions</span> allows you write <span class="highlight">server code</span> in response to events that happen within <span class="highlight">Firebase</span>.
    </div>
  </div>
  
</div>

#### Serverless & event driven
Cloud Functions allows you write server code that runs in response to events that happen within Firebase. Whenever a document in Firestore is created, run some server code. Whenever a user is created in Firebase Authenticated, send an welcome email. 

<div aria-hidden="true" class="slide" data-type="main" data-title="Serverless & event driven">
  <div class="heading-group">
    <div class="main-title"><span class="highlight">Serverless</span> and event driven</div>
  </div>
  
- Whenever a document in Firestore is created, call an external API. 
- Whenever a user is created in Firebase Authenticated, send an welcome email. 
  </p>
</div>


##### Background triggers
We refer to these events as _triggers_. Whenever you complete an action on the client SDK you _trigger_ an event on the server.

<div aria-hidden="true" class="slide" data-type="main" data-title="Background triggers">
  <div class="heading-group">
    <div class="main-title"><span class="highlight">Serverless</span> and event driven</div>
  </div>
  
  <p class="title">Complete an action on the client, <em>trigger</em> an event on the server</p>
</div>


##### Trusted environment
Cloud Functions are considered a trusted environment. This means you can use the Admin SDK and perform powerful actions on behalf of users. Though as always, you need to be cautious when using the Admin SDK with Firestore because it bypasses all Security Rules.

<div aria-hidden="true" class="slide" data-type="main" data-title="Trusted Enviroments">
  <div class="heading-group">
    <div class="main-title"><span class="highlight">Functions</span> are trusted</div>
  </div>
  
  <p class="title">
    Functions are a trusted environment. This means you can use the Admin SDK.
  </p>
</div>

##### Understanding cold start
When a function is triggered it takes time to boot up and run your code. This process of going from _cold_ to _warm_ is referred to as the _cold start_. This time period can take anywhere between `500ms` to several seconds depending on several factors such as the size of the function's dependencies (your `node_modules` for example).

<div aria-hidden="true" class="slide" data-type="main" data-title="Cold Start">
  <div class="heading-group">
    <div class="main-title"><span class="highlight">Cold</span> start</div>
  </div>
  
  <p class="title">
    When a function is triggered it takes time to boot up and run your code.
  </p>
</div>

<div aria-hidden="true" class="slide" data-type="main" data-title="Cold Start">
  <div class="heading-group">
    <div class="main-title"><span class="highlight">Cold</span> start</div>
  </div>
  
  <p class="title">
    Ranges anywhere between <code>500ms</code> or higher depending on several factors.
  </p>
</div>

For many types of functions this isn't a huge deal since they are background triggers. The work happens behind the scenes to the user and it's not a big deal if the cold boot takes a second or two. However, there's other situations where it's vital: such as server side rendering web pages. For these kind of situations you have a handful of tools at your disposal for dropping cold start times, such as [minimum instances](https://firebase.google.com/docs/functions/manage-functions#reduce_the_number_of_cold_starts) and the [caching content in Firebase Hosting's CDN](https://firebase.google.com/docs/hosting/manage-cache).

##### v1 vs v2
One thing I wasn't sure I was going to put in this section was the difference between Cloud Functions v1 and Cloud Functions v2. Cloud Functions launched way back in 2017 and very recently (this year in 2022) [we launched Cloud Functions v2](https://cloud.google.com/blog/products/serverless/introducing-the-next-generation-of-cloud-functions). What's the main difference? _Concurrency_.

<div aria-hidden="true" class="slide" data-type="main" data-title="v1 and v2">
  <div class="heading-group">
    <div class="main-title"><span class="h">v1</span> and <span class="h">v2</span></div>
  </div>
  
  <p class="title">
    Recently a new generation of Cloud Functions was launched and it has great implications for <span class="h">cold start</span>.
  </p>
</div>


##### Concurrency
In Cloud Functions v1 you a function instance can serve one request per function. This model is clear but leads to a lot of cold starts. In Cloud Functions v2 you a single function instance can handle multiple requests, `80` by default, and up to a `1,000`. This means a new function doesn't have spin up for every requests and therfore greatly reduces cold start.

<div aria-hidden="true" class="slide" data-type="main" data-title="Concurrency">
  <div class="heading-group">
    <div class="main-title"><span class="h">v1</span> and <span class="h">v2</span></div>
  </div>
  
  <p class="title">
    Recently a new generation of Cloud Functions was launched and it has great implications for <span class="h">cold start</span>.
  </p>
</div>

When you combine concurrency, minimum instances, and a using Firebase Hosting as a CDN cache you have scalable and fast server side rendering solution. And while it sounds complicated to use all of this, they are all small settings you specify when configuring your function's environment. We're not going to get into concurrency in this course since it's all pretty new, but I would be doing the feature a great disservice if I didn't give it a mention.

<div aria-hidden="true" class="slide total-center" data-type="main" data-title="Concurrency">
  <img class="width-50" src="/concurrency.png" alt="Concurrency" style="border-radius: 8px;" />
</div>

#### Functions SDK
Firebase provides a `firebase-functions` SDK that wires up triggers and handles deployments with the Firebase CLI. 

<div aria-hidden="true" class="slide" data-type="main" data-title="Bootstrap with the CLI">
  <div class="heading-group">
    <div class="main-title">Bootstrap with the <span class="h">CLI</span></div>
  </div>
  
```bash
firebase init functions
```

</div>

<div aria-hidden="true" class="slide" data-type="main" data-title="Functions SDK">
  <div class="heading-group">
    <div class="main-title">Functions <span class="h">SDK</span></div>
  </div>
  
```js
// functions/index.js
const functions = require('firebase-functions');

exports.helloWorld = functions.https.onRequest((request, response) => {
  
});
```
</div>

<div aria-hidden="true" class="slide" data-type="main" data-title="Deploy">
  <div class="heading-group">
    <div class="main-title"><span class="h">Deploy</span></div>
  </div>
  
```bash
firebase deploy --only functions
```

</div>

<div aria-hidden="true" class="slide" data-type="main" data-title="Demo time">
  <div class="heading-group">
    <div class="main-title"><span class="highlight">Demo time</span></div>
  </div>
</div>

##### Setting up with the CLI
The most common way to get started is to use the Firebase CLI to bootstrap your project.

```bash
firebase init functions
```

This will take you through a few options that you can tailor to your needs, such as using TypeScript or eslint.

From there you'll have a folder named `functions` with its own `node_modules` folder. You can customize this folder structure and ability to share node_modules with your main project. However, for simple triggers I recommend following the standard setup.

```js
// functions/index.js
const functions = require('firebase-functions');

exports.helloWorld = functions.https.onRequest((request, response) => {
  
});
```

Now that we can access the SDK, lets get into the fun stuff: _triggers_.

#### Firestore triggers
Firestore allows you to specify triggers for a common points in a document's life.  

##### Document level
It's important to note that triggers in Firestore are done at the document level. You can't specify a trigger for an entire collection, but you can provide a wildcard and receive each and every update for a document within the collection.

```js
exports.onUserDocument = functions.firestore.document('/users/{uid}')
  .onUpdate((change, context) => {
    // Do something server-y
  });
```

Whenver a document is update the above trigger will fire and provide information about the single document. If 100 updates occur then 100 triggers will fire. 

##### onCreate
In Firestore you can specify a trigger for when documents are created.

```js
exports.onUserDocument = functions.firestore
  .document('/users/{uid}/expenses/{expenseId}')
  .onCreate((change, context) => {
  
  });
```

This will fire whenever a new expense document is created in the `expenses` subcollection. From here there are so many important actions you can take. What if you need to verify the expense amount with an external system? That can be done silently in the background as the user continues to use the site.

##### onUpdate
In Firestore you can specify a trigger for when documents are updated.

```js
exports.onUserDocument = functions.firestore.document('/users/{uid}/')
  .onCreate((change, context) => {
    
  });
```

This will fire whenever a new expense document is created in the `users` collection. Remember the denormalization section in Firestore? These triggers are fantastic for fanning out updates for embedded user maps in denormalized documents. In one data model the `user` map is embedded within every exepense. Using this trigger you can query for all expenses owned by the user and update their information.

##### onDelete
In Firestore you can specify a trigger for when documents are deleted as well.

```js
exports.onUserDocument = functions.firestore.document('/users/{uid}/')
  .onDelete((change, context) => {
    
  });
```

Delete triggers are extremely useful for syncing deletes in other systems. What if a user deletes their account and you have a requirement to delete their data in an external system? This is a fantastic place to finish that process.

#### Auth triggers
Firebase Authentication has an entire set of triggers for managing user events. In addition! Cloud Functions v2 brings two new triggers that are so amazingly awesome, because they are unlike any other kind of trigger. We'll see in just a second.

##### onCreate
In Firebase Authentication you can specify a trigger for when a user is created.

```js
exports.userCreated = functions.auth.user().onCreate(user => {
  
});
```

This is one of my favorite triggers. A user account creation is such an important event in many applications. You can trigger many important actions such as sending a welcome email or seeding important data. We're going to use this for a really interesting use case in the upcoming demo.

##### onDelete
In Firebase Authentication you can specify a trigger for when a user is deleted.

```js
exports.userCreated = functions.auth.user().onDelete(user => {
  
});
```

This trigger is very similar in nature to the `onDelete()` for Firestore documents. I especially like it for usecases where you need to clear out all user data when their account is deleted.

##### Blocking functions - v2 only
Cloud Functions v2 brings a new feature into the fold: a _blocking function_. A blocking function is special because it waits for the result of the function to determine whether the action should proceed. This is especially useful in authentication.

##### beforeCreate - v2 only
The `beforeCreate()` trigger fires before a new user is saved to Firebase Authentication and even before a token is returned to the client.

```js
exports.shouldcreate = functions.auth.user().beforeCreate(user => {
  
});
```

This function will intercept the process of user creation. You can write the logic required to see if the user should be created within your system. 

##### beforeSignIn - v2 only
The `beforeSignIn()` trigger fires after a user's credentials are verified, but before a token is returned to a client.  

```js
exports.checkemail = functions.auth.user().beforeSignIn(user => {
  
});
```

One common example is that you might require email verification before a user can access your site. This function will block the sign in process if the user does not have a verified email address.

#### https triggers
HTTPS triggers are so veratile. You can create an API, a website, and really the options are limitless. We even have a special kind of `https` trigger that is designed to simply making direct calls to Cloud Functions.

##### onRequest
Cloud Functions provides the `onRequest()` trigger, that gives you an Express.js like handler for dealing with request/response events.

```js
exports.api = functions.https.onRequest(async (request, response) => {
  const { uid } = request.params;
  // Use the Admin SDK
  const snapshot = await db.collection('users').doc(uid).get();
  const { first, last, location } = snapshot.data();
  return { first, last, location };
});
```

When you deploy an `onRequest()` trigger, Cloud Functions will give you a URL that triggers this function. In the Cloud Functions v1 world, it will like something like this:

```
https://us-central1-<project-id>.cloudfunctions.net/api
```

Using Firebase Hostin you can create a custom domain for this URL as well as specify caching. We'll get more into the advanced features of `onRequest()` in just a moment.

##### callable
Callable functions sound exactly like what they are. You can call them directly from the client. It's a two part process. _First_ you write the `onCall()` function.

```js
exports.getTweets = functions.https.onCall((data, context) => {
  const { uid } = context.auth;
  // Call out to the Twitter API to get a user's tweets
});
```

When called, this function passes along the authenticated context of the user automatically. Pay attention to the name of this function, `getTweets`, because we'll be using it in a just a second. The _second_ step is using the Firebase JavaScript SDK to call the function directly.

```js
import { getFunctions, httpsCallable } from 'firebase/functions';

const functions = getFunctions();
const getTweets = httpsCallable(functions, 'getTweets');
const result = await getTweets();
console.log(result.data);
```

The client SDK will pass along the currently authenticated user if you are using Firebase Authentication. Therefore, automatically handling authentication within the HTTPS request. You don't have to worry about setting headers, bearer tokens, any thing like that.

#### SSR on Firebase Hosting
Cloud Functions integrates with Firebase Hosting to allow you to provide a custom domain to your `onRequest()` trigger as well as caching with Firebase Hosting's CDN. Using caching is great way to reduce cold start and reduce the number of invocations of your functions.

##### Custom domains with Firebase Hosting
Using Firebase Hosting, you can add a custom domain to your `https` trigger. Firebase Hosting has a custom domain registration process and once you have set that up you can tell hosting to rewrite paths to Cloud Functions. Even if you don't have a custom domain with Firebase Hosting, you can still use the `<project-id>.web.app` domain that Firebase Hosting provides out-of-the-box.

To set up the domain, go into `firebase.json` and add a `"rewrite"` section within the `"hosting"` config.

```json
{
  "hosting": {
    "public": "dist",
    "rewrites": [{
      "source": "/server-rendered-path",
      "function": "ssr"
    }]
  }
}
```

The `"rewrite"` config can also take in a "glob" format to specify a pattern of files. It's common for sites that want to be 100% server rendered to use the `**` glob.

```json
{
  "hosting": {
    "public": "dist",
    "rewrites": [{
      "source": "**",
      "function": "ssr"
    }]
  }
}
```

This configuration tells Firebase Hosting to call out to the `ssr` function whenever a user requests the `/server-rendered-path` URL (using the first config example). From there you can write the function to return the HTML document to render at that path.

```js
exports.ssr = functions.https.onRequest((request, response) => {
  response.send('<h1>Im on the server!</h1>')
});
```

This function will return the content back to Firebase Hosting who will return it back to the user. Now the real power comes into play when you start to use the CDN cache.

##### Control the CDN cache
Firebase Hosting has a global Content Delivery Network (CDN) that delivers content to users depending on where they are physically located. Whenever you deploy out to Firebase Hosting we will store your website in the local region's CDN cache on the first request. All subsequent requests will be served from that cache (in that region) until the cache is invalidated, usually from a redeploy.

With Cloud Functions you can tell Firebase Hosting to take the server generated document and store in the CDN cache as if it were a static file.

```js
exports.ssr = functions.https.onRequest((request, response) => {
  // s-maxage controls the CDN cache. The numbers represent sections
  res.set('Cache-Control', 'public, max-age=300, s-maxage=600');
  response.send('<h1>Im on the server!</h1>')  
});
```

By setting the `Cache-Control` header Firebase Hosting will store the content in the CDN for `600` seconds or `10` minutes. This is called a Time to Live or a _TTL_. During that time, no function invocations will occur from requests within that CDN region. Within that region all the content will be served from the CDN cache. Once the TTL expires, the function will trigger again and the caching process will repeat. 

The main thing to notice here is that only request to content can benefit entire region in terms of caching. This greatly reduces the amount of times your function is triggered and the cache results are extremely fast.

##### Express.js
Express.js is a popular, tried-and-true library for building sites and APIs on Node.js. Cloud Functions follows a request/response pattern that allows you to easily integrate Express to make writing multiple endpoints much easier. First install express.

```
npm i express
```

Then you can use it within a function.

```js
const functions = require('firebase-functions');
const app = express();
app.get('/users/:uid', (request, response) => {

});
app.post('/new/:id',  (request, response) => {

});
exports.express = functions.https.onRequest(app);
```

This examples allows you to use multiple routes with multiple HTTP verbs within one `https` trigger.

##### Next.js & other frameworks
Server Side Rendering has become an amazing feature of modern JavaScript frameworks. We even have a name for them now: _meta-frameworks_. Meta-frameworks like using Next.js, Nuxt, Angular Universal, Astro, or SvelteKit allow you to dynamically render content on the server and hydrate with JavaScript aftwards. 

The building, configuring, and deploying of these meta-frameworks can be tricky at times. Just very recently, we announced a preview of a new feature that automatically handles the building, deploying, and even the creation of Cloud Functions for you with these meta-frameworks. It's still very early, but I'm hoping by the time you are watching this out there that it's in full swing.

Today if you want to use it, you can specify a flag to make it available.

```
firebase --open-sesame frameworkwareness
```

Then when you're ready to deploy:

```
firebase deploy
```

The CLI will automatically handle all of the building, deploying, an Cloud Function generation on your behalf. Like I said, it's early, but you can [check out the GitHub repo](https://github.com/FirebaseExtended/firebase-framework-tools) to learn more and give it a try.

#### Demo
Cloud Functions are full of possibilites and useful use-cases. Let's implement a few.

<ul class="code-callout">
  <li>cd /6-cloud-functions/start</li>
  <li>npm i</li>
  <li>cd functions</li>
  <li>npm i</li>
  <li>cd ..</li>
  <li>sh emulators.sh</li>
</ul>
