const axios = require('axios');
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
require('dotenv').config();
const batTemplate = require('./batTemplate');


const apiKey = process.env.API_KEY;


async function getSummonerByName(summonerName) {
  try {
    const response = await axios.get(
      `https://euw1.api.riotgames.com/lol/summoner/v4/summoners/by-name/${encodeURIComponent(summonerName)}`,
      {
        headers: {
          'X-Riot-Token': apiKey,
        },
      }
    );
    console.log("Summoner Data: \n", response.data);
    return response.data;
  } catch (error) {
    console.log(error.response.status);
    throw new Error('Error retrieving summoner data');
  }
}

async function getCurrentGame(summonerId) {
  try {
    const response = await axios.get(
      `https://euw1.api.riotgames.com/lol/spectator/v4/active-games/by-summoner/${summonerId}`,
      {
        headers: {
          'X-Riot-Token': apiKey,
        },
      }
    );
    console.log("Current game data: \n",response.data);
    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 404) {
      // No active game found
      return null;
    }
    console.log(error.response.status);
    throw new Error('Error retrieving current game data');
  }
}

function launchSpectatorMode(gameId, platformId, encryptionKey) {
    if (process.platform === 'win32') {
      const appDirectory = __dirname;
      const batFilePath = path.join(appDirectory, 'launchSpectator.bat');
      const batContent = batTemplate(gameId, platformId, encryptionKey);
  
      fs.writeFileSync(batFilePath, batContent);
  
      const batProcess = spawn('cmd.exe', ['/c', batFilePath], {
        detached: true,
        stdio: 'ignore',
        windowsHide: true,
      });
  
      batProcess.unref();
    } else {
      console.log('Spectator mode launch not supported on this platform.');
    }
  }
  


async function main() {

  const summonerName = process.argv[2];

  try {
    const summoner = await getSummonerByName(summonerName);
    console.log(`Summoner name: ${summoner.name}`);
    console.log(`Summoner id: ${summoner.id}`);
    const currentGame = await getCurrentGame(summoner.id);

    if (currentGame) {
      launchSpectatorMode(currentGame.gameId, currentGame.platformId, currentGame.observers.encryptionKey);
    } else {
      console.log('The summoner is not currently in a live game.');
    }
  } catch (error) {
    console.error(error.message);
  }
}

main();
