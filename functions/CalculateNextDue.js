export default function CalculateNextDue(arr) {
    // Initial is first item in array
    if(arr.length == 0) {
        return "";
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