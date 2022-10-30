import Head from 'next/head'
import { Container, Card, Tooltip, Button, Grid, Spacer, Text} from "@nextui-org/react";
import { FaQrcode, FaPlusSquare } from "react-icons/fa";
import { useState, useEffect } from "react";
import TableSection from '../components/TableSection.js';
import MakeNewModal from '../components/MakeNewModal.js';
import CalculateNextDue from '../functions/CalculateNextDue.js';

const Home = ({ }) => {
  // only use data for this, use OrigData from now on
  const [origData, setOrigData] = useState([]);
  const [nextDue, setNextDue] = useState({});
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [rows, setRows] = useState([]);
  const [form, setForm] = useState({name: "", count: "", date: "", place: ""});
  const [isOpened, setIsOpened] = useState(false);

  const getTimeDiffInDays = (date) => {
    const now = new Date().getTime();

    const dueDate = date;
    const timeDiff = dueDate - now;
    const diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
    const days = Math.abs(diffDays);
    const mod = days === 1 ? "day" : "days";

    if(diffDays > 0) {
      return (

        <Button onClick={() => handleClick(nextDue._id)} flat color="success">
          {`In ${diffDays} ${mod}`}
        </Button>
      )
    } else if(diffDays === 0) {
      // due today
      return (
        <Button onClick={() => handleClick(nextDue._id)} flat color="warning">
          {`Due today`}
        </Button>
      )
    } else {
      return (
        <Button onClick={() => handleClick(nextDue._id)} flat color="warning">
          {`Overdue since ${days} ${mod}`}
        </Button>
      )
    }
  }

  const handleClick = (key) => {
    console.log(key)
    const element = origData.find((ele) => ele._id == key);

    setForm({...element});
    setIsOpened(true);
    setIsModalVisible(true);
  }

  const clearForm = () => {
    setForm({name: "", count: "", date: "", place: ""});
  }

  // Refresh next due data on origData change
  useEffect(() => {
    if(origData.length > 0) {
      setNextDue(CalculateNextDue(origData));
    }
  }, [setNextDue, origData]);

  // fetch data on load
  useEffect(() => {
    fetchData();
  }, []);

  const renderNextDue = origData.length > 0 ? (
    <Grid>
    <Card>
      <span>Next due</span>
      <h2>{nextDue.name}</h2>
      <Tooltip content={nextDue.date} placement="bottom" color="success">
          {getTimeDiffInDays(nextDue.date)}
      </Tooltip>
    </Card>
  </Grid>
  ) : null

  const fetchData = async () => {
    console.log("fetching data");
    const response = await fetch(`api/get/`);
    let data = await response.json();
    console.log("Got data:", data);
  
    // filter out deleted items
    data = data.filter((ele) => (ele.deleted === null) || (ele.deleted === 0));

    // set init values
    setOrigData(data);
    setRows(data);
    setNextDue(CalculateNextDue(data));
  }

  return (
    <div>
      <Head>
        <title>FoodTracker</title>
        <meta name="description" content="FoodTracker" />
        <link rel="icon" href="/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1"/>
      </Head>
      <Container>
        <Container>
        <Spacer />
          <Text h2>FoodTracker</Text>
        </Container>

        <MakeNewModal 
          isModalVisible={isModalVisible} 
          setModalVisible={setIsModalVisible} 
          setRows={setRows}
          setOrigData={setOrigData}
          origData={origData}
          setForm={setForm}
          form={form}
          isOpened={isOpened}
        />

        <Grid.Container gap={2} justify="center" direction='column'>
          
          {renderNextDue}

          <Grid.Container direction="row" gap={2} justify="center">
            <Grid>
              <Button color="success" auto ghost >
                <FaQrcode style={{ marginRight:"5px"}} />Scan
              </Button>
            </Grid>
            <Grid>
              <Button color="success" auto 
                onPress={(e) => {
                  setIsModalVisible(true); 
                  setIsOpened(false); clearForm()
                }} >
                <FaPlusSquare style={{ marginRight:"5px"}} /> Add
              </Button>
            </Grid>
          </Grid.Container>

        </Grid.Container>

      </Container>

      <TableSection 
        setForm={setForm} setModal={setIsModalVisible} 
        data={origData} rows={rows} 
        setRows={setRows} setIsOpened={setIsOpened}
      />
    </div>
  )
}

export default Home;