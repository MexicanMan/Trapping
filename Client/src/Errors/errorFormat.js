import * as errorTypes from './errorTypes.js';

export function fromTypeToText(type) {
    switch(type) {
        case errorTypes.AUTH_ERROR:
            return "Authentication error!";
        case errorTypes.ALREADY_REG_EMAIL_ERROR:
            return "This email have been already registered!";
        case errorTypes.ALREADY_REG_NAME_ERROR:
            return "This username have been already registered!";
        case errorTypes.UNAUTH_USER_ERROR:
            return "Unauthorized user!";
        case errorTypes.NONEXIST_LOBBY_ERROR:
            return "This lobby does not exist!";
        case errorTypes.ALREADY_CONNECT_TO_LOBBY_ERROR:
            return "You have been already connected to this lobby!";
        case errorTypes.ALREADY_CONNECT_TO_DIFF_LOBBY_ERROR:
            return "You are connected to another lobby!";
        case errorTypes.FULL_LOBBY_ERROR:
            return "Lobby is full!";
    }
}