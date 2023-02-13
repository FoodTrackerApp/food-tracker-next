import { getSupabaseClient, _DATABASE_NAME_ITEMS, _DATABASE_NAME_SHOPPING_LIST, _DATABASE_NAME_PERSONS } from "./SupabaseClient";
import CalculateNextDue from "./CalculateNextDue";
import { readSettings } from "./Settings";

import Iitem from "@/interfaces/Iitem";
import IShoppingListItem from "@/interfaces/IShoppingListItem";
import ISettings from "@/interfaces/ISettings";

/**
 * @description Syncs the items with the database
 * @param param0 : {settings : ISettings, setSettings : Function, origData : Array<Iitem>, setOrigData : Function, setRows : Function, setNextDue : Function, setIsOnline : Function}
 * @returns 
 */
async function SyncItems({ 
    settings, setSettings, 
    origData, setOrigData, 
    setRows, setNextDue, 
    setIsOnline, setCleanData
    }) {
    return new Promise(async (resolve, reject) => {

      console.log("Syncing data");

      console.log("Getting settings");

      const settings : ISettings = await readSettings();
      console.log("Got settings", settings);

      const supabase = getSupabaseClient(settings.supabaseUrl, settings.supabaseKey);

      if(!supabase) { 
        console.log("No supabase client found");
        setIsOnline(false);
        reject("No supabase client found");
        return;
      }

      console.log("OrigData:" , origData);

      const { data: updatedData, error } = await supabase.from(_DATABASE_NAME_ITEMS).upsert(origData).select()
      console.log("Upserted Data from supabase:", updatedData, error);

      const { data: newItems, error: err } = await supabase.from(_DATABASE_NAME_ITEMS).select('*')
      console.log("new items from supabase:", newItems, err);

      if(newItems) {
        setOrigData(newItems);
        const noDeleted = newItems.filter((ele : Iitem) => (ele.deleted === false));
        setRows(noDeleted);
        setCleanData(noDeleted);
        console.log("Rows:", noDeleted)
        setNextDue(CalculateNextDue(newItems));
        setIsOnline(true);
        resolve("Success");
      }
  });
}

/**
 * @description Syncs the shopping list with the database
 * @param param0 : {settings : ISettings, setSettings : Function, origData : Array<IShoppingListItem>, setOrigData : Function, filterData : Function, setPersonRows : Function, setIsOnline : Function}
 * @returns 
 */
async function SyncList({ 
  settings, setSettings,
  origData, setOrigData,
  filterData,
  setPersonRows,
  setIsOnline
 }) {
  console.log("Syncing");

  console.log("Getting settings");
  const settingsResponse : ISettings = await readSettings();
  setSettings(settingsResponse);

  console.log("Getting supabase client");
  const supabase = getSupabaseClient(settingsResponse.supabaseUrl, settingsResponse.supabaseKey);

  if(!supabase) { 
      console.log("No supabase client found");
      setIsOnline(false);
      return;
  }

  const { data: updatedData, error } = await supabase.from(_DATABASE_NAME_SHOPPING_LIST).upsert(origData).select()
  console.log("Upserted Data from supabase:", updatedData, error);

  const { data: shoppingList, error: err } = await supabase.from(_DATABASE_NAME_SHOPPING_LIST).select('*')
  console.log("Shopping list from supabase:", shoppingList, err);

  if(shoppingList) {
      setOrigData(shoppingList);
      filterData();
  }

  const { data: persons, error: err2 } = await supabase.from(_DATABASE_NAME_PERSONS).select('*')
  console.log("Persons from supabase:", persons, err2);
  setPersonRows(persons);
  setIsOnline(true);
  console.log("Synced");
  
}

export { SyncItems, SyncList }