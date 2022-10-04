import React, { useEffect, useState } from 'react';

import { useParams, useNavigate } from 'react-router-dom';

import styles from '../styles';
import { Alert, Card, GameLoad, PlayerInfo } from '../components';
import { useGlobalContext } from '../context';
import { attack, defense, player01 as player01Icon, player02 as player02Icon } from '../assets';

const Game = () => {
  const { contract, gameData, battleGround, metamaskAccount, setErrorMessage, showAlert, setShowAlert, waitBattle, setWaitBattle } = useGlobalContext();
  const [player2, setPlayer2] = useState({ });
  const [player1, setPlayer1] = useState({ });
  const { battleName } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const getBattleResults = async () => {
      try {
        await contract.awaitBattleResults(battleName);
        setShowAlert({ status: true, type: 'info', msg: 'Awaiting round results' });
      } catch (error) {
        setErrorMessage(error);
      }
    };

    if (gameData.playerActiveBattle?.moves[0] && gameData.playerActiveBattle?.moves[1]) {
      getBattleResults();
    }

    // if (gameData?.playerActiveBattle?.winner) {
    //   alert(gameData?.playerActiveBattle?.winner === metamaskAccount.toLowerCase() ? 'You won!' : 'You lost!');
    // }
  }, [gameData?.playerActiveBattle]);

  useEffect(() => {
    const getPlayerInfo = async () => {
      try {
        let player01Address = null;
        let player02Address = null;

        if (gameData.playerActiveBattle.players[0].toLowerCase() === metamaskAccount.toLowerCase()) {
          player01Address = gameData.playerActiveBattle.players[0];
          player02Address = gameData.playerActiveBattle.players[1];
        } else {
          player01Address = gameData.playerActiveBattle.players[1];
          player02Address = gameData.playerActiveBattle.players[0];
        }

        console.log(player01Address, player02Address);

        const p1TokenData = await contract.getPlayerToken(player01Address);
        const p2TokenData = await contract.getPlayerToken(player02Address);
        const player01 = await contract.getPlayer(player01Address);
        const player02 = await contract.getPlayer(player02Address);

        // TODO: Players attack and defense values are changing. They seem to be incorrect
        const p1Att = p1TokenData.attackStrength.toNumber();
        const p1Def = p1TokenData.defenseStrength.toNumber();
        const p2Att = p2TokenData.attackStrength.toNumber();
        const p2Def = p2TokenData.defenseStrength.toNumber();
        const p1H = player01.playerHealth.toNumber();
        const p1M = player01.playerMana.toNumber();
        const p2H = player02.playerHealth.toNumber();
        const p2M = player02.playerMana.toNumber();

        console.log('P1 ATT:', p1Att, 'P1 DEF:', p1Def, 'P1 H:', p1H, 'P1 M:', p1M);
        console.log('P2 ATT:', p2Att, 'P2 DEF:', p2Def, 'P2 H:', p2H, 'P2 M:', p2M);

        setPlayer1({ ...player01, att: p1Att, def: p1Def, health: p1H, mana: p1M });
        setPlayer2({ ...player02, att: 'X', def: 'X', health: p2H, mana: p2M });
      } catch (error) {
        setErrorMessage(error.message);
        console.log(error);

        setWaitBattle(true);
      }
    };

    if (contract && gameData.playerActiveBattle) getPlayerInfo();
    if (!gameData.playerActiveBattle) navigate('/create-battle');
  }, [contract, gameData, battleName]);

  const makeAMove = async (choice) => {
    try {
      await contract.attackOrDefendChoice(choice, battleName);
      setShowAlert({ status: true, type: 'info', msg: `Initiating ${choice === 1 ? 'attack' : 'defense'} move` });
      setWaitBattle(true);
    } catch (error) {
      setErrorMessage(error);
    }
  };

  return (
    <div className={`${styles.gameContainer} ${battleGround} bg-cover bg-no-repeat bg-center flex justify-between items-center flex-col`}>
      {waitBattle && <GameLoad waitingForOpponent />}

      {showAlert?.status && <Alert type={showAlert.type} msg={showAlert.msg} />}

      <PlayerInfo player={player2} playerIcon={player02Icon} mt />

      <div className={`${styles.flexCenter} flex-col my-10`}>
        <div className="flex flex-row items-center">
          <Card card={player2} title={player2?.playerName} playerTwo />
        </div>

        <div className="flex flex-row items-center">
          <div className={`sm:w-20 w-14 sm:h-20 h-14 rounded-full mr-2 cursor-pointer ${styles.flexCenter} ${styles.glassEffect} border-[2px] hover:border-yellow-400`} onClick={() => makeAMove(1)}>
            <img src={attack} alt="attack" className="w-1/2 h-1/w-1/2 object-contain" />
          </div>
          <Card card={player1} title={player1?.playerName} restStyles="mt-3" />
          <div className={`sm:w-20 w-14 sm:h-20 h-14 rounded-full ml-6 cursor-pointer ${styles.flexCenter} ${styles.glassEffect} border-[2px] hover:border-red-600`} onClick={() => makeAMove(2)}>
            <img src={defense} alt="defense" className="w-1/2 h-1/w-1/2 object-contain" />
          </div>
        </div>
      </div>

      <PlayerInfo player={player1} playerIcon={player01Icon} />
    </div>
  );
};

export default Game;
