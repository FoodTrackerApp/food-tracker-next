import Head from 'next/head'
import { Container, Card, Tooltip, Button, Grid } from "@nextui-org/react";
import { FaPlusSquare } from "react-icons/fa";
import { useState, useEffect } from "react";
import TableSection from '../components/TableSection';
import MakeNewModal from '../components/MakeNewModal';
import CalculateNextDue from '../functions/CalculateNextDue';
import { getSupabaseClient, _DATABASE_NAME_ITEMS } from '@/functions/SupabaseClient';
import CustomNavbar from '@/components/CustomNavbar';

// Interfaces
import Iitem from '../interfaces/Iitem';
import ISettings from '@/interfaces/ISettings';

const Home = ({ }) => {

  const [origData, setOrigData] = useState<Array<Iitem>>([]);
  const [rows, setRows] = useState<Array<Iitem>>([]);

  const [nextDue, setNextDue] = useState<Iitem>({} as Iitem);
  const [form, setForm] = useState<Iitem>({} as Iitem);

  const [isOpened, setIsOpened] = useState<Boolean>(false);
  const [isModalVisible, setIsModalVisible] = useState<Boolean>(false);

  const [settings, setSettings] = useState<ISettings>({} as ISettings);

  const [isOnline, setIsOnline] = useState<boolean>(false);

  const getTimeDiffInDays = (date : number) => {
    const now = new Date().getTime();

    const dueDate = date;
    const timeDiff = dueDate - now;
    const diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
    const days = Math.abs(diffDays);
    const mod = days === 1 ? "day" : "days";

    if(diffDays > 10000) {
      return (
        <Button onClick={() => handleClick(nextDue?.id)} flat color="success">
          Has no due date
        </Button>
      )
    }
    if(diffDays > 0) {
      return (
        <Button onClick={() => handleClick(nextDue?.id)} flat color="success">
          {`In ${diffDays} ${mod}`}
        </Button>
      )
    } else if(diffDays === 0) {
      // due today
      return (
        <Button onClick={() => handleClick(nextDue?.id)} flat color="warning">
          {`Due today`}
        </Button>
      )
    } else {
      return (
        <Button onClick={() => handleClick(nextDue?.id)} flat color="warning">
          {`Overdue since ${days} ${mod}`}
        </Button>
      )
    }
  }

  const handleClick = (key : any) => {
    console.log(key)
    let element = origData?.find((ele : Iitem) => ele.id == key);
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
    if(window !== undefined) {
      sync();
    }
  }, []);

  const renderNextDue = origData?.length && origData.length > 0 ? (
    <Grid>
    <Card>
      <Card.Body>
        <span>Next due</span>
        <h2>{nextDue?.name}</h2>
        <Tooltip content={nextDue?.date} placement="bottom" color="success">
            {getTimeDiffInDays(nextDue?.date ? nextDue.date : 0)}
        </Tooltip>
      </Card.Body>
    </Card>
  </Grid>
  ) : null

  const sync = async () => {
    console.log("Syncing data");

    console.log("Getting settings");
    const settingsResponse = localStorage.getItem("settings");
    if(settingsResponse) {
      setSettings(JSON.parse(settingsResponse));
    } else {
      console.log("No settings found");
      return;
    }

    const supabase = getSupabaseClient(settings.supabaseUrl, settings.supabaseKey);

    if(!supabase) { 
      console.log("No supabase client found");
      setIsOnline(false);
      return;
    }

    console.log("OrigData:" , origData);

    const { data: updatedData, error } = await supabase.from(_DATABASE_NAME_ITEMS).upsert(origData).select()
    console.log("Upserted Data from supabase:", updatedData, error);

    const { data: newItems, error: err } = await supabase.from(_DATABASE_NAME_ITEMS).select('*')
    console.log("new items from supabase:", newItems, err);

    if(newItems) {
      setOrigData(newItems);
      const noDeleted = newItems.filter((ele : Iitem) => (ele.deleted === false));
      setRows(noDeleted);
      setNextDue(CalculateNextDue(newItems));
      setIsOnline(true);
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
        <CustomNavbar current="Home" online={isOnline} />

        <MakeNewModal 
          isModalVisible={isModalVisible} 
          setModalVisible={setIsModalVisible} 
          setRows={setRows}
          setOrigData={setOrigData}
          origData={origData}
          setForm={setForm}
          form={form}
          isOpened={isOpened}
          syncData={sync}
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
              <Button
                auto
                onPress={() => sync()}
              >Refresh</Button>
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