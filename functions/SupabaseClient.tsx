import { v4 as uuidGen } from "uuid";
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://rfwwdmxbcwcginiojagw.supabase.co'
const supabaseKey = process.env.NEXT_PUBLIC_DB_KEY;
const supabase = createClient(supabaseUrl, supabaseKey)

const _DATABASE_NAME_SHOPPING_LIST = "shoppingList";
const _DATABASE_NAME_PERSONS = "persons";

export { supabase, _DATABASE_NAME_PERSONS, _DATABASE_NAME_SHOPPING_LIST, uuidGen}
