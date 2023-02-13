# Food Tracker (next)
FoodTracker is a (partly) locally hosted Web App that can Track Food Items

For the App integration, go to [FoodTrackerApp]

## Features

- Due Dates
- Counter
- Sorted Table
- Next Due notifier
- A shopping list

## Tech

FoodTracker next uses these technologies:

- [Next]
- [React]
- [nedb]
- [supabase]

## Installation

### 1. Download the repo via GitHub CLI

```sh
gh repo clone cr4yfish/food-tracker-next
```

### 2. Change the IP the frontend will call to
```sh
cd food-tracker-next/constants
nano hosts.js
```
- Change the follwing line.

```js
const host = "http://[YOUR IP ADDRESS]:30010";
```
If you are running FoodTracker on a Pi, for example, you should insert the Pi's IP.
To find out your IP on Linux (which a PI is running on).
```sh
hostname -I
```
Make sure to use an upper-case "i".

### 3. Build and start the Server

In the food-tracker-next/ directory
```sh
npm run build
```

Then
```sh
npm run start
```

### 4. (optional) Set up pm2

Stop the running instance
```sh
[ctrl+c]
```
- Install [pm2]
```sh
npm install pm2 -g
```
- Add z2m to pm2
```sh
pm2 start npm --name foodTracker -- start
pm2 save
pm2 start foodTracker
```

## Known Issues


## Development

For local development I recommend changing the IP to localhost
```js
const host = "http://localhost:30010";
```


[next]: <https://nextjs.org//>
[react]: <https://reactjs.org//>
[nedb]: <https://github.com/seald/nedb>
[pm2]: <https://pm2.keymetrics.io/>
[FoodTrackerApp]: <https://github.com/cr4yfish/foodTrackerApp>
[supabase]: <https://supabase.io/>
