---
layout: ../layouts/GuideLayout.astro
title: Firebase Auth
order: 4
subtitle: <span class="highlight">Authenticating</span> users, linking <span class="highlight">accounts</span>, and <span class="highlight">admin</span> permissions.
previous:
  name: Cloud Firestore
  href: /3-cloud-firestore
next:
  name: Security Rules
  href: /5-security-rules
---

Firebase Authentication is a fully managed authentication system for signing in and managing users without the need of your own server.

<div aria-hidden="true" class="slide" data-type="main" data-title="Firebase Authentication">

  <div class="title"><span class="highlight">Firebase</span> Authentication</div>
  <div class="side-grid firestore">
    <div class="numeric-side">
      <div class="highlight mega-number">Auth</div>
      <div class="subtitle">Serverless</div>
    </div>
    <div class="subtitle">
      <span class="highlight">Firebase</span> Auth is a <span class="highlight">serverless</span> authentication provider with integration into Firebase <span class="highlight">security rules</span>.
    </div>
  </div>
  
</div>

How many providers are there? A fair amount.
- Email + Password
- Anonymous
- Google, Twitter, Facebook, Apple, Microsoft, Yahoo
- Email Link (Passwordless)
- SMS
- Custom
- Game Center
- Play Games

<div aria-hidden="true" class="slide" data-type="main" data-title="Providers">
  <div class="heading-group">
    <div class="main-title">How many <span class="highlight">Providers</span>?</div>
  </div>

- Email + Password
- Anonymous
- Google, Twitter, Facebook, Apple, Microsoft, Yahoo
- Email Link (Passwordless)
- SMS
- Custom
- Game Center
- Play Games
  
</div>

I'm going to be honest with you all on this section. This is going to be an easy one. I'm a massive Frontend Masters' fan and I feel like I have a good idea of what you're looking for in a course. Signing in users with Firebase Auth is fairly straightforward. I don't want to waste your time by painstakingly taking you through each provider one-by-one. Instead I'm going to teach _how the system works overall_.  What's most important is that you understand:

<div aria-hidden="true" class="slide" data-type="main" data-title="What we'll cover">
  <div class="heading-group">
    <div class="main-title">In this <span class="highlight">section</span></div>
  </div>

1. How the general sign in process works
1. How to observe authentication state
1. How to use multiple providers and merge accounts
1. How auth ties into security
1. How to use the Auth Emulator
1. How to manage users with Admin SDK
  
</div>

1. How the general sign in process works
1. How to observe authentication state
1. How to use multiple providers and merge accounts
1. How auth ties into security
1. How to use the Auth Emulator
1. How to manage users with Admin SDK

If you understand these topics, you'll be just fine looking up how to use any provider we have. Let's begin by discussing the sign in process.

#### Authentication/Authorization
Now if you've ever read a tutorial on Authentication you've probably been presented with the "Authentication vs Authorization" dichotomy. Authentication is "who you are" and Authorization being "what you are allowed to do". In this section we are only going to touch upon Authentication. The next section with security rules, will determine authorization.

<div aria-hidden="true" class="slide" data-type="main" data-title="What we'll cover">
  <div class="heading-group">
    <div class="main-title"><span class="highlight">Authentication</span></div>
    <div class="main-title">Authorization</div>
  </div>
  
</div>

##### The uid key
When a user account is creater they get assigned a special key called a `uid`. This key _uniquely identifies_ the user within Firebase Authentication. This is also vital for saving data within other services like Firestore. You saw in the previous section we were able to get back a user's information and their expenses all from this `uid`. Not only will this allow us to structure user data, but in the next section we'll use it to secure it.

<div aria-hidden="true" class="slide" data-type="main" data-title="uid key">
  <div class="heading-group">
    <div class="main-title">The <span class="highlight">uid</span> key</div>
  </div>
</div>

#### Setting up for development
Regardless of what provider you use, you'll follow a fairly similar process of signing in a user. 

##### Use the Auth Emulator
The first thing to do is actually something we've covered, set up the Authentication Emulator. The Auth Emulator gives you A LOT of conveniences when developing. You can seed users, which we have been doing behind the scenes. When triggering an OAuth provider like Google instead of redirecting to the provider auth page, you can create users with a UI provided by the Emulator. You'll see all of this in just a moment.

```js
import { initializeApp } from 'firebase/app';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { config } from './config';

const firebaseApp = initializeApp(config.firebase);
const auth = getAuth(firebaseApp);
if(location.hostname === 'localhost') {
  connectAuthEmulator(auth, 'http://localhost:9099');
  // and other emulator connections as well
}
```

A good thing to keep in mind too is that before deploying you need to enable the providers you're using in the Firebase Console. Every provider in Firebase Auth has to be manually enabled. While this may seem frustrating at first, it's a good choice in terms of security.

##### Emulator vs Console
It's good to keep in mind what actions you're performing in the Firebase Console vs the Emulator. The Console contains all the production actions such as enabling a provider or managing users. If you delete a user in the Console, they are gone for good. 

<div aria-hidden="true" class="slide" data-type="main" data-title="Demo time">
  <div class="heading-group">
    <div class="main-title"><span class="highlight">Demo</span> time</div>
  </div>
</div>

#### The sign in process
Signing in users follow a similar formula. The JavaScript SDK provides a series of "sign in functions" that trigger a sign in flow.

##### Basic email & password
Take a look at one of the most simple providers: email and password.

```js
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';

const auth = getAuth();
signInWithEmailAndPassword(auth, 'email@email.com', 'securepw\o/');
```

This example shows how to sign in with the Email and Password provider. This works for existing users, but new users need to be created with the similarly named function.

```js
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';

const auth = getAuth();
try {
  await createUserWithEmailAndPassword(auth, 'email@email.com', 'securepw\o/');
} catch(error) {
   console.log('something went wrong');
}
```

Notice that the code is a little bit different. This boils down to the difference between account sign in and account creation. When it comes to signing in we can call a sign in function and then later when we detect the user state we can detect any problems. However, when creating an account we need to look right away if there are any problems because the account has not been created if an error occurred. 

This dichotomy of account "creation" and "sign in" exists for all providers but it's only explicitly with providers like Email and Password that have two different functions for each operation. This dichotomy becomes a little more subtle when dealing with OAuth providers such as: Google, Facebook, GitHub, and Twitter.

Let's take a look at an example.

```js
import { getAuth, signInWithRedirect, GoogleAuthProvider } from 'firebase/auth';

const auth = getAuth();
signInWithRedirect(auth, new GoogleAuthProvider());
```

In this sample a function is called to sign in a user with a Google provider. However this would work whether it was an existing user or a new user. Why is that the case? Well we need to dive a little deeper into redirect flows because they are their own unique kind of provider.

##### Redirect Flows
This example is a little different because instead of it being one function handling a very specific type of authentication it's a generic function that handles all OAuth providers. In this case a `GoogleAuthProvider` is created and passed a parameter.

```js
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';

const auth = getAuth();
const result = await signInWithEmailAndPassword(auth, 'email@email.com', 'securepw\o/');
```

What you are probably noticing is that we're not getting the logged in user back. Which seems important, so how do we do that?

In some cases you can await the result of the function such as `signInWithEmailAndPassword()`, but that's not always possible. Again, let's take a look at the OAuth example.

```js
import { getAuth, signInWithRedirect, GoogleAuthProvider } from 'firebase/auth';

const auth = getAuth();
const result = await signInWithRedirect(auth, new GoogleAuthProvider());
console.log(result, 'what happens next?!');
```

A common way of handling OAuth sign in flows are with redirects. The user issues a request to login with that provider. The app then sends the user to the provider's login page, the user logs in, and the provider sends the user back to the application. So with that in mind, do you think that we'll get to handle the result returned from the `signInWithRedirect()` function? Let's take a look.

Okay so we can't get that result. So what do we do? We use a function that knows about the result.

```js
import { getAuth, signInWithRedirect, GoogleAuthProvider, getRedirectResult } from 'firebase/auth';

const auth = getAuth();

try {
  const result = await getRedirectResult(auth);
  console.log(result);
} catch(error) {
  console.log('something bad happened');
}

function onClickSomewhere() {
  signInWithRedirect(auth, new GoogleAuthProvider());
}
```

This function runs when a user returns from a redirect flow. It tells us who the user is, information from scopes, and any potential errors in the process. It only runs right after the redirect flow however. It's important for gathering information about the redirect process only. An app could potentially use multiple providers and if a user doesn't login via redirect, this won't trigger. When using a redirect flow it's important to use `getRedirectResult()` because you need to recover from any errors that may happen during the process. However, it's mainly just to detect that problem. To handle authentication state for all providers we need to use a more general method in addition.

##### Signing Out
By the way, signing a user out is just one function.

```js
import { getAuth, signOut } from 'firebase/auth';

const auth = getAuth();
signOut(auth);
```

##### Detecting authentication state
Whenever you're using Firebase Authentication you'll usually follow the process of signing a user in, and then using a function to detect their authentication state.

```js
import { getAuth, onAuthStateChanged } from 'firebase/auth';

const auth = getAuth();
onAuthStateChanged(auth, result => {
  if(result != null) {
    console.log(result.user);
  }
});
```

Using `onAuthStateChanged()` allows you to not only detect when a user is logged in, but detect any changes whatsoever. When a user is not logged in the callback will fire with a null result, when the user does log in it will fire again with a result containing the value of the user. When a user logs out, the callback will fire with a null result, letting you know that there's no user logged in. 

##### The current user
After you have been logged in you can access the current user value synchronously from the `auth.currentUser` property. Be careful though, this will be null if no user is logged in yet. Do not rely on this value always to be there. Code defensively.

#### Using multiple providers
Users love choice when it comes to creating an account with your app. It creates a sense of trust and convenience from the start. You can use multiple providers with Firebase Authentication, and by default we have a "single email" policy for accounts. 

This policy means that only email can be used per account. If a user signs in with Google as `david@example.com` and then later on that same user tries to sign in with Twitter associated with the same `david@example.com`, we will notify you that we won't outright sign the user in because we already have a user with that email. From there you opt to merge accounts so when the user signs in with either Google or Twitter it will point them to the same account.

##### Linking accounts
When you have the "one email per user" policy enabled, Firebase Auth will throw errors if an account with that email address is already in use. This lets you present the user with options for signing in with the original account and then linking with another afterwards.

For example, if you wanted to link with an OAuth provider, you would call the `linkWithRedirect()` function and then wait for the result in either `getRedirectResult()` or `onAuthStateChanged()`.

```js
linkWithRedirect(auth.currentUser, new GoogleAuthProvider());

try {
  const result = await getRedirectResult(auth);
} catch(error) {
  // any errors while linking?
}
```

You can link with many different providers, you need to pass the current user and the specific flow the new provider requires. For example with email and password:

```js
async function mergeEmail({ email, password }) {
  const credential = EmailAuthProvider.credential(email, password);
  try {
    const result = await linkWithCredential(auth.currentUser, credential);
    console.log('Account linking success', result);
  } catch (error) {
    console.log('Account linking error', error);
  }
}
```

##### Exercise
Okay will all of your new found knowledge of Firebase Auth, we're going to do a little fun exercise. We're going to create a little auth flow. We'll boot up the Emulator with a set of users and then try to log in as an existing user and handle the merge.

<ul class="code-callout">
  <li>cd /4-firebase-auth/start</li>
  <li>npm i</li>
  <li>npm run dev</li>
  <li>http://localhost:3000/1/signin-flow</li>
</ul>

#### Untrusted vs Trusted Environments
Firebase Authentication has two types of SDKs: client and server. This entire time we've been using the client SDK. The client SDK is responsible for direct user actions such as logging in, logging out, and their user state. This SDK does not have or desire the power to manage all the users within the authentication system. It is specifically scoped for a single user action.

##### The Admin SDK
However, it's really important to be able to perform operations as an administrator of an authentication system. Sometimes you want to manually create, delete, or update accounts. Also while we'd love to have you as a customer, you should be able to export your data to move onto another provider or your own system. That's why we have a server SDK that we refer to as the Admin SDK. This is available on multiple platforms such as Java, Python, Node, .NET and others. It's capable of many things other than user management as well. The Admin SDK allows you to verify and mint tokens on the server which allows you to authenticate with custom systems. You can also issue cookies to do authentication over HTTP Cookies as well. I'm not getting into all of that because that's a deep dive within itself. For now I'm going to cover the fundamentals of using the Admin SDK to manage users.

Before we can begin with the Admin SDK, we have to understand that not only is it different from the client capabilities, but it also has a different security model. The client SDK works on a single use basis, the server/Admin SDK works for all users. Therefore the Admin SDK ignores all security rules and operates with complete power. What gives it that power is a service account. A service account is like a special user account that has a lot of power. You can apply scopes to a user account to reduce its power however. To create a service account you go to the Firebase Console and download one as a JSON file. From there you can import that file and use it for initialization.

```js
import { initializeApp, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
const serviceAccount = require('./sa.json');

const credential = cert(serviceAccount)
const firebaseApp = initializeApp({ credential });
const auth = getAuth(firebaseApp);
```

It's important to note that a service account affects production. If you are using the emulator you need to set specific environment variables that tell the Admin SDK to talk to the emulator rather than production.

```js
export FIREBASE_AUTH_EMULATOR_HOST="127.0.0.1:9099"
```

##### Admin user management
With the Admin SDK and the Emulator you can seed an entire set of users for local development. This is actually what has been happening the entire time you boot up the emulator. Using a local set of data, I run a script that calls the Admin SDK to create a whole set of users. 

```js
import { initializeApp, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
const serviceAccount = require('./sa.json');

const credential = cert(serviceAccount)
const firebaseApp = initializeApp({ credential });
const auth = getAuth(firebaseApp);

export async function createUsers(usersArray) {
  let users = [] ;
  for await (const user of usersArray) {
    const userRecord = await auth.createUser({
      email: user.email,
      emailVerified: true,
      displayName: `${user.first} ${user.last}`,
      disabled: false,
    });
    users = [...users, { ...user, uid: userRecord.uid }]
  }
  return users;
}
```

While this isn't too complex, it's a fair bit of code so let me step through it. It starts off by initializing the Admin SDK with a service account. Then the code creates a function that takes in an array of users, iterates over them calling the createUser function. Which I can bet, you know exactly what that does. It takes in an object of user information and saves it to Firebase Auth. After a user is created their UID is returned, and using the UID we can seed an entire local database with a proper data structure or any other necessary actions we need for this user.

If you want to see how this works, then look at the top level folder called `seed` within the repository for this course. The file `users.ts` contains the code for importing the fake and generated users into Firebase Authentication. This script is meant for the emulator, but if you don't specify the emulator port in the environment variable it will upload to your Firebase project so be careful.

#### Authentication and Security
This whole time we've been working to authenticate users and then use that UID to associate data with their account. Despite this, any user can still come in and just delete our entire database. That's ok though we're about to fix that. Once users are authenticated we have a lot of power at our disposal to ensure that user data in Firestore is secure.
