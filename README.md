Online service that keeps track of what users are online/offline depending on
when they past pined the service with their user ID. After 1 minute of no ping,
the user will get marked offline.

# Communication Contract

### Requests

`GET /`
- no body

`GET /list`
- no body

`GET /online/<userID>`
- no body

`POST /new`
- send request body in the following format:
```
{
    name: <username>
}
```

### Responses

`GET /`
- `204`: Status if there is a successful ping, no body.

`GET /list`
- `200`: Sends body in the following format:
```
{
    users: [
        {
            name: <username>,
            status: <user status: "online"/"offline">
        }
    ]
}
```

`GET /online/<userID>`
- `404`: User ID was not found, no body.
- `204`: User online status was successfuly updated, no body.

`POST /new`
- `400`: Improper request body format, no body.
- `200`: Response is in the following format:
```
{
    id: <new user id>
}
```
