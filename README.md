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

### 1. Download the repo via GitHub CLI and install deps

```sh
gh repo clone cr4yfish/food-tracker-next
```
```sh 
cd food-tracker-next
```

You should use yarn for now, since there is an issue with @react-aria and npm.
```sh
yarn
```

### 2. Configure Supabase
To use the shopping list, you will need to set-up 2 tables in a supabase database:
* shoppingList
* persons

The table specs can be seen in @interfaces/IShoppingListItem and @interfaces/IPerson.

After that, you just need to make a local env like this:
```sh
touch .env.local
```
Then, put this in there with the editor of your choice:
```env
NEXT_PUBLIC_DB_KEY="[your api key from supabase]"
```
If you're unsure where to find the API key, go to the supabase API docs.

(Note: This will change in near future with coming security improvements)

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
