import Head from 'next/head'
import { Container, Card, Tooltip, Button, Grid, Spacer} from "@nextui-org/react";
import { FaQrcode, FaPlusSquare } from "react-icons/fa";
import { useState, useEffect } from "react";

import TableSection from '../components/TableSection.js';
import MakeNewModal from '../components/MakeNewModal.js';

import host from '../constants/host.js';

import CalculateNextDue from '../functions/CalculateNextDue.js';

const Home = ({ data }) => {
  // only use data for this, use OrigData from now on
  const [origData, setOrigData] = useState(data)

  const [nextDue, setNextDue] = useState(CalculateNextDue(origData));
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [rows, setRows] = useState(origData)
  const [form, setForm] = useState({name: "", count: "", date: "", group: ""});
  const [isOpened, setIsOpened] = useState(false);

  const getTimeDiffInDays = (date) => {
    const now = new Date().getTime()

    // convert date to YYYY-MM-DD
    const dateString = date.split(".")
    date = new Date(dateString[2], dateString[1]-1, dateString[0])

    const dueDate = new Date(date).getTime()
    const timeDiff = dueDate - now
    const diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24))
    if(diffDays > 0) {
      return (
        <Button flat color="success">
          {`In ${diffDays} days`}
        </Button>
      )
    } else if(diffDays === 0) {
      // due today
      return (
        <Button flat color="warning">
          {`Due today`}
        </Button>
      )
    } else {
      const mod = Math.abs(diffDays) == 1 ? "day" : "days"
      return (
        <Button flat color="warning">
          {`Overdue since ${Math.abs(diffDays)} ${mod}`}
        </Button>
      )
    }
  }

  const clearForm = () => {
    setForm({name: "", count: "", date: "", group: ""});
  }

  // Refresh next due data on origData change
  useEffect(() => {
    setNextDue(CalculateNextDue(origData));
  }, [setNextDue, origData])

  const renderNextDue = data.length > 0 ? (
    <Grid>
    <Card>
      <span>Next due</span>
      <h2>{nextDue.name}</h2>
      <Tooltip content="11.02.2022" placement="bottom" color="success">
          {getTimeDiffInDays(nextDue.date)}
      </Tooltip>
    </Card>
  </Grid>
  ) : null

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
          <h1>FoodTracker</h1>
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

        <TableSection 
          setForm={setForm} setModal={setIsModalVisible} 
          data={origData} rows={rows} 
          setRows={setRows} setIsOpened={setIsOpened}
        />

      </Container>

    </div>
  )
}



export async function getServerSideProps() {
  const res = await fetch(`${host}/api/getItems/none/none`);
  const data = await res.json();

  const dateMonth = (date) => {
    if(parseInt(date.getMonth()+1) < 10) {
        return `0${date.getMonth()+1}`
    } else { return date.getMonth()+1 }
  }

  const dateDay = (date) => {
    if(parseInt(date.getDate()) < 10) {
        return `0${date.getDate()}`
    } else { return date.getDate() }
  }
  
  // Map Date to DD.MM.YYYY
  data.forEach(element => {
    let date = new Date(element.date)
    element.date = `${dateDay(date)}.${dateMonth(date)}.${date.getFullYear()}`
  });

  return {props: {data}};
}

export default Home;