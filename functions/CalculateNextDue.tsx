import Iitem from "../interfaces/Iitem";

/**
 * @description Takes array of objects with date property. Returns object with next due date.
 * @param arr 
 * @returns 
 */
export default function CalculateNextDue(arr : Array<Iitem>) : Iitem {
    // Initial is first item in array
    if(arr.length == 0) {
        return {} as Iitem;
    }
        
    let nextDue = arr[0], nextDueTime = nextDue.date;
    arr.forEach(item => {
        const date = item.date;
        if(date < nextDueTime) {
            nextDue = item;
            nextDueTime = date;
        }
    });
    return nextDue;
}