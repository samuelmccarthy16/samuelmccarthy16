import { useEffect, useState } from 'react'
import './App.css'
import {Header} from "./components/Header/Header.tsx";
import {usePrevious} from "./utils/hooks.ts";
import type {TOrder} from "./types.ts";
import {Orders} from "./components/Orders/Orders.tsx";

import styles from "./App.module.scss";
import {Menu} from "./components/Menu/Menu.tsx";

function App() {
  const [tab, setTab] = useState('orders');

  const [refetchTrigger, setRefetchTrigger] = useState(0);
  const prevTrigger = usePrevious(refetchTrigger);

  const [orders, setOrders] = useState<TOrder[]>();
  const [fetchErrorCode, setFetchErrorCode] = useState<number>();
  useEffect(() => {
    console.log('>>> orders', orders);
  }, [orders]);

  useEffect(() => {
    const fetchData = async (url: string) => {
      const response = await fetch(url, {
        method: 'GET',
        credentials: 'include',
      });
      if (!response.ok) {
        setFetchErrorCode(response.status);
        return;
      }
      response.json().then(data => {
        setOrders(data);
        setFetchErrorCode(undefined);
      }).catch(e => {
        console.error('>>> err', e);
      });
    };

    if (prevTrigger !== refetchTrigger) {
      void fetchData(`${import.meta.env.VITE_API_URL}/orders`);
    }
  }, [prevTrigger, refetchTrigger]);

  return (
    <div className={styles.app}>
      <Header
        onLogin={() => {
          console.log('>>> success');
          setRefetchTrigger(refetchTrigger + 1);
        }}
        onTabChange={(tab) => {
          setTab(tab);
        }}
        showTabs={!fetchErrorCode}
      />
      {fetchErrorCode === 401 && (
        <p>Please login first</p>
      )}
      {tab === 'orders' && (
        <Orders data={orders} />
      )}
      {tab === 'menu' && (
        <Menu />
      )}
    </div>
  )
}

export default App
