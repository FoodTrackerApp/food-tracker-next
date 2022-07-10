import { Spacer, Modal, Input, Text, Button, Grid, Loading } from "@nextui-org/react";
import { useState } from "react";
import FormatTime from "../functions/FormatTime";
import FormatTime2 from "../functions/FormatTime2";

export default function MakeNewModal({ 
    isModalVisible, 
    setModalVisible, 
    setRows,
    setOrigData,
    origData,
    form, 
    setForm, 
    isOpened
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

        let sendBody = {
            ...form,
        }
        // overwrite toUpdate which got carried over from form
        sendBody.toUpdate = isOpened;

        const response = await fetch(`api/send/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(sendBody)
        });

        const data = await response.json();

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
            setSaveButtonText("Save");
        } else {
            console.log("Got error from fetch", data);
            setIsLoading(false);
            setErrorState("error");
            setSaveButtonText("Error! Try again");
        }
    }

    const deleteForm = async () => {

        const response = await fetch(`/api/delete`, {
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

    const renderButton = isLoading ? <Loading size="sm" color="white" /> : saveButtonText

    return (
    <>
    <Modal blur closeButton open={isModalVisible} onClose={() => setModalVisible(false)} css={{background: "#00000075", backdropFilter:"blur(10px)"}} >
        <Modal.Header>
        <Text id="modal-title" size={18}>Make new</Text>
        </Modal.Header>

    <Modal.Body>
        <Spacer y={1} />
        <Input onChange={(e) => textHandler(e, "name" )} required underlined clearable labelPlaceholder='Name'  type="text"   initialValue={form.name}  />
        <Spacer  y={.25} />
        <Input onChange={(e) => textHandler(e, "count")} required underlined clearable labelPlaceholder='Count' type="number" initialValue={form.count}  />
        <Spacer  y={.25} />
        <Input onChange={(e) => textHandler(e, "date" )} required underlined clearable labelPlaceholder='Date'  type="date"   initialValue={FormatTime2(form.date)} />
        <Spacer  y={.25} />
        <Input onChange={(e) => textHandler(e, "group")} required underlined clearable labelPlaceholder='Place' type="text"   initialValue={form.group} />
        <Spacer />

        <Modal.Footer>
            <Grid.Container gap={2} direction="row" justify="center">
                <Grid>
                    <Button color={errorState} onClick={(e) => {submitForm(); setIsLoading(true)}}>{renderButton}</Button>
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