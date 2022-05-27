---
layout: ../layouts/GuideLayout.astro
title: Security Rules
order: 5
subtitle: The <span class="highlight">syntax</span>, common <span class="highlight">patterns</span>, and role based <span class="highlight">access control</span>.
previous:
  name: Firebase Authentication
  href: /4-firebase-authentication
next:
  name: Cloud Functions
  href: /6-cloud-functions
---

As mentioned before, authentication is knowing who the user is, authorization is knowing what they can do. Now that we have users authenticated, we can write rules that determine what they can do.

#### What are Security Rules?
Security Rules are the one-stop-shop for protecting data in the database. They act as a bouncer for requests into the database. Do you want to read the users collection? Well, there needs to be a rule that allows that. Otherwise, you're not getting to the club, I mean database. 

<!-- ```cpp
match /guestList/{uid} {
  allow read, write: if request.auth.uid == uid;
}
``` -->

Security Rules can feel a little jarring at first because they are their own language and two flavors at that. You might wonder why did Firebase create custom languages instead of using a commonly used language like JavaScript? This is a great first question to ask, because it explains the basics of how Security Rules work.

##### Security, centralized
A big benefit here is that the logic that determines authorization is _located in one spot_. In many (but not all) traditional systems, you can have many layers of security logic. You might write security checks on the server, and maybe some within the database itself. With Firebase apps, you write your security in one spot. Yes, you still perform client-side validation.

##### Why a custom language?
When a request comes into your service (Firestore, RTDB, or Storage) your rules evaluate whether that request is allowed. This means that the operation is held up until the rule is evaluated. If the evaluation takes a long time, that'll make performance pretty miserable for you and your users. That's exactly why Security Rules are their own custom language. This language is designed to evaluate quickly and to avoid performance bottlenecks.

#### Concepts
Security rules start out by declaring what resource they are operating on. 

```cpp
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

In this case we are operating against Cloud Firestore. Then from there it's all about matching.

##### Matching
If you've ever written an Express JS router or some kind of HTTP routing system, you'll be right at home with rules. Like a router, you can match paths and then specify your custom logic from there. But since this is a database or storage bucket, you can also think about rules as a way for you to annotate who has access to the data at that path.

```js
app.get('/users/david_123', (req, res) => { 
  const { id } = req.params; 
});
```

This matches on the path of the user and even captures their uid within as a variable. Using that uid you usually look up their profile or desired data. Security Rules work just the same way.

```cpp
match /users/david_123 {

}
```

Match blocks are how you define which path to apply a rule to. When you write match statements for a path for a security rule the path _must match at the document level_. That means you can't write a match statement for a "users" collection. It has to match a document in that collection. 

This constraint might feel counterintuitive, and you might be wondering "How do I secure all of my users if they are dynamically created?" You can do that with wildcards.

##### Wildcards
Continuing with the HTTP router example, wildcards are just like wildcards in routing. For an HTTP router, you might want to match on a `users/:id` path. 

```js
app.get('/users/:id', (req, res) => { 
  const { id } = req.params; 
});
```

When a request comes in for that path you'll generate a page for that specific user given their route parameter. Security Rules work the same way but instead of a colon, you wrap the wildcard in curly braces. 

```cpp
match /users/{uid} {

}
```

You aren't going to know each and every document in a collection, so given a request for a document you can capture the "id" or whatever route parameter with a wildcard. Our term for a "route parameter" (`id`) is called a segment variable. This allows you to follow the constraint of matching a specific document while thinking of it as securing an entire collection.

Wildcards can even be recursive. Which is a fancy way of saying you can match for that path you are at, or even for paths below your current path. This is really useful for subcollections that might need to enforce the same rules.

```cpp
match /users/{id=**} {
  allow read: if request.auth.uid != null;
}
```

Consider a data structure where you have a "users" collection, and you create subcollections keyed to a user's id. You could have `users/{id}/todos` and all sorts of other collection based information specified to that single user. 

Wildcards and especially the recursive kind are powerful because they can secure a variable number of paths, but what happens when you have two match statements that match on the same path?

##### Overlapping paths
Sometimes you'll find yourself writing broad match statements. The general rule is that _if any rule allows access from either match statement, the rule is allowed_. If you grant access to read in the one path you can't revoke that access somewhere else. 

#### Allow statements
Inside of a match block is the allow statement. This is the heart of security rules. The allow statement takes a method and then an expression.

```cpp
match /users/{uid} {
  allow read: if false;
}
```

The allow statement is made of two parts: the _permissions_ and the _expression_. 

##### Permissions
In Firestore there are two categories: `read` and `write`. These permissions determine that kind of operation should be allowed.

##### read
The `read` permission checks for any type of read to the database. The `read` permission is an alias for lower level permissions as well:

- `get` - A single document
- `list` - Requesting documents within a collection

Keep this granularity in mind if you require specific logic for a different type of read.

##### write
The `write` permissions checks for any type of write operation. This permission is an alias for update like operations.

- `create`
- `update`
- `delete`

It's really common to find yourself using these permissions. Create logic is often different than updating an existing document. This is where you can ensure all of that is being enforced.

##### Using multiple permissions
You can use multiple allow statements in one match black as well. You can define access for reads differently than writes. Creates differently than updates, which is really helpful when validating the schema of an object. 

```cpp
match /users/{uid} {
  allow read: true;
  allow create: if request.auth.uid == uid;
}
```

Yes, you SQL fans you can specify the structure and types of documents with Security Rules.

#### Expressions / Variables
The permission is followed by an expression. If the expression evaluates to true, then the rule is allowed.  Because Security Rules come with an entire set of variables that allow you to look at the incoming request, the identity of the user requesting, the data of the request (if it's write operation), the resource/data at the path being requested, and a lot of other useful information to allow you to sophisticated access systems

```cpp
match /users/{uid} {
  allow read: true; // public for everyone
  allow write: if request.auth.uid == uid; // only a user can edit their data
}
```

Security rules have a set of variables that are essential for making secure rules.

- `request`
- `resource`
- `time`
- `math`

And! There's even more. However, most of the time you're going to be using request and resource variables. So let's break those down.

##### Getting the user
If a user is logged in, you can get their `uid` within the `request.auth` object. This is verified by the Firebase backend so we know it's the legitimate user.

```cpp
match /users/{uid} {
  allow read, write: if uid == request.auth.uid;
}
```

This is one of the most simple but essential rules to know in Firebase. We're capturing the `uid` with a wildcard in the path, and then securing the documents within that collection by asserting that the wildcard must match the `uid` of the currently authenticated user. 

This is another reason why it's important to think about what you are keying off of when you structure your data in Firestore. If you use the `uid` key it can make your rules really easy. However, you can still get the same security with a generated ID. 

```cpp
match /users/{uid} {
  allow read: if request.auth.uid = uid;
}
```

##### Getting the active document's data

```cpp
match /users/{uid} {
  allow read: if resource.data.uid == request.auth.uid;
}
```

#### Validating schema

```cpp
match /users/{uid} {
  allow write: if request.resource.data is string;
}
```

##### is

##### keys

##### diffs

#### Reading data within rules

##### get()

##### paths

#### Cleaner code with functions

##### Scoping

#### Workflow
How do we begin writing security rules? You can handle it one of two ways: write them directly in the Firebase Console, or write them locally within your project and deploy with the Firebase CLI.

##### Start with the CLI
The console is a good option for sample apps or hobby projects. However, it's a best practice to develop rules locally and deploy with the CLI. This allows your rules to be within source control for your project and makes it easier for teams to collaborate. 

```bash
firebase init firestore emulators
```

##### Write unit tests
In addition you can actually write unit tests against your security rules to make sure they don't break critical use cases between pushes to production.

##### Monitor requests in the Emulator UI

##### Exercise

#### Role Based Access Control

##### Store role information in Firestore

##### Verify the user's role

##### Exercise
