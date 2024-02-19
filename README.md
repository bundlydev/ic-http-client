# ic-core-js

HTTP client to call ICP API Rest

## How to use

```javascript

const agent = new HttpAgent({
    //...
});

const backend = Actor.createActor(idlFactory, {
        agent,
        ...configuration,
});

const client = new HttpClient(backend);

// GET request
await result = client.get("/users", config);

// POST request
await result = client.post("/users", {
    username: "some-username",
    password: "password"
}, {
    headers: {
        "Content-Type": "application/json"
    }
});

// PUT request
await result = client.put("/users", {
    password: "password"
}, {
    headers: {
        "Content-Type": "application/json"
    }
});

// DELETE request
await result = client.put("/users", config);
```
