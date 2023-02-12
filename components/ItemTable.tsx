import { Table, Container, Tooltip, useAsyncList, useCollator } from "@nextui-org/react";
import { useEffect } from "react";
import FormatTime from "../functions/FormatTime.jsx";

import Iitem from "../interfaces/Iitem.jsx";

export default function ItemTable({ rows, columns, 
  setForm, setModal, setIsOpened } : {
    rows: Array<Iitem> | undefined,
    columns: Array<{ key: string, label: string}>,

    setForm: (arg0: Iitem | undefined) => void,
    setModal: (arg0: boolean) => void,
    setIsOpened: (arg0: boolean) => void
  }) {

  const renderCell = (item : any, key : any) => {
    const cellValue = item[key];
    switch(key) {
      case "name":
        return cellValue;
      case "count":
        return cellValue;
      case "date":
        const date = FormatTime(cellValue);
        return date;
      case "place":
        return cellValue;
      default:
          return cellValue
    }
  }

  const handleSelect = (key : any) => {
    const selectedEle = rows?.find(item => item._id == key);

    // set form to selected item
    setForm({...selectedEle as Iitem});
    setIsOpened(true)
    setModal(true)
  }

  async function load({ searchTerm } : { searchTerm: string }) {
    if(searchTerm) {
      return {
        items: rows?.filter(item => item.name.toLowerCase().includes(searchTerm.toLowerCase()))
      }
    } else { return { items: rows } }
  }

  const convertDateToTime = (date : string) => {
    // tage date string in DD.MM.YYYY format
    // return time string in ms from 1970
    const dateString = date.split(".")
    return new Date(parseInt(dateString[2]), parseInt(dateString[1])-1, parseInt(dateString[0])).getTime();
  }

  // Sorting stuff
  const collator = useCollator({numeric: true});

  async function sort({ items, sortDescriptor } : { items: Array<Iitem>, sortDescriptor: any }) {
    return {
      items: items.sort((a : any , b : any) => {
        let first = a[sortDescriptor.column];
        let second = b[sortDescriptor.column];

        let cmp = collator.compare(first, second);
        if (sortDescriptor.direction === "descending") {
          cmp *= -1;
        }

        return cmp;
      }),
    }
  }

  const list = useAsyncList({load, sort});

  // reload list when rows change
  useEffect(() => {
    list.reload();
  }, [rows])

  return (
  <Container>
    <Table 
      aria-label='Example table with dynamic content'
      selectionMode="single"
      selectionBehavior="replace"
      color="success"
      onRowAction={(key : any) => handleSelect(key)}
      sortDescriptor={list.sortDescriptor}
      onSort={list.sort}
      onSortChange={list.sort}
    >
      <Table.Header columns={columns}>
        {(column : any) => (
          <Table.Column key={column.key} allowsSorting >{column.label}</Table.Column>
        )}
      </Table.Header>
      <Table.Body items={list.items} loadingState={list.loadingState} >
        {(item : Iitem) => (
          <Table.Row key={item._id}>
            {(columnKey : any) => <Table.Cell>{renderCell(item, columnKey)}</Table.Cell>}
          </Table.Row>
        )}
      </Table.Body>
    </Table>
  </Container>
  )
}