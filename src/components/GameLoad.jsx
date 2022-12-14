import React from 'react';
import { useNavigate } from 'react-router-dom';

import styles from '../styles';
import CustomButton from './CustomButton';
import { useGlobalContext } from '../context';
import { player01, player02 } from '../assets';

const GameLoad = () => {
  const navigate = useNavigate();
  const { metamaskAccount } = useGlobalContext();

  return (
    <div className={`${styles.flexBetween} ${styles.gameLoadContainer}`}>
      <div className={styles.gameLoadBtnBox}>
        <CustomButton
          title="Choose Battleground"
          handleClick={() => navigate('/battleground')}
          restStyles="mt-6"
        />
      </div>

      <div className={`flex-1 ${styles.flexCenter} flex-col`}>
        <h1 className={styles.headText}>Waiting for a worthy opponent...</h1>
        <p className={styles.gameLoadText}>Protip: while you're waiting, choose your preferred battleground</p>

        <div className={styles.gameLoadPlayersBox}>
          <div className={`${styles.flexCenter} flex-col`}>
            <img src={player01} className={styles.gameLoadPlayerImg} />
            <p className={styles.gameLoadPlayerText}>{metamaskAccount.slice(0, 30)}</p>
          </div>

          <h2 className={styles.gameLoadVS}>
            <span className="text-8xl">VS</span>
          </h2>

          <div className={`${styles.flexCenter} flex-col`}>
            <img src={player02} className={styles.gameLoadPlayerImg} />
            <p className={styles.gameLoadPlayerText}>???</p>
          </div>
        </div>
      </div>

    </div>
  );
};

export default GameLoad;
