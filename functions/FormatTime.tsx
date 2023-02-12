/**
 * @description Takes Date Object. Returns Month in format MM (will add a 0 if month is < 10)
 * @param date : Date
 * @returns 
 */
const dateMonth = (date : Date) => {
  if((date.getMonth()+1) < 10) {
      return `0${date.getMonth()+1}`
  } else { return date.getMonth()+1 }
}

/**
 * @description Takes Date Object. Returns Day in format DD (will add a 0 if day is < 10)
 * @param date : Date
 * @returns 
 */
const dateDay = (date : Date) => {
  if(date.getDate() < 10) {
      return `0${date.getDate()}`
  } else { return date.getDate() }
}

/**
 * @description Takes date in time. Outputs string in format DD.MM.YYYY
 * @param {*} date 
 * @param {*} outFormat 
 * @returns string | number | Date
 */
export default function FormatTime(date : (string | number | Date), outFormat = "DD.MM.YYYY") : string | number | Date {
  // Map Date to DD.MM.YYYY
  date = new Date(date);
  switch(outFormat) {
    case "DD.MM.YYYY":
      return `${dateDay(date)}.${dateMonth(date)}.${date.getFullYear()}`
    case "YYYY-MM-DD":
      return `${date.getFullYear()}-${dateMonth(date)}-${dateDay(date)}`
    default:
      return date
  }
}