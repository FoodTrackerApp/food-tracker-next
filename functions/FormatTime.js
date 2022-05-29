


// takes time in DD.MM.YYYY or YYYY-MM-DD format and returns Date Object
export default function FormatTime(date, direction=true) {
    let newDate

    if(direction === true) {
        // if date is in DD.MM.YYYY format, return Date object
        const formattedDate = date.split(".");
        newDate = new Date(formattedDate[2], formattedDate[1]-1, formattedDate[0]);
    } else {
        // if date is in YYYY-MM-DD format, return string in DD.MM.YYYY format
        const formattedDate = date.split("-");
        newDate = `${formattedDate[2]}.${formattedDate[1]}.${formattedDate[0]}`;
    }

    return newDate;

}