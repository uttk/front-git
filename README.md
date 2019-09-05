# Front-Git

This is a framework for JavaScript (TypeScript) that can manage data like Git.

Since it was made for studying, there is no practicality so far.

# Example

```javascript
import { createGit } from "front-git";

const initState = { name: "John", age: 31 };

const git = createGit(initState);

git.remote.set("origin", {
  push: done => {
    updateUser(get.getState())
      .then(done)
      .catch(console.error);
  },
  pull: async done => {
    const user = await getUser();

    if (user && user.name && user.age) {
      done(user);
    }
  }
});

git.subscribe("add", () => {
  console.log(`current index value : ${git.getIndex()}`);
  console.log(`cureent state value : ${git.getCurrentState()}`);
});

git.subscribe("commit", () => {
  console.log(`current commit logs : ${git.getLogs()}`);
  console.log(`state value : ${git.getState()}`);
});

git.pull("origin");

git.add({ name: "Hello World!" });
git.commit("first commit");

git.push("origin");
```

# Usage

## createGit

```javascript
imoprt { createGit } from "front-git";

const initState = {
  hello: "world!"
};

const git = createGit(initState);
```

## add

```javascript
// ...

const git = createGit(initState);

// OK👌
git.add({ name: "Hoge" });
git.add({ age: 41 });
git.add({ name: "Hogu", age: 100 });
git.add({});

// NG👎
git.add();
git.add(null);
git.add(1);
git.add("");
```

## commit

```javascript
// ...

const git = createGit(initState);

// OK👌
git.add({ name: "hoge" }).commit();
git.add({ age: 100 }).commit("Hello!");

// NG👎
git.commit();
git.add({ name: "hoge" }).commit({ message: "Hello" });
```

## subscribe

```javascript
// ...

const git = createGit(initState);

git.subscribe("add", () => {
  console.log("Add was executed !");
});

git.subscribe("commit", () => {
  console.log("Commit was executed !");
});

git.add({ name: "hoge" }); // Add was executed !

git.commit(); // Commit was executed !
```

## getIndex

```javascript
// ...

const git = createGit(initState);

let index = git.getIndex(); // null

git.add({ name: "hoge" });

state = git.getIndex(); // { name: "hoge" }

git.commit();

state = git.getIndex(); // null
```

## getState

```javascript
// ...

const git = createGit(initState);

let state = git.getState(); // { name: "John", age: 31 }

git.add({ name: "hoge" });

state = git.getState(); // { name: "John", age: 31 }

git.commit();

state = git.getState(); // { name: "hoge", age: 31 }
```

## getCurrentState

```javascript
// ...

const git = createGit(initState);

let state = git.getCurrentState(); // { name: "John", age: 31 }

git.add({ name: "hoge" });

state = git.getCurrentState(); // { name: "hoge", age: 31 }

git.commit();

state = git.getCurrentState(); // { name: "hoge", age: 31 }
```

## getLogs

```javascript
// ...

const git = createGit(initState);

let logs = git.getLogs(); // []

git.add({ name: "hoge" }).commit("First Commit");

logs = git.getIndex();
/*
[
  { 
    id: "xxxxxxxxxxxx", 
    comment: "First Commit",
    log: { ex: { name: "John" }, diff: { name: "hoge" }  },
    created_at: new Date()
  }
]
*/
```

## clearIndex

```javascript
// ...

const git = createGit(initState);

let index = git.getIndex(); // null

git.add({ name: "hoge" });

state = git.getIndex(); // { name: "hoge" }

git.clearIndex();

state = git.getIndex(); // null
```

## revertLog

```javascript
// ...

// init
const git = createGit(initState);
let state = git.getState(); // { name: "John", age: 31 }
let logs = git.getLogs(); // []

// commit
git.add({ name: "hoge" }).commit();
state = git.getState(); // { name: "hoge", age: 31 }
logs = git.getLogs(); // [ {...} ]

// commit
git.add({ age: 100 }).commit();
state = git.getState(); // { name: "hoge", age: 100 }
logs = git.getLogs(); // [ {...}, {...} ]

// revertLog
git.revertLog();
state = git.getState(); // { name: "hoge", age: 31 }
logs = git.getLogs(); // [ {...} ]

// revertLog
git.revertLog();
state = git.getState(); // { name: "John", age: 31 }
logs = git.getLogs(); // []
```

## remote.set

```javascript
// ...

const git = createGit(initState);

// OK👌
git.remote.set("origin", {
  push: done => {
    updateUser().then(done);
  },
  pull: async done => {
    const user = await getUser();
    done(user);
  }
});

// NG👎
git.remote("origin", {});
git.remote("origin", { push: () => updateUser() });
```

## push

```javascript
// ...

const git = createGit(initState);

// OK👌
git.remote.set("origin", { push: ... , pull: ... });
git.push("origin");

// NG👎
git.push();
git.push("unknown");
```

## pull

```javascript
// ...

const git = createGit(initState);

// OK👌
git.remote.set("origin", { push: ... , pull: ... });
git.pull("origin");

// NG👎
git.pull();
git.pull("unknown");
```
