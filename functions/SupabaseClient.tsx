import { v4 as uuidGen } from "uuid";
import { createClient } from '@supabase/supabase-js';

const _DATABASE_NAME_SHOPPING_LIST = "shoppingList";
const _DATABASE_NAME_PERSONS = "persons";
const _DATABASE_NAME_ITEMS = "items";

/**
 * @description Generates a supabase client
 * @param url : string
 * @param key : string
 * @returns supabase client
 */
const getSupabaseClient = (url: string, key: string) => {
    try {
        console.log("Generating supabase client", url, key)
        return createClient(url, key);
    } catch (e) {
        console.log("Error creating supabase client: ", e);
        return null;
    }
    
}

export {  _DATABASE_NAME_PERSONS, _DATABASE_NAME_SHOPPING_LIST, uuidGen, getSupabaseClient, _DATABASE_NAME_ITEMS}
