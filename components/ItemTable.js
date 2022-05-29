import { Table, Container, Tooltip } from "@nextui-org/react";

export default function ItemTable({ rows, columns, origData, setForm, setModal, setIsOpened }) {
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

  return (
  <Container>
      <Table 
        aria-label='Example table with dynamic content'
        selectionMode="single"
        selectionBehavior="replace"
        color="success"
        onRowAction={(key) => handleSelect(key)}
      >
        <Table.Header columns={columns}>
          {(column) => (
            <Table.Column key={column.key} >{column.label}</Table.Column>
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