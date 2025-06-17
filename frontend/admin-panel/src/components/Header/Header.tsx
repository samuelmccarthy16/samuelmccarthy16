import {type FC, useState} from "react";
import {LoginModal} from "../LoginModal/LoginModal.tsx";

import styles from './Header.module.scss';

type TProps = {
  onLogin: () => void;
  onTabChange: (tab: string) => void;
  showTabs: boolean;
}

export const Header: FC<TProps> = ({ onLogin, onTabChange, showTabs }) => {
  const [isModalOpen, setModalOpen] = useState(false);
  const handleLogin = () => {
    //setRefetchTrigger(refetchTrigger + 1);
    localStorage.setItem('loggedin', 'true');
    setModalOpen(true);
  }

  const authBtnText = localStorage.getItem('loggedin') ? 'Logout' : 'Login';
  return (
    <div className={styles.wrapper}>
      <span className={styles.name}>Mccarthy's Mirth & Meals admin panel</span>
      <button className={styles.loginbtn} onClick={handleLogin}>{authBtnText}</button>
      {showTabs && (
        <nav className={styles.nav}>
          <button onClick={() => {
            onTabChange('orders');
          }}>
            Orders
          </button>
          <button onClick={() => {
            onTabChange('menu');
          }}>
            Menu
          </button>
        </nav>
      )}
      {isModalOpen && <LoginModal
        onLogin={() => {
          setModalOpen(false);
          //setAuthBtnText('Logout');
          onLogin();
        }}
        onRequestClose={() => {
          setModalOpen(false);
        }}
      />}
    </div>
  )
}
