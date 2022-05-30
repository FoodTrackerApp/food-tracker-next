import { Table, Container, Tooltip, useAsyncList, useCollator } from "@nextui-org/react";
import { useState, useEffect } from "react";

export default function ItemTable({ rows, columns, 
  origData, setForm, setModal, setIsOpened, searchTerm }) {

  const renderCell = (item, key) => {
    const cellValue = item[key];

    switch(key) {
      case "name":
        return (
          <Tooltip content={`Some more info about ${cellValue}`}>
            <span>{cellValue}</span>
          </Tooltip>
        );
      case "count":
        return cellValue;
      case "date":
        return cellValue;
      case "group":
        return cellValue;
      default:
          return cellValue
    }
  }

  const handleSelect = (key) => {
    const selectedEle = rows.find(item => item._id == key);

    // set form to selected item
    setForm({...selectedEle});
    setIsOpened(true)
    setModal(true)
  }

  async function load({ signal, searchTerm }) {
    console.log("Search:", searchTerm)
    if(searchTerm) {
      return {
        items: rows.filter(item => item.name.toLowerCase().includes(searchTerm.toLowerCase()))
      }
    } else { return { items: rows } }
  }

  // reload list when rows change
  useEffect(() => {
    list.reload();
  }, [rows, list])

  // Sorting stuff
  const collator = useCollator({numeric: true});

  async function sort({ items, sortDescriptor }) {
    return {
      items: items.sort((a, b) => {
        let first = a[sortDescriptor.column];
        let second = b[sortDescriptor.column];
        let cmp = collator.compare(first, second);
        if (sortDescriptor.direction === "descending") {
          cmp *= -1;
        }
        return cmp;
      }),
    };
  }

  const list = useAsyncList({load, sort});

  return (
  <Container>
    <Table 
      aria-label='Example table with dynamic content'
      selectionMode="single"
      selectionBehavior="replace"
      color="success"
      onRowAction={(key) => handleSelect(key)}
      sortDescriptor={list.sortDescriptor}
      onSort={list.sort}
      onSortChange={list.sort}
    >
    {console.log(list)}
      <Table.Header columns={columns}>
        {(column) => (
          <Table.Column key={column.key} allowsSorting >{column.label}</Table.Column>
        )}
      </Table.Header>
      <Table.Body items={list.items} loadingState={list.loadingState} >
        {(item) => (
          <Table.Row key={item._id}>
            {(columnKey) => <Table.Cell>{renderCell(item, columnKey)}</Table.Cell>}
          </Table.Row>
        )}
      </Table.Body>
    </Table>
  </Container>
  )
}