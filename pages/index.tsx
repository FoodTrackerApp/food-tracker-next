import Head from 'next/head'
import { Container, Card, Tooltip, Button, Grid, Spacer, Text, Navbar } from "@nextui-org/react";
import { FaQrcode, FaPlusSquare, FaShoppingBag, FaHome, FaList, FaDatabase } from "react-icons/fa";
import { useState, useEffect } from "react";
import TableSection from '../components/TableSection';
import MakeNewModal from '../components/MakeNewModal';
import CalculateNextDue from '../functions/CalculateNextDue';
import CustomNavbar from '@/components/CustomNavbar';

// Interfaces
import Iitem from '../interfaces/Iitem';

const Home = ({ }) => {

  const [origData, setOrigData] = useState<Array<Iitem>>([]);
  const [rows, setRows] = useState<Array<Iitem>>([]);

  const [nextDue, setNextDue] = useState<Iitem>({} as Iitem);
  const [form, setForm] = useState<Iitem>({} as Iitem);

  const [isOpened, setIsOpened] = useState<Boolean>(false);
  const [isModalVisible, setIsModalVisible] = useState<Boolean>(false);

  const getTimeDiffInDays = (date : number) => {
    const now = new Date().getTime();

    const dueDate = date;
    const timeDiff = dueDate - now;
    const diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
    const days = Math.abs(diffDays);
    const mod = days === 1 ? "day" : "days";

    if(diffDays > 10000) {
      return (
        <Button onClick={() => handleClick(nextDue?._id)} flat color="success">
          Has no due date
        </Button>
      )
    }
    if(diffDays > 0) {
      return (
        <Button onClick={() => handleClick(nextDue?._id)} flat color="success">
          {`In ${diffDays} ${mod}`}
        </Button>
      )
    } else if(diffDays === 0) {
      // due today
      return (
        <Button onClick={() => handleClick(nextDue?._id)} flat color="warning">
          {`Due today`}
        </Button>
      )
    } else {
      return (
        <Button onClick={() => handleClick(nextDue?._id)} flat color="warning">
          {`Overdue since ${days} ${mod}`}
        </Button>
      )
    }
  }

  const handleClick = (key : any) => {
    console.log(key)
    let element = origData?.find((ele : Iitem) => ele._id == key);
    if(element === undefined) {
      console.log("Element not found");
      element = {} as Iitem;
    }

    setForm({...element});
    setIsOpened(true);
    setIsModalVisible(true);
  }

  const clearForm = () => {
    setForm({} as Iitem);
    console.log("new form:", form);
  }

  // Refresh next due data on origData change
  useEffect(() => {
    if(origData?.length && origData.length > 0) {
      setNextDue(CalculateNextDue(origData));
    }
  }, [setNextDue, origData]);

  // fetch data on load
  useEffect(() => {
    fetchData();
  }, []);

  const renderNextDue = origData?.length && origData.length > 0 ? (
    <Grid>
    <Card>
      <Card.Body>
        <span>Next due</span>
        <h2>{nextDue?.name}</h2>
        <Tooltip content={nextDue?.date} placement="bottom" color="success">
            {getTimeDiffInDays(parseInt(nextDue?.date ? nextDue.date : "0"))}
        </Tooltip>
      </Card.Body>
    </Card>
  </Grid>
  ) : null

  const fetchData = async () => {
    console.log("fetching data");
    const response = await fetch(`api/get/`);
    let data = await response.json();
    console.log("Got data:", data);
  
    // filter out deleted items
    data = data.filter((ele : Iitem) => (ele.deleted === null));

    if(data.length > 0) {
    
    // set init values
    setOrigData(data);
    setRows(data);
    setNextDue(CalculateNextDue(data));
    } else {
      setOrigData([]);
      setRows([]);
    }
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
        <CustomNavbar current="Home" />

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