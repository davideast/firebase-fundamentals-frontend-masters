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

#### What did we learn?

<div aria-hidden="true" class="slide" data-type="main" data-title="What did we learn?">
  <div class="heading-group">
    <div class="main-title">What did we <span class="highlight">learn</span>?</div>
  </div>
</div>

##### Firebase Project
All Firebase backend services are housed by a Firebase Project. When you visit the console you select a project and the services related to that project show their associated data. You can own multiple projects for multiple apps.

<div aria-hidden="true" class="slide" data-type="main" data-title="Firebase Project">
  <div class="heading-group">
    <div class="main-title"><span class="highlight">Firebase</span> Project</div>
  </div>
  <p class="title">
    Firebase <span class="highlight">backend</span> services are housed by a Firebase Project.
  </p>
</div>

##### Firebase App
To connect out to a Firebase Project we need create or use the configuration we call a Firebase App. A project can have multiple apps depending on the types of platforms it needs to support. If you're just building a web app, then you only needs one app. If you're going to build a cross platform app, then you'll need an app for each platform. 

<div aria-hidden="true" class="slide" data-type="main" data-title="Firebase App">
  <div class="heading-group">
    <div class="main-title"><span class="highlight">Firebase</span> App</div>
  </div>
  <p class="title">
    A project contains 1 (or more) apps to let clients to connect to services in a project.
  </p>
</div>

##### JavaScript SDK
Firebase comes with a JavaScript SDK that handles a lot for you. You don't have to write any networking or caching code. The JavaScript uses the configuration of a Firebase App to know what backend service to connect to.

<div aria-hidden="true" class="slide" data-type="main" data-title="JavaScript SDK">
  <div class="heading-group">
    <div class="main-title"><span class="highlight">JavaScript</span> SDK</div>
  </div>
  <p class="title">
    Write code to perform actions against Firebase services.
  </p>
</div>

##### Firebase CLI
Firebase also comes with a CLI that can perform many actions. In this example we used it to deploy to Firebase Hosting. Stay tuned though, we're about to use the Firebase CLI for one of the most useful bits of Firebase development, the Emulator Suite.

<div aria-hidden="true" class="slide" data-type="main" data-title="Firebase CLI">
  <div class="heading-group">
    <div class="main-title">Firebase <span class="highlight">CLI</span></div>
  </div>
  <p class="title">
    Bootstrap, deploy, and develop against Firebase projects.
  </p>
</div>

#### What went wrong?
We saw a lot happen in that naive project. There was some good there, we created a realtime listener, did anonymous authentication, but there was no real good foundation. What was wrong?

<div aria-hidden="true" class="slide" data-type="main" data-title="What went wrong?">
  <div class="heading-group">
    <div class="main-title">What went <span class="highlight">wrong</span>?</div>
  </div>
</div>

##### Security
Security is obviously the most glaring problem. With one DELETE request the entire database went away. In Firebase we use security rules and we'll cover that IN DEPTH later today. I'll also speak to them when designing the database and auth patterns. 

<div aria-hidden="true" class="slide" data-type="main" data-title="Security">
  <div class="heading-group">
    <div class="main-title"><span class="highlight">Security</span></div>
  </div>
  <p class="title">
    With one DELETE request the entire database went away. 
  </p>
</div>

##### Code structure
I used `initializeApp()` everywhere. I had `firebase` imports littered in every file. As you begin to customize your Firebase app settings, you'll run into erorr and weird bugs since nothing is consistent.

<div aria-hidden="true" class="slide" data-type="main" data-title="Code structure">
  <div class="heading-group">
    <div class="main-title"><span class="highlight">Code</span> structure</div>
  </div>
  <p class="title">
    <code>initializeApp()</code> and <code>firebase</code> imports littered in every file.
  </p>
</div>

##### Production services
The entire site connects out to a production service. This is bad for billing, data integrity, and for general developer convenience. We have an entire Emulator Suite that lets your run all build services locally and in CI/CD environments. Not only does it run locally, but it also has a UI that is tailored for development tasks, such as quickly adding and deleting data.

<div aria-hidden="true" class="slide" data-type="main" data-title="Code structure">
  <div class="heading-group">
    <div class="main-title"><span class="highlight">Production</span> services</div>
  </div>
  <p class="title">
    Don't develop against cloud connected resources.
  </p>
</div>

##### Deployment
Deploying to production each and every time is risky. Firebase Hosting has preview channels that let you deploy to short lived, generated URLs. You can even hook them up to work with pull requests on GitHub.

<div aria-hidden="true" class="slide" data-type="main" data-title="Deployment">
  <div class="heading-group">
    <div class="main-title"><span class="highlight">Deployment</span></div>
  </div>
  <p class="title">
    Deploying to production each and every time is risky
  </p>
</div>

##### Data Model
I didn't take any time to think about my data model. Firestore is a NoSQL database that is not as query rich as other databases. There's advantages and disadvantages to this. The primary advantages being, it's realtime, scales horizontally, and it's flexible with its data storage. When building for any database you want to lean into the advantages and that's not happening here.

<div aria-hidden="true" class="slide" data-type="main" data-title="Data model">
  <div class="heading-group">
    <div class="main-title">Data <span class="highlight">model</span></div>
  </div>
  <p class="title">
    Understand the benefits of NoSQL to write your data model
  </p>
</div>

#### Let's do this again
Let's take this project and give it a proper Firebase foundation.

<div aria-hidden="true" class="slide" data-type="main" data-title="Demo">
  <div class="heading-group">
    <div class="main-title"><span class="highlight">Demo</span></div>
  </div>
  <p class="title">
    <ul class="code-callout">
      <li>cd /2-best-practices-setup</li>
      <li>npm i</li>
      <li>npm run dev</li>
      <li># or follow along</li>
    </ul>
  </p>
</div>

<ul class="code-callout">
  <li>cd /2-best-practices-setup</li>
  <li>npm i</li>
  <li>npm run dev</li>
  <li># or follow along</li>
</ul>
