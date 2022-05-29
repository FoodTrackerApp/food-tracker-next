import { Table, Container, Tooltip, useAsyncList, useCollator } from "@nextui-org/react";

export default function ItemTable({ rows, columns, origData, setForm, setModal, setIsOpened }) {
  const collator = useCollator({ numeric: true });
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

  async function sort({ items, sortDescriptor }) {
    return {
      items: items.sort((a, b) => {
        let first = a[sortDescriptor.column];
        let second = b[sortDescriptor.column];
        let cmp = collator.compare(first, second);
        if(sortDescriptor.direction === "descening") {
          cmp *= -1;
        }
        return cmp;
      }),
    };
  }

  const handleSelect = (key) => {
    const selectedEle = rows.find(item => item._id == key);

    // set form to selected item
    setForm({...selectedEle});
    setIsOpened(true)
    setModal(true)
  }

  const list = useAsyncList({ rows, sort });

  return (
  <Container>
      <Table 
        aria-label='Example table with dynamic content'
        selectionMode="single"
        selectionBehavior="replace"
        sortDescriptor={list.sortDescriptor}
        onSortChange={list.sort}
        color="success"
        onRowAction={(key) => handleSelect(key)}
      >
        <Table.Header columns={columns}>
          {(column) => (
            <Table.Column key={column.key} allowsSorting={column.key == "count" ? true : false} >{column.label}</Table.Column>
          )}
        </Table.Header>
        <Table.Body items={rows}>
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