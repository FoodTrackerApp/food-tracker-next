import FormatTime from "./FormatTime";

export default function CalculateNextDue(arr) {
    // Initial is first item in array
    if(arr.length == 0) {
        return "";
    }
        
    let nextDue = arr[0], nextDueTime = FormatTime(nextDue.date);
    arr.forEach(item => {
        const date = FormatTime(item.date);
        if(date.getTime() < nextDueTime) {
            nextDue = item;
            nextDueTime = date.getTime();
        }
    });
    return nextDue;
}