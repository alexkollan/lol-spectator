const axios = require('axios');
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
require('dotenv').config();
const batTemplate = require('./batTemplate');
const { exec } = require('child_process');
const { log } = require('console');
// const command = require('./command');


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
        // console.log("Summoner Data: \n", response.data);
        return response.data;
    } catch (error) {
        console.log(error.response.status);
        throw new Error('Error retrieving summoner data');
    }
}

async function matches(counter, summonerPUUID) {
    try {
        const response = await axios.get(
            `https://europe.api.riotgames.com/lol/match/v5/matches/by-puuid/${summonerPUUID}/ids?start=${counter}&count=100`,
            {
                headers: {
                    'X-Riot-Token': apiKey,
                },
            }
        );
        // console.log("Matches data: \n",response.data);
        return response.data;
    } catch (error) {
        if (error.response && error.response.status === 404) {
            // No active game found
            return null;
        }
        console.log(error.response.status);
        throw new Error('Error retrieving matches');
    }
}


async function account(summonerPUUID) {
    try {
        const response = await axios.get(
            `https://europe.api.riotgames.com/riot/account/v1/accounts/by-puuid/${summonerPUUID}`,
            {
                headers: {
                    'X-Riot-Token': apiKey,
                },
            }
        );
        // console.log("Matches data: \n",response.data);
        return response.data;
    } catch (error) {
        if (error.response && error.response.status === 404) {
            // No active game found
            return null;
        }
        console.log(error.response.status);
        throw new Error('Error retrieving matches');
    }
}


async function main() {

    //   const summonerName = process.argv[2];
    const summonerName = "Dr Von Duelstein";
    let games = [];
    try {
        const summoner = await getSummonerByName(summonerName);
        // await new Promise(resolve => setTimeout(resolve, 2000));
        console.log("Request: ", 1);
        const accountData = await account(summoner.puuid);
        console.log("Account data: \n", accountData);
        // const matchesList = await matches("985", summoner.puuid);
        // matchesList.forEach(match => {
        //     games.push(match);
        // });
        // for (let i = 0; i < 100; i++) {
        //     // set a timeout to do a request every 2 seconds
        //     await new Promise(resolve => setTimeout(resolve, 2000));
        //     console.log("Request: ", i + 2);

        //     const matchesList = await matches((i + 1).toString() + "00", summoner.puuid);
        //     console.log(`?start=${(i + 1).toString() + "00"}&count=100`)
        //     matchesList.forEach(match => {
        //         games.push(match);
        //     });
        // }
        // const matchesList = await matches(summoner.puuid);
        // console.log(`Summoner name: ${summoner.name}`);
        // console.log(`Summoner id: ${summoner.id}`);
        // const currentGame = await getCurrentGame(summoner.id);
        // console.log("Summoner data: \n", summoner);
        // console.log("Matches array: \n", games);
        // console.log("Matches total: \n", games.length);

    } catch (error) {
        console.error(error.message);
    }
}

main();

