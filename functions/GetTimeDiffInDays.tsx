import { Button } from "@nextui-org/react";

import Iitem from "@/interfaces/Iitem";

/**
 * @description : Get the difference between two dates in days
 * @param param0 : {handleClick: Function, date: number, nextDue: Iitem}
 * @returns ButtonComponent
 */
export default function GetTimeDiffInDays({handleClick, date, nextDue} :{
    handleClick: Function, date: number, nextDue: Iitem
}) {
    const now = new Date().getTime();

    const dueDate = date;
    const timeDiff = dueDate - now;
    const diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
    const days = Math.abs(diffDays);
    const mod = days === 1 ? "day" : "days";

    if(diffDays > 10000) {
      return (
        <Button onClick={() => handleClick(nextDue?.id)} flat color="success">
          Has no due date
        </Button>
      )
    }
    if(diffDays > 0) {
      return (
        <Button onClick={() => handleClick(nextDue?.id)} flat color="success">
          {`In ${diffDays} ${mod}`}
        </Button>
      )
    } else if(diffDays === 0) {
      // due today
      return (
        <Button onClick={() => handleClick(nextDue?.id)} flat color="warning">
          {`Due today`}
        </Button>
      )
    } else {
      return (
        <Button onClick={() => handleClick(nextDue?.id)} flat color="warning">
          {`Overdue since ${days} ${mod}`}
        </Button>
      )
    }
}