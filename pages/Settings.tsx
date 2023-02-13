import { Container, Button, Card, Text, Modal, Input, Spacer } from "@nextui-org/react"
import { useState, useEffect } from "react"

import CustomNavbar from "@/components/CustomNavbar"
import { supabase, uuidGen, _DATABASE_NAME_PERSONS } from "@/functions/SupabaseClient"
import { dateDay, dateHours, dateMinutes, dateMonth, dateSeconds } from "@/functions/FormatTime"

import ISettings from "@/interfaces/ISettings"
import IPerson from "@/interfaces/IPerson"

export default function Settings() {
    const [originalSettings, setOriginalSettings] = useState<ISettings>({} as ISettings)
    const [settings, setSettings] = useState<ISettings>({} as ISettings)
    const [personsRows, setPersonsRows] = useState<Array<IPerson>>([])
    const [form, setForm] = useState<IPerson>({} as IPerson)
    const [modal, setModal] = useState<boolean>(false)
    
    useEffect(() => {
        syncPersons();
    }, [])

    const addPerson = () => {
        const newPerson = {} as IPerson;
        newPerson.id = uuidGen();
        newPerson.name = form.name;

        // get date in format: 2023-02-12T22:36:08.346256+00:00
        const date = new Date();
        newPerson.created_at = `${date.getFullYear()}-${dateMonth(date)}-${dateDay(date)}T${dateHours(date)}:${dateMinutes(date)}:${dateSeconds(date)}.${date.getMilliseconds()}+00:00`;

        console.log("newPerson: ", newPerson);

        closeHandler();
        setPersonsRows([...personsRows, newPerson]);
        console.log("Local personsRows: ", personsRows);

        //syncPersons();
    }

    const deletePerson = (id: string) => {
        const newPersonsRows = personsRows.filter((person) => {
            return person.id !== id;
        })
        setPersonsRows(newPersonsRows);
    }

    const syncPersons = async () => {
        console.log("Syncing persons...")

        const { data: updatedData, error } = await supabase.from(_DATABASE_NAME_PERSONS).upsert(personsRows).select()
        console.log("Updated data: ", updatedData, error);

        const { data: persons, error: err } = await supabase.from(_DATABASE_NAME_PERSONS).select('*')
        console.log("Persons list from supabase:", persons, err);
        setPersonsRows(persons);
        
    }

    const textHandler = (e, name) => {
        let value = e.target.value;
        
        setForm(prevState => ({
            ...prevState,
            [name]: value
        }))
    }

    const closeHandler =() => {
        setModal(false);
        console.log("closed");
    }

    const openHandler = () => {
        setForm({} as IPerson);
        setModal(true);
        console.log("opened");
    }

    return (
        <Container>
            <CustomNavbar current="Settings" />
            <Container style={{ display: "flex", flexDirection: "row", flexWrap: "nowrap", gap: ".5rem", marginTop: "1rem" }} >
                <Button color="success" auto style={{ margin: "0" }} onPress={() => openHandler()}>Add</Button>
                <Button color="secondary" auto style={{ margin: "0" }} onPress={() => syncPersons()}>Sync</Button>  
            </Container>
            
            
            <Modal
                closeButton
                open={modal}
                onClose={closeHandler}
            >
                <Modal.Header>Modal Title</Modal.Header>
                <Modal.Body>
                    <Spacer y={0.25} />
                    <Input onChange={(e) => textHandler(e, "name")} required underlined clearable type="text" initialValue={form?.name} labelPlaceholder="Name" />
                    <Spacer y={0.25} />
                </Modal.Body>
                <Modal.Footer>
                    <Button auto onClick={() => closeHandler()}>Cancel</Button>
                    <Button auto color="success" onClick={() => addPerson()}>Save</Button>
                </Modal.Footer>
            </Modal>

            <Container style={{ display: "flex", flexDirection: "column", gap: ".5rem", marginTop: "1rem" }} >
                {personsRows.map((person) => {
                    return (
                        <Card key={person.id}>
                            <Card.Header>
                                <Text b>{person.name}</Text>
                            </Card.Header>
                            <Card.Body style={{ paddingTop: "0" }}>
                                <Button auto color="error" onClick={() => deletePerson(person.id)}>Delete</Button>
                            </Card.Body>
                        </Card>
                    )
                })}
            </Container>

        </Container>
    )
}