//const serverIP = 'http://192.168.169.223:51510/api/';
//const serverIP = 'http://26.11.117.175:25565/api/';
//const serverIP = 'https://d77a498e-053d-46f2-be0f-153dab38df88.mock.pstmn.io/';
import { apiServerIP } from '../config.js';

class SessionApi { 
    static login(credentials) {
        //console.log(JSON.parse(JSON.stringify({auth: credentials})));
        const request = new Request(`${apiServerIP}auth`, {
            method: 'POST',
            headers: new Headers({
            'Content-Type': 'application/json'
            }),  
            body: JSON.stringify({auth: credentials})
        });
    
        return fetch(request).then(response => {
            return response.json();
        }).catch(error => {
            return error;
        });
    } 

    static register(regData) {
        //console.log(JSON.parse(JSON.stringify({reg: regData})));
        const request = new Request(`${apiServerIP}reg`, {
            method: 'POST',
            headers: new Headers({
            'Content-Type': 'application/json'
            }), 
            body: JSON.stringify({reg: regData})
        });
    
        return fetch(request).then(response => {
            return response.json();
        }).catch(error => {
            return error;
        });
    } 

    static getLobbies() {
        const request = new Request(`${apiServerIP}lobbies`, {
            method: 'POST',
            headers: new Headers({
                'Content-Type': 'application/json'
                }), 
            body: JSON.stringify({token: sessionStorage.token})
        });
    
        return fetch(request).then(response => {
            return response.json();
        }).catch(error => {
            return error;
        });
    } 

    static createNewLobby(lobbyName) {
        const request = new Request(`${apiServerIP}new_lobby`, {
            method: 'POST',
            headers: new Headers({
                'Content-Type': 'application/json'
                }), 
            body: JSON.stringify({token: sessionStorage.token, lobbyName: lobbyName})
        });
    
        return fetch(request).then(response => {
            return response.json();
        }).catch(error => {
            return error;
        });
    } 

    static connectToLobby(lobbyId) {
        const request = new Request(`${apiServerIP}lobby/${lobbyId}`, {
            method: 'POST',
            headers: new Headers({
                'Content-Type': 'application/json'
                }), 
            body: JSON.stringify({token: sessionStorage.token})
        });
    
        return fetch(request).then(response => {
            return response.json();
        }).catch(error => {
            return error;
        });
    } 
}
  
export default SessionApi; 