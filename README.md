# steam-mercator

Playing around with [node-steam-user](https://github.com/DoctorMcKay/node-steam-user) and 
[node-steamcommunity](https://github.com/DoctorMcKay/node-steamcommunity).

## Running
```
git clone https://github.com/LW2904/steam-mercator.git && cd steam-mercator
npm i
node app
```
This requires you to have a *accountdata.json* file in the root project directory. 
Alternatively you can set the path to the file with the DATA_PATH process env variable 
(e.g. `DATA_PATH=../some/other/directory/file.json node app`).
```
{
  "bot": {
    "accountName": "secret",
    "password": "very secret",
    "idsec": "also very secret",
    "shasec": "very very secret"
  }
}
```

## Debug

For debug/verbose logging set the NODE_ENV process env var to 'dev'.
