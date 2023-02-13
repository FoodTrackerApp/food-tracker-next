import { Spacer, Modal, Input, Text, Button, Grid, Loading, Checkbox } from "@nextui-org/react";
import { useState, useEffect } from "react";

import FormatTime, { dateDay, dateHours, dateMinutes, dateMonth, dateSeconds } from "@/functions/FormatTime";
import { _DATABASE_NAME_ITEMS, uuidGen } from "@/functions/SupabaseClient";
import textHandler from "@/functions/TextHandler";

import Iitem from "@/interfaces/Iitem";

export default function MakeNewModal({ 
    isModalVisible, 
    setModalVisible, 
    setRows,
    setOrigData,
    origData,
    form, 
    setForm, 
    isOpened,
    syncData,
    setCleanData
    }) {

    const [isLoading, setIsLoading] = useState(false);
    const [errorState, setErrorState] = useState<"default" | "primary" | "secondary" | "success" | "warning" | "error" | "gradient">("primary");
    const [saveButtonText, setSaveButtonText] = useState("Save");

    useEffect(() => {
        setIsLoading(false);
    }, [])

    useEffect(() => {
        if(!isModalVisible) {
            syncData();
        }
    }, [isModalVisible])

    const addItem = () => {
        setIsLoading(true);
        setSaveButtonText("Saving...");
        
        const newItem : Iitem = form;

        // get date in format: 2023-02-12T22:36:08.346256+00:00
        const date = new Date();
        newItem.created_at = `${date.getFullYear()}-${dateMonth(date)}-${dateDay(date)}T${dateHours(date)}:${dateMinutes(date)}:${dateSeconds(date)}.${date.getMilliseconds()}+00:00`;
        
        newItem.deleted = false;
        newItem.toUpdate = false;
        
        if(!newItem.hasDueDate) {
            newItem.date = new Date("2100").getTime();
            newItem.hasDueDate = false;
        } else {
            newItem.date = new Date(newItem.date).getTime();
        }

        newItem.datemodified = new Date().getTime();

        newItem.id = uuidGen();

        console.log("New item:" , newItem);

        setRows((prevState : Array<Iitem>) => [...prevState, newItem])
        setOrigData((prevState : Array<Iitem>) => [...prevState, newItem])
        setCleanData((prevState : Array<Iitem>) => [...prevState, newItem]);

        setIsLoading(false);
        setModalVisible(false);
        setSaveButtonText("Save");

    }

    const deleteForm = async () => {
        console.log("Deleting item...")

        const newItem : Iitem = form;
        newItem.deleted = true;

        console.log("item to delete:", newItem);

        setOrigData((prevState : Array<Iitem>) => prevState.map((ele : Iitem) => {
            if(ele.id === newItem.id) {
                return newItem;
            } else {
                return ele;
            }
        }))

        setRows((prevState : Array<Iitem>) => prevState.map((ele : Iitem) => {	
            if(ele.id !== newItem.id) {	
                return ele;	
            }
        }))

        setCleanData((prevState : Array<Iitem>) => prevState.map((ele : Iitem) => {
            if(ele.id !== newItem.id) {
                return ele;
            }
        }))

        setModalVisible(false);
        setIsLoading(false);
        setSaveButtonText("Save");
    }

    const isEdit = () : Boolean => {
        if(form && form.name && form.name.length > 0) {
            return true;
        } else {
            return false;
        }
    }

    const renderButton = isLoading ? <Loading size="sm" color="white" /> : saveButtonText

    return (
    <>
    <Modal blur closeButton open={isModalVisible} onClose={() => setModalVisible(false)} css={{background: "#00000075", backdropFilter:"blur(10px)"}} >
        <Modal.Header> <Text id="modal-title" size={18}>{!isEdit() ? "Add a new Item" : `Edit ${form?.name}`}</Text></Modal.Header>

        <Modal.Body>
            <Spacer y={1} />
            <Input onChange={(e) => textHandler(e, "name", setForm )} required underlined clearable labelPlaceholder='Name'  type="text"   initialValue={form?.name}  />
            <Spacer  y={.25} />
            <Input onChange={(e) => textHandler(e, "count", setForm )} required underlined labelPlaceholder='Count' type="number" initialValue={form?.count}  />
            <Spacer  y={.25} />
            <Checkbox isSelected={form.hasDueDate} onChange={(e) => setForm(prevState => ({ ...prevState, ["hasDueDate"]: !form.hasDueDate})) }>Has due date?</Checkbox>
            {form.hasDueDate ? <>
                <Spacer y={0.25} />
                <Input onChange={(e) => textHandler(e, "date", setForm )} required underlined labelPlaceholder='Date' type="date" initialValue={FormatTime(form?.date, "YYYY-MM-DD").toString()} />
                </> : null    
            }
            <Spacer  y={.25} />
            <Input onChange={(e) => textHandler(e, "place", setForm)} required underlined clearable labelPlaceholder='Place' type="text"   initialValue={form?.place} />
            <Spacer />

            <Modal.Footer>
                <Grid.Container gap={2} direction="row" justify="center">
                    <Grid>
                        <Button color={errorState} onClick={(e) => {addItem(); setIsLoading(true)}}>{renderButton}</Button>
                    </Grid>
                    {isOpened ? (
                    <Grid>
                        <Button bordered color="error" onClick={(e) => deleteForm()}>Delete</Button>
                    </Grid>
                    ) : null}
                    <Grid>
                        <Button bordered color="warning" onClick={(e) => setModalVisible(false)}>Back</Button>
                    </Grid>
                </Grid.Container>
            </Modal.Footer>
        </Modal.Body>

    </Modal>
    </>
    )
}