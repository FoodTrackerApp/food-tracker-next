// Takes date in time. Outputs string in format DD.MM.YYYY
export default function FormatTime(date, outFormat = "DD.MM.YYYY") {
    const dateMonth = (date) => {
      if(parseInt(date.getMonth()+1) < 10) {
          return `0${date.getMonth()+1}`
      } else { return date.getMonth()+1 }
    }
    const dateDay = (date) => {
      if(parseInt(date.getDate()) < 10) {
          return `0${date.getDate()}`
      } else { return date.getDate() }
    }
    
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