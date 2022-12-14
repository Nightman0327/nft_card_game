import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { CustomButton, CustomInput, PageHOC } from '../components';
import { useGlobalContext } from '../context';

const Home = () => {
  const { contract, metamaskAccount, gameData, playerCreated, setPlayerCreated, setShowAlert, setErrorMessage } = useGlobalContext();
  const [playerName, setPlayerName] = useState('');
  const navigate = useNavigate();

  const handleClick = async () => {
    try {
      const playerExists = await contract.isPlayer(metamaskAccount);

      if (!playerExists) {

        const _register = await contract.registerPlayer(playerName, playerName, {
          gasLimit: 500000,
        });
        await _register.wait();
        setShowAlert({ status: true, type: 'info', message: `${playerName} is being summoned!` });
      } else {
        setPlayerCreated(true);
      }
    } catch (error) {
      setErrorMessage(error);
    }
  };

  useEffect(() => {
    const createPlayerToken = async () => {
      const playerExists = await contract.isPlayer(metamaskAccount);
      const playerTokenExists = await contract.isPlayerToken(metamaskAccount);
      if ((playerCreated || playerExists) && playerTokenExists) {
        navigate('/create-battle');
      }
    };

    if (contract) createPlayerToken();
  }, [contract, playerCreated]);

  useEffect(() => {
    if (gameData.playerActiveBattle) {
      navigate(`/battle/${gameData.playerActiveBattle.name}`);
    }
  }, [gameData]);

  return (
    <div>
      {metamaskAccount && (
        <div className="flex flex-col">
          <CustomInput
            label="Name"
            placeHolder="Enter your player name"
            value={playerName}
            handleValueChange={setPlayerName}
          />

          <CustomButton
            title="Register"
            handleClick={handleClick}
            restStyles="mt-6"
          />
        </div>
      )}
    </div>
  );
};

export default PageHOC(
  Home,
  <>Welcome to Avax Gods <br /> a Web3 NFT Card Game</>,
  <>Connect your Metamask wallet to start playing <br /> the ultimate Web3 Battle Card Game</>,
);
