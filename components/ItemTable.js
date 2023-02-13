import { Table, Container, Tooltip, useAsyncList, useCollator } from "@nextui-org/react";
import { useEffect } from "react";
import FormatTime from "../functions/FormatTime";

export default function ItemTable({ rows, columns, 
  setForm, setModal, setIsOpened }) {

  const renderCell = (item, key) => {
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

  const handleSelect = (key) => {
    const selectedEle = rows?.find(item => item._id == key);

    // set form to selected item
    setForm({...selectedEle});
    setIsOpened(true)
    setModal(true)
  }

  async function load({ searchTerm }) {
    if(searchTerm) {
      return {
        items: rows.filter(item => item.name.toLowerCase().includes(searchTerm.toLowerCase()))
      }
    } else { return { items: rows } }
  }

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
      onRowAction={(key) => handleSelect(key)}
      sortDescriptor={list.sortDescriptor}
      onSort={list.sort}
      onSortChange={list.sort}
    >
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