import Head from 'next/head'
import { Container, Card, Tooltip, Button, Grid } from "@nextui-org/react";
import { FaPlusSquare } from "react-icons/fa";
import { useState, useEffect } from "react";


import TableSection from '@/components/TableSection';
import MakeNewModal from '@/components/MakeNewModal';
import CustomNavbar from '@/components/CustomNavbar';
import NextDue from '@/components/NextDue';

import CalculateNextDue from '@/functions/CalculateNextDue';
import { getSupabaseClient, _DATABASE_NAME_ITEMS } from '@/functions/SupabaseClient';
import { SyncItems } from '@/functions/Sync';

// Interfaces
import Iitem from '../interfaces/Iitem';
import ISettings from '@/interfaces/ISettings';

const Home = ({ }) => {

  const [origData, setOrigData] = useState<Array<Iitem>>([]);
  const [rows, setRows] = useState<Array<Iitem>>([]);
  const [cleanData, setCleanData] = useState<Array<Iitem>>([]);

  const [nextDue, setNextDue] = useState<Iitem>({} as Iitem);
  const [form, setForm] = useState<Iitem>({} as Iitem);

  const [isOpened, setIsOpened] = useState<Boolean>(false);
  const [isModalVisible, setIsModalVisible] = useState<Boolean>(false);

  const [settings, setSettings] = useState<ISettings>({} as ISettings);

  const [isOnline, setIsOnline] = useState<boolean>(false);

  const handleClick = (key : any) => {
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
    console.log("OrigData changed")
    if(origData?.length && origData.length > 0) {
      const dataNoDeleted = origData.filter((ele : Iitem) => (ele.deleted === false));
      setNextDue(CalculateNextDue(dataNoDeleted));
    }
  }, [setNextDue, origData]);

  // fetch data on load
  useEffect(() => {
    if(window !== undefined) {
      sync()
    }
  }, []);

  const sync = () => {
    SyncItems({ settings, setSettings, origData, setOrigData, setRows, setNextDue, setIsOnline, setCleanData});
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
          setCleanData={setCleanData}
        />

        <Grid.Container gap={2} justify="center" direction='column'>
          
          { cleanData?.length && cleanData.length > 0 ? (<NextDue nextDue={nextDue} handleClick={handleClick} />) : null }

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
        data={cleanData} rows={rows} 
        setRows={setRows} setIsOpened={setIsOpened}
      />
    </div>
  )
}

export default Home;