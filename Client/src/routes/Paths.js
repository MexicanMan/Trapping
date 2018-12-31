export const AUTH = "/auth";
export const REGISTER = "/register";
export const REGISTER_CONFIRM = "/register/conf";
export const LOBBIES = "/lobbies";
export const NEW_LOBBY = "/new_lobby";
export const LOBBY = "/lobby/:id";
export const GAME ="/game";

export function concreteLobby(id) {
    return `/lobby/${id}`;
}