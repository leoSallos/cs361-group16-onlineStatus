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

`POST /new`

### Responses

`GET /`
- `204`: Status if there is a successful ping, no body.

`GET /list`
- `200`: Sends body in the following format:
```
{
    users: [
        {
            name: <username>
            status: <user status: "online"/"offline">
        }
    ]
}
```

`GET /online/<userID>`

`POST /new`
