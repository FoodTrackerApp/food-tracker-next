import { Card, Grid, Tooltip } from "@nextui-org/react";

import GetTimeDiffInDays from "@/functions/GetTimeDiffInDays";

import Iitem from "@/interfaces/Iitem";

/**
 * @description : This component is used to show the next due item
 * @param param0 : {nextDue : Iitem}
 * @returns 
 */
export default function NextDue({ nextDue, handleClick } : { nextDue : Iitem, handleClick : Function}) {
    
    return (
        <Grid>
            <Card>
                <Card.Body>
                    <span>Next due</span>
                    <h2>{nextDue?.name}</h2>
                    <Tooltip content={nextDue?.date} placement="bottom" color="success">
                        {GetTimeDiffInDays({date: nextDue?.date ? nextDue.date : 0, handleClick: handleClick, nextDue: nextDue})}
                    </Tooltip>
                </Card.Body>
            </Card>
        </Grid>
    )
}