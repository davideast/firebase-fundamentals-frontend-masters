---
layout: ../layouts/GuideLayout.astro
title: Introduction
order: 1
subtitle: The <span class="highlight">architecture</span>, <span class="highlight">libraries</span>, and general <span class="highlight">workflow</span>.
previous:
  name: Home
  href: /
next:
  name: Setup
  href: /2-setup
---

Hello everyone! If you wanted to learn how to build web apps on Firebase, then yes, you came to the right place. 

#### What exactly is Firebase?

Now you might be asking yourself, what exactly is Firebase? You might be asking that question because you're brand new to Firebase, or because you understand a bit of what Firebase does, but you know there's a lot more to it. Also, you might be asking because you were supposed to be in "Intro to React v7 with Brian Holt", and that was last week. But don't leave, because this is gonna be a good one.

<div aria-hidden="true" class="slide" data-type="main" data-title="What is Firebase?">
  <div class="mega-title">What exactly is <span class="highlight">Firebase</span>?</div>
</div>

<div aria-hidden="true" class="slide" data-type="main" data-title="Firebase is for building">

  <div class="title">What exactly is <span class="highlight">Firebase</span>?</div>
  <div class="side-grid intro">
    <div class="numeric-side">
      <div class="highlight mega-number">20+</div>
      <div class="subtitle">Products</div>
    </div>
    <div class="subtitle">
      <span class="highlight">Firebase</span> is a platform for <span class="highlight">building</span> mobile and web applications.
    </div>
  </div>

</div>

To answer this question: _Firebase is a platform for building mobile and web applications._ Firebase lets you build without running your own servers. You can securely sign users in, read and write data to a database, all from the browser, without writing any server code. And that's not the only thing that Firebase lets you do.

<div aria-hidden="true" class="slide" data-type="main" data-title="A short origin story">
  <div class="mega-title">A short <span class="highlight">origin</span> story</div>
</div>

#### What this workshop covers

Firebase has `20+` different services or "products" that you can use. And this can feel quite overwhelming, but don't worry. That's why you're here. Today I'm going to teach you the fundamentals of using Firebase to build web apps.

<div aria-hidden="true" class="slide" data-type="main" data-title="What we're going to cover">
  <div class="heading-group">
    <div class="title">Today we're going to <span class="highlight">cover</span></div>
  </div>

  - [Firebase Hosting](https://firebase.google.com/docs/hosting) – Deploy a site on a fast global CDN
  - [Firestore](https://firebase.google.com/docs/firestore/quickstart) – A cloud hosted realtime database
  - [Firebase Authentication](https://firebase.google.com/docs/auth/web/start) – A serverless authentication system
  - [Security](https://firebase.google.com/docs/rules) — Centralized authroization control
  - [Cloud Functions](https://firebase.google.com/docs/functions/) – Run server code in response to events

</div>

Were going to narrow it down and cover:

- [Firebase Hosting](https://firebase.google.com/docs/hosting) – Deploy a site on a fast global CDN
- [Firestore](https://firebase.google.com/docs/firestore/quickstart) – A cloud hosted realtime database
- [Firebase Authentication](https://firebase.google.com/docs/auth/web/start) – A serverless authentication system
- [Security](https://firebase.google.com/docs/rules) — Centralized authroization control
- [Cloud Functions](https://firebase.google.com/docs/functions/) – Run server code in response to events 

By the end of the workshop you will know the ins and outs of how to use all of these Firebase features to build scalable, secure, and just plain old awesome web apps.

#### About the author
My name is [David East](https://twitter.com/_davideast) and I'm incredibly thrilled to be here to give this workshop for so many different reasons. _First of all_, I'm a massive Frontend Masters fan. I've been watching courses here for almost 9 years now, so this is a bit surreal. _Secondly_, I love teaching people Firebase. 

<div aria-hidden="true" class="slide" data-type="main" data-title="About the author">
  <div class="heading-group">
    <div class="slide-label">About the author</div>
    <div class="main-title">My name is <span class="highlight">David East</span></div>
    <div class="subtitle dim">I've been working at Firebase since 2014</div>
  </div>
  <figure class="photo-quote">
    <a href="https://twitter.com/_davideast">
      <img src="/de-old.png" alt="An old photo of David East from 2014, where his hair is too long for his own liking nowadays." />
    </a>
    <figcaption>
      <p>This was my team photo in 2014.</p>
      <p>I had no idea what I was doing</p>
    </figcaption>
  </figure>
</div>


##### I've done a lot of Firebase
I'm a Developer Relations Engineer at Google, working on the Firebase team. But long before I was at Google. I worked at a small little company called Firebase. I joined the team as the 16th employee and I've been along for this wild ride ever since.

<figure class="photo-quote">
  <a href="https://twitter.com/_davideast">
    <img src="/de-old.png" alt="An old photo of David East from 2014, where his hair is too long for his own liking nowadays." />
  </a>
  <figcaption>
    <p>This was my team photo in 2014.</p>
    <p>I had no idea what I was doing</p>
  </figcaption>
</figure>

On my first day at Firebase, _there were only two products_: the Realtime Database and Authentication. Today there's 19. It's been an absolute joy watching this little startup grow into a full blown platform for building anything you can imagine. And I really mean that. 

<div aria-hidden="true" class="slide" data-type="main" data-title="What is Firebase?">
  <div class="title">Firebase <span class="highlight">Architecture</span></div>
  <div class="subtitle dim">vs</div>
  <div class="title">Traditional <span class="highlight">Architecture</span></div>
</div>

#### Architecture
Firebase is a _collection of services_ that all can either work independently or together. This makes it a little interesting to teach Firebase, because _there's so many ways you can use it_. I'm going to take the approach of how you would use Firebase an entire site, that way we can cover a lot. However, I will point out how you would integrate it with an existing system.

##### Traditional
When you're building a web app in a traditional server architecture, it's going to look a little like this. The browser makes an HTTP request to your server, the server will handle authentication, connect out to the database or some other resource, then return the response back to the browser.

<div aria-hidden="true" class="slide" data-type="main" data-title="Traditional architecture">
  <div>
    <img src="/traditional-arch.svg" alt="A diagram of a traditional architecture">
  </div>
</div>


##### Firebase
Firebase is a little bit different. With Firebase, you can do literally all of this from the browser. The browser makes an HTTP request to a server and returns all the static assets. Then the Firebase JS SDK connects to your Firebase backend and starts authenticating users, reading data, or whatever else you need. Now this isn't to say you can't run Firebase on the server, you absolutely can and we'll be doing that later in the workshop. But this is how straightforward it can be to get set up.

![A diagram of Firebase architecture](/firebase-arch.svg)

<div aria-hidden="true" class="slide" data-type="main" data-title="Firebase architecture">
  <div>
    <img src="/firebase-arch.svg" alt="A diagram of Firebase architecture">
  </div>
</div>

The cornerstone of Firebase is that you can build without running your own servers. 

Today, my goal is to teach you the must know bits of Firebase. And to be clear about this workshop's focus: it's all about the fundamentals. If you came to learn how to build good looking UIs, well that is not happening here. We're going to be scrapping together some, not so great, UIs so we can focus on the important parts of the Firebase code. By the end of the workshop, you'll have all the skills you need to build secure web apps with best practices.

But before we establish what "good" is, let's do a little exercise where we define the ...less good.

#### A naive, simple, Firebase site
If you want to follow along, you can, but I'm going to be moving fast so we hit all of our topics today. The code is located in this repo. I'm going to take this not so great looking Markdown editor app, and power it up with Firebase. It's built with Vue, but I tried to use a minimal amount of the framework and to keep the focus on the Firebase bits.

<div aria-hidden="true" class="slide" data-type="main" data-title="Let's build">
  <div class="heading-group">
    <div class="main-title">
      Let's <span class="highlight">build</span> a naive, simple, <span class="highlight">Firebase</span> site.
    </div>
  </div>
  <ul class="code-callout">
    <li>cd /1-fast-but-not-good-setup</li>
    <li>npm i</li>
    <li>npm run dev</li>
    <li># or follow along</li>
  </ul>
</div>

<ul class="code-callout">
  <li>cd /1-fast-but-not-good-setup</li>
  <li>npm i</li>
  <li>npm run dev</li>
  <li># or follow along</li>
</ul>
