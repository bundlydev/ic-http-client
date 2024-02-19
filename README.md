# ic-http-client

HTTP client to call ICP API Rest

## How to use

```javascript
const agent = new HttpAgent({
  host,
  identity,
  //...
});

const backend = Actor.createActor(idlFactory, {
  agent,
  ...configuration,
});

const client = new HttpClient(backend);

// GET request
const result = await client.get("/users", config);

// POST request
const result = await client.post(
  "/users",
  {
    username: "some-username",
    password: "password",
  },
  {
    headers: {
      "Content-Type": "application/json",
    },
  }
);

// PUT request
const result = await client.put(
  "/users",
  {
    password: "password",
  },
  {
    headers: {
      "Content-Type": "application/json",
    },
  }
);

// DELETE request
const result = await client.delete("/users", config);
```
