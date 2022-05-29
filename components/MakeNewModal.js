import { Spacer, Modal, Input, Text, Button, Grid, Loading } from "@nextui-org/react";

import { useState } from "react";

import host from "../constants/host";

import FormatTime from "../functions/FormatTime";

export default function MakeNewModal({ 
    isModalVisible, 
    setModalVisible, 
    setRows,
    setOrigData,
    origData,
    form, 
    setForm, 
    isOpened=false
}) {

    const [isLoading, setIsLoading] = useState(false);
    const [errorState, setErrorState] = useState("primary");
    const [saveButtonText, setSaveButtonText] = useState("Save");

    const textHandler = (e, name) => {
        const value = e.target.value;
        
        setForm(prevState => ({
            ...prevState,
            [name]: value
        }))
    }

    const submitForm = async () => {
        setErrorState("primary");

        const mod = isOpened ? "update" : "add";

        const response = await fetch(`${host}/api/sendItem/${mod}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(form)
        });

        const data = await response.json();

        console.log(data);

        if(data.success) {
            setModalVisible(false);
            if(!isOpened) {
                // Append new Item to states
                const formattedDate = FormatTime(data.date, false);
                const newItem = { name: data.name, date: formattedDate, group: data.group, count: data.count, _id: data._id }
                // append new item to rows and origData (for searching)
                setRows(prevState => [...prevState, newItem])
                setOrigData(prevState => [...prevState, newItem])
            } else {
                // modify item in rows and origData
                console.log(form)

                // convert time to DD.MM.YYYY format
                const formattedDate = FormatTime(form.date, false);
                const updatedItem = form;
                updatedItem.date = formattedDate;
                
                const index = origData.findIndex(item => item._id === updatedItem._id);
                setRows(prevState => {
                    prevState[index] = updatedItem;
                    return [...prevState]
                })
                setOrigData(prevState => {
                    prevState[index] = updatedItem;
                    return [...prevState]
                })
            }
         
            setIsLoading(false);
        } else {
            console.log(data.error);
            setIsLoading(false)
            setErrorState("error");
            setSaveButtonText("Error! Try again")
        }
    }

    const deleteForm = async () => {

        const response = await fetch(`${host}/api/removeItem`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(form)
        });

        const data = await response.json();

        if(data.success) {
            setModalVisible(false);
            //const newItem = { name: data.name, date: data.date, group: data.group, count: data.count, _id: data._id }
            // append new item to rows and origData (for searching)

            setRows(prevState => prevState.filter(item => item._id !== form._id))
            setOrigData(prevState =>prevState.filter(item => item._id !== form._id))
            //setIsLoading(false);
        } else {
            console.log(data.error);
            //setIsLoading(false)
            setErrorState("error");
            setSaveButtonText("Error! Try again")
        }
    }

    const renderButton = isLoading ? <Loading color={errorState == "primary" ? "primary" : "error"} /> : saveButtonText

    return (
    <>
    <Modal closeButton open={isModalVisible} onClose={() => setModalVisible(false)}>
    <Modal.Header>
    <Text id="modal-title" size={18}>Make new</Text>
    </Modal.Header>
    <Modal.Body>
    <Spacer y={1} />
    <Input onChange={(e) => textHandler(e, "name")} underlined clearable labelPlaceholder='Name' id="name" initialValue={form.name} />
    <Spacer  y={.25} />
    <Input onChange={(e) => textHandler(e, "count")} underlined clearable labelPlaceholder='Count' type="number" id="count" initialValue={form.count} />
    <Spacer  y={.25} />
    <Input onChange={(e) => textHandler(e, "date")} underlined clearable label='Date' type="date" initialValue={form.date} />
    <Spacer  y={.25} />
    <Input onChange={(e) => textHandler(e, "group")} underlined clearable labelPlaceholder='Place' initialValue={form.group} />
    <Spacer />
    <Modal.Footer>
    <Grid.Container gap={2} direction="row" justify="center">
        <Grid>
            <Button flat color={errorState == "primary" ? "primary" : "error"} onClick={(e) => {submitForm(); setIsLoading(true)}}>{renderButton}</Button>
        </Grid>
        {isOpened ? (
        <Grid>
            <Button flat color="error" onClick={(e) => deleteForm()}>Delete</Button>
        </Grid>
        ) : null}
        <Grid>
            <Button flat color="warning" onClick={(e) => setModalVisible(false)}>Back</Button>
        </Grid>
     
    </Grid.Container>
        
    </Modal.Footer>
    </Modal.Body>
    </Modal>
    </>
    )
}