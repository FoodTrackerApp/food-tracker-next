export default function FormatTime2(date) {
    const formattedDate = date.split(".");
    return `${formattedDate[2]}-${formattedDate[1]}-${formattedDate[0]}`;
}