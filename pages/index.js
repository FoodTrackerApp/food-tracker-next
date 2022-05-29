import Head from 'next/head'
import { Container, Card, Tooltip, Button, Grid, Spacer} from "@nextui-org/react";
import { FaQrcode, FaPlusSquare } from "react-icons/fa";
import { useState } from "react";

import TableSection from '../components/TableSection.js';
import MakeNewModal from '../components/MakeNewModal.js';

import host from '../constants/host.js';

const Home = ({ data }) => {
  const [nextDue, setNextDue] = useState(data[0])
  const [origData, setOrigData] = useState(data)
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [rows, setRows] = useState(origData)
  const [form, setForm] = useState({name: "", count: "", date: "", group: ""});
  const [isOpened, setIsOpened] = useState(false);

  const getTimeDiffInDays = (date) => {
    const now = new Date()
    const dueDate = new Date(date)
    const timeDiff = dueDate.getTime() - now.getTime()
    const diffDays = Math.floor(timeDiff / (1000 * 3600 * 24))
    if(diffDays > 0) {
      return (
        <Button flat color="success">
          {`In ${diffDays} days`}
        </Button>
      )
    } else {
      return (
        <Button flat color="warning">
          {`Overdue since ${Math.abs(diffDays)} days`}
        </Button>
      )
    }
  }

  const clearForm = () => {
    setForm({name: "", count: "", date: "", group: ""});
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
          <h1>FoodTracker</h1>
        </Container>

        <MakeNewModal 
          isModalVisible={isModalVisible} 
          setModalVisible={setIsModalVisible} 
          setRows={setRows}
          setOrigData={setOrigData}
          setForm={setForm}
          form={form}
          isOpened={isOpened}
        />

        <Grid.Container gap={2} justify="center" direction='column'>
          
          <Grid>
            <Card>
              <span>Next due</span>
              <h2>{nextDue.name}</h2>
              <Tooltip content="11.02.2022" placement="bottom" color="success">
                  {getTimeDiffInDays(nextDue.date)}
              </Tooltip>
            </Card>
          </Grid>

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
    if(date.getMonth() < 10) {
        return `0${date.getMonth()}`
    } else { return date.getMonth() }
  }

  const dateDay = (date) => {
    if(date.getDay() < 10) {
        return `0${date.getDay()}`
    } else { return date.getDay() }
  }
  
  // Map Date to normal Data format
  data.forEach(element => {
    let date = new Date(element.date)
    element.date = `${dateDay(date)}.${dateMonth(date)}.${date.getFullYear()}`
  });

  return {props: {data}};
}

export default Home;