import ItemTable from "./ItemTable"
import { Input, Spacer, Grid} from "@nextui-org/react";
import { useState, useEffect} from "react"

import Iitem from "../interfaces/Iitem";

export default function TableSection({ data, rows, 
  setRows, setForm, setModal, setIsOpened } : {
    data: Array<Iitem> | undefined,
    rows: Array<Iitem> | undefined,

    setRows: (arg0: Array<Iitem> | undefined) => void,
    setForm: (arg0: Iitem | undefined) => void,
    setModal: (arg0: boolean) => void,
    setIsOpened: (arg0: boolean) => void
  }) {
    const [searchTerm, setSearchTerm] = useState("")

    const columns : Array<{ key: string, label: string}> =  [
        {
          key:"name",
          label: "Name",
        },
        {
          key: "count",
          label: "#",
        },
        {
          key: "date",
          label: "Due",
        },
        {
          key: "place",
          label: "Place",
        }
    ]

    useEffect(() => {
        if(searchTerm.length > 0) {
          const filteredRows = data?.filter(item => item.name.toLowerCase().includes(searchTerm.toLowerCase()))
          setRows(filteredRows)
        } else { setRows(data) }
      }, [searchTerm, data, setRows])

    return (
    <>
    <Spacer />
    <Grid.Container justify="center">
      <Grid>
        <Input 
          clearable
          bordered 
          labelPlaceholder='Search' 
          onChange={(e) => setSearchTerm(e.target.value)}
         />
      </Grid>
    </Grid.Container>
      
    <ItemTable 
        setIsOpened={setIsOpened} setForm={setForm} 
        setModal={setModal}
        rows={rows} columns={columns} />
    </>
    )
}