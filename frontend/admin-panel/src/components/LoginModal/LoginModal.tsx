import {useRef, type FC } from "react";

import styles from "./LoginModal.module.scss";

type TProps = {
  onLogin: () => void;
  onRequestClose: () => void;
}

export const LoginModal: FC<TProps>  = ({ onLogin, onRequestClose }) => {
  const loginRef = useRef<HTMLInputElement>(null);
  const pwdRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async () => {
    if (!loginRef.current?.value || !pwdRef.current?.value) {
      alert('Enter login and password');
      return;
    }
    // @ts-ignore
    const response = await fetch(import.meta.env.VITE_API_URL + "/user/login", {
      method: "POST",
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json', // Or other content type
      },
      body: JSON.stringify({
        login: loginRef.current.value,
        password: pwdRef.current.value,
      }),
    });

    if (!response.ok) {
      throw new Error(response.statusText);
    }

    onLogin();
  }

  return (
    <dialog className={styles.dialog}>
      <button className={styles.closeBtn} onClick={onRequestClose}>X</button>
      <div>
        <label htmlFor="login">Login</label>
        <input ref={loginRef} type="text" id="login" name="login"/>
      </div>
      <div>
        <label htmlFor="pwd">Password</label>
        <input ref={pwdRef} type="password" id="pwd" name="pwd"/>
      </div>
      <button onClick={handleSubmit}>Login</button>
    </dialog>
  )
}
