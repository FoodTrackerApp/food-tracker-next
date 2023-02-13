import React from 'react'
import { Button, Container, Card, Text, Modal, Input, Spacer, Dropdown, Collapse } from "@nextui-org/react";
import { useState, useEffect } from "react";
import { FaCheck, FaPen, FaPlus, FaTrash } from 'react-icons/fa';
import { MdRotateLeft } from "react-icons/md"


import { uuidGen, _DATABASE_NAME_PERSONS, _DATABASE_NAME_SHOPPING_LIST, getSupabaseClient } from '@/functions/SupabaseClient';
import { dateDay, dateMinutes, dateMonth, dateHours, dateSeconds } from '@/functions/FormatTime';
import textHandler from '@/functions/TextHandler';
import { SyncList } from '@/functions/Sync';


import CustomNavbar from '@/components/CustomNavbar';


import IShoppingListItem from '@/interfaces/IShoppingListItem';
import IPerson from '@/interfaces/IPerson';
import ISettings from '@/interfaces/ISettings';


export default function List() {
    const [origData, setOrigData] = useState<Array<IShoppingListItem> | undefined>([]);
    const [rows, setRows] = useState<Array<IShoppingListItem> | undefined>([]);
    const [modal, setModal] = useState<boolean>(false);
    const [form, setForm] = useState<IShoppingListItem>({} as IShoppingListItem);
    const [dropdownSelected, setDropdownSelected] = useState<any>(new Set(["Set support by"]));
    const [editMode, setEditMode] = useState<boolean>(false);
    const [personRows, setPersonRows] = useState<Array<IPerson>>([]);
    const [isOnline, setIsOnline] = useState<boolean>(false);
    const [settings, setSettings] = useState<ISettings>({} as ISettings);

    // SYNC ON STARTUP
    useEffect(() => {
        sync();
    }, [])

    const filterData = () => {
        const filteredData = origData?.filter((item) => {
            return !item.deleted;
        })
        setRows(filteredData);
    }

    /**
     * Syncs the local data with the supabase database
    */
    const sync = async () => {
        SyncList({ settings, setSettings, origData, setOrigData, filterData, setPersonRows, setIsOnline }); 
    }

    const addItemHandler = () => {
        const newItem = {} as IShoppingListItem;
        newItem.id = uuidGen();
        newItem.name = form.name;
        newItem.count = form.count;
        newItem.supportedBy = selectedValue;
        newItem.deleted = false;

        // get date in format: 2023-02-12T22:36:08.346256+00:00
        const date = new Date();
        newItem.created_at = `${date.getFullYear()}-${dateMonth(date)}-${dateDay(date)}T${dateHours(date)}:${dateMinutes(date)}:${dateSeconds(date)}.${date.getMilliseconds()}+00:00`;

        console.log(newItem);
        closeHandler();
        // Add local
        setOrigData(prevState => [...prevState, newItem])
        setRows(prevState => [...prevState, newItem])

        console.log(rows);

        sync();
    }

    // Removes an item from the list
    const removeItemHandler = async (targetId : string) => {
        // set deleted to true
        const item = rows?.filter(item => item.id == targetId)[0];
        item.deleted = true;
        setRows(rows?.filter(item => item.id != targetId))

        // update item in origData
        const index = origData?.findIndex(item => item.id == targetId);
        origData[index] = item;
        setOrigData(origData);

        sync();
    }

    const editItemHandler = (targetId : string) => {
        console.log("Edit item", targetId);
        setEditMode(true);
        const targetItem = rows?.filter(item => item.id == targetId)[0];
        setForm(targetItem);
        openHandler();
    }

    const recoverHandler =(targetId : string) => {
        console.log("Recover");

        // set deleted to false
        const item = origData?.filter(item => item.id == targetId)[0];
        item.deleted = false;

        // update item in origData
        const index = origData?.findIndex(item => item.id == targetId);
        origData[index] = item;
        setOrigData(origData);

        filterData();

        sync();
    }

    const closeHandler =() => {
        setModal(false);
        console.log("closed");
    }

    const openHandler = () => {
        setForm({} as IShoppingListItem);
        setDropdownSelected(new Set(["Set support by"]));
        setModal(true);
        console.log("opened");
    }

    const selectedValue = React.useMemo(
        () => Array.from(dropdownSelected).join(", ").replaceAll("_", " "),
        [dropdownSelected]
      );

    return (
        <Container style={{ minHeight: "100vh" }}>
            <Modal 
                closeButton
                open={modal}
                onClose={closeHandler}
            >
                <Modal.Header>Add new item</Modal.Header>
                <Modal.Body>
                    <Spacer y={.25} />
                    <Input onChange={(e) => textHandler(e, "name", setForm )} required underlined clearable labelPlaceholder='Name'  type="text" initialValue={form?.name}  />
                    <Spacer  y={.25} />

                    <Input onChange={(e) => textHandler(e, "count", setForm )} required underlined clearable labelPlaceholder='Count'  type="number" initialValue={form?.count?.toString()}  />
                    <Spacer  y={.25} />

                    <Dropdown>
                        <Dropdown.Button>{selectedValue}</Dropdown.Button>
                        <Dropdown.Menu
                            selectionMode='multiple'
                            disallowEmptySelection
                            onSelectionChange={setDropdownSelected}
                        >
                            {personRows?.map((person) => {
                                return <Dropdown.Item key={person.name}>{person.name}</Dropdown.Item>
                            })}
                        </Dropdown.Menu>
                    </Dropdown>
                    <Spacer  y={.25} />
                </Modal.Body>
                <Modal.Footer>
                    <Button auto color="error" flat onClick={() => closeHandler()}>Cancel</Button>
                    <Button auto color="success" flat onClick={() => addItemHandler()}>Add</Button>
                </Modal.Footer>
            </Modal>
            <CustomNavbar current="List" online={isOnline} />
            <Button auto color="secondary" style={{ 
                    position: "absolute", 
                    bottom: "2rem", 
                    right: "7rem", 
                    height: "min-content",
                    zIndex: 1000
                }} 
                icon={<MdRotateLeft style={{ margin: "1.5rem"}} />}
                onPress={() => sync()} ></Button>           
            <Button auto color="success" style={{ 
                    position: "absolute", 
                    bottom: "2rem", 
                    right: "2rem", 
                    height: "min-content",
                    zIndex: 1000
                }} 
                icon={<FaPlus style={{ margin: "1.5rem"}} />}
                onPress={() => openHandler()} ></Button>
            {origData?.filter(item => item.deleted == true).length > 0 ? <Collapse style={{ marginTop: "1rem" }}  title="Done">
                <Container style={{ display: "flex", flexDirection: "column", gap: ".5rem", marginTop: "1rem" }}>
                    {origData?.filter(item => item.deleted == true).map(item => {
                        return (
                            <Card key={item.id}>
                                <Card.Header style={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }}><Text b>{item.name}</Text><Button onClick={() => recoverHandler(item.id)} color={"warning"} auto><MdRotateLeft /></Button></Card.Header>
                            </Card>
                        )
                    })}
                </Container>
            </Collapse> : null}
            <Container style={{ display: "flex", flexDirection: "column", gap: ".5rem", marginTop: "1rem" }}>
                {rows?.map(item => {
                    return (
                        <Card key={item.id}>
                            <Card.Header><Text b>{item.name}</Text></Card.Header>
                            <Card.Body style={{ paddingTop: "0", paddingBottom: "0"}}>
                                <p>Count: {item.count}</p>
                                <p>Supported by: {item.supportedBy}</p>
                            </Card.Body>
                            <Card.Footer>
                                <Container style={{ display: "flex", flexDirection: "row", gap: "1rem", flexWrap: "nowrap", padding: "0" }} >
                                    <Button auto color="error" flat onClick={() => removeItemHandler(item.id)}><FaTrash /></Button>
                                    <Button auto color="warning" flat onClick={() => editItemHandler(item.id)}><FaPen /></Button>
                                    <Button auto color="success" flat onClick={() => removeItemHandler(item.id)}><FaCheck /></Button>
                                </Container>

                            </Card.Footer>
                        </Card>
                    )
                })}
            </Container>
        </Container>
    )
}