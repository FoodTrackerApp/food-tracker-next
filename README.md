# Food Tracker (next)
FoodTracker is a cloud-based Web App that can Track Food Items

For the App integration, go to [FoodTrackerApp]
(Note: The App Integration is currently non-functional until the remake is completed)

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

### 3. Build and start the Server

In the food-tracker-next/ directory
```sh
npm run build
```

Then
```sh
npm run start
```

### 4. Configure the settings
Open the webapp and go to the Settings tab.
There, you will need to fill out the Supabase URL and key to be able to connect to your database.

## Known Issues
- The App Integration is currently non-functional

## Development

To run the dev server:
```sh
npm run dev
```


[next]: <https://nextjs.org//>
[react]: <https://reactjs.org//>
[nedb]: <https://github.com/seald/nedb>
[pm2]: <https://pm2.keymetrics.io/>
[FoodTrackerApp]: <https://github.com/cr4yfish/foodTrackerApp>
[supabase]: <https://supabase.io/>
