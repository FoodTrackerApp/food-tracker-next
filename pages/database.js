import { Container, Button, Checkbox, Spacer } from "@nextui-org/react";
import Head from "next/head";
import { useState, useEffect } from "react";
import { MdRefresh } from "react-icons/md";

const Database = ({ }) => {
    const [data, setData] = useState([]);
    const [showDeleted, setShowDeleted] = useState(false);

    const fetchData = async () => {
        console.log("Fetching data");
        const response = await fetch(`api/get/`);
        let data = await response.json();
        console.log("Got data:", data);

        // Filter out deleted items, if not desired
        if(!showDeleted) {
            data = data.filter((ele) => (ele.deleted === null) || (ele.deleted === 0));
        }

        setData(data);
    }

    // Fetching data on load and on changing showDeleted
    useEffect(() => {
        fetchData();
    },[showDeleted])

    

    return (
        <>
        <Head>
            <title>FoodTracker | Database View</title>
            <meta name="description" content="FoodTracker" />
            <link rel="icon" href="/favicon.ico" />
            <meta name="viewport" content="width=device-width, initial-scale=1"/>
        </Head>
        <Container style={{ padding: "1rem"}}>
        <Container style={{display: "flex", gap: "1rem"}}>
            <Button
                auto
                onClick={() => fetchData()}
                icon={<MdRefresh />}>
            </Button>
            <Checkbox onChange={() => setShowDeleted(!showDeleted)} defaultChecked={showDeleted}>Show deleted</Checkbox>
        </Container>
            <pre>
                {JSON.stringify(data, null, 2)}
            </pre>
        </Container>
        </>
    )
}

export default Database;