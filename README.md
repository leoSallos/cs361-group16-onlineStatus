Online service that keeps track of what users are online/offline depending on
when they past pined the service with their user ID. After 1 minute of no ping,
the user will get marked offline.

# Communication Contract

### Requests

`GET /`

`GET /list`

`GET /online/<userID>`

`POST /new`

### Responses

`GET /`

`GET /list`

`GET /online/<userID>`

`POST /new`
