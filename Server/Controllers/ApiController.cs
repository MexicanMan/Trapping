using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Server.Errors;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using ProjectAstolfo;
using ProjectAstolfo.Json;
using ProjectAstolfo.Model;

namespace Server.Controllers
{
    [Route("/api/auth")]
    public class AuthController : Controller
    {
        private DBConnectionManager dbManager = new SqliteConnectionManager();

        // POST
        [HttpPost]
        public IActionResult Post([FromBody] Auth parameters)
        {
            if (parameters == null || parameters.authParam == null || parameters.authParam.email == null ||
                parameters.authParam.password == null)
            {
                return BadRequest(new Response("Wrong parameters", null));
            }

            string error = "";
            string email = parameters.authParam.email;
            string password = parameters.authParam.password;
            TokenResponse tr = dbManager.CheckUser(email, password);
            int id = Int32.Parse(tr.token);
            string username = tr.nickname;
            if(id == -1)
            {
                error += ErrorTypes.AUTH_ERROR.ToString();
            }

            Response resp;
            if(error == "")
            {
                string token = "";
                if (!TokenManager.CheckUser(Hash.HashId(id)))
                {
                    token = TokenManager.RegisterUserToken(id, username);
                }
                else
                {
                    token = Hash.HashId(id);
                }
                TokenResponse tokenResp = new TokenResponse(token, username);
                resp = new Response(error, tokenResp);
            }
            else
            {
                resp = new Response(error, null);
            }
            
            IActionResult res = Ok(resp);
            return res;
        }
    }

    [Route("/api/reg")]
    public class RegisterController : Controller
    {
        private DBConnectionManager dbManager = new SqliteConnectionManager();

        // POST
        [HttpPost]
        public IActionResult Post([FromBody] Register parameters)
        {
            if (parameters == null || parameters.registerParam == null || parameters.registerParam.email == null ||
               parameters.registerParam.password == null || parameters.registerParam.username == null)
            {
                return BadRequest(new Response("Wrong parameters", null));
            }

            string username = parameters.registerParam.username;
            string email = parameters.registerParam.email;
            string password = parameters.registerParam.password;
            string error = "";
            if (dbManager.CheckEmail(email))
            {
                error = ErrorTypes.ALREADY_REG_EMAIL_ERROR.ToString();
            }
            if (dbManager.CheckUsername(username))
            {
                error = ErrorTypes.ALREADY_REG_NAME_ERROR.ToString();
            }

            int id = -1;
            Response resp; 
            if (error == "")
            {
                id = dbManager.RegisterUser(username, email, password);
                string token = TokenManager.RegisterUserToken(id, username);
                TokenResponse tokenResp = new TokenResponse(token, username);
                resp = new Response(error, tokenResp);
            }
            else
            {
                resp = new Response(error, null);
            }

            IActionResult res = Ok(resp);
            return res;
        }

        private bool IsEmailInBase(string email)
        {
            return dbManager.CheckEmail(email);
        }

        private bool IsUserNameInBase(string username)
        {
            return dbManager.CheckUsername(username);
        }
    }

    [Route("/api/lobbies")]
    public class LobbiesController : Controller
    {
        // POST
        [HttpPost]
        public IActionResult Post([FromBody] TokenRequest parameters)
        {
            if (parameters == null || parameters.token == null)
            {
                return BadRequest(new Response("Wrong parameters", null));
            }

            string token = parameters.token;
            string error = "";
            if(!TokenManager.CheckUser(token))
            {
                error = ErrorTypes.UNAUTH_USER_ERROR.ToString();
            }

            Response resp;
            if (error == "")
            {
                LobbiesResponse lobbiesResp = Lobbies.getLobbiesResponse();
                resp = new Response(error, lobbiesResp);
            }
            else
            {
                resp = new Response(error, null);
            }

            IActionResult res = Ok(resp);
            return res;
        }
    }

    [Route("/api/new_lobby")]
    public class NewLobbyController : Controller
    {
        // POST
        [HttpPost]
        public IActionResult Post([FromBody] NewLobbyRequest parameters)
        {
            if (parameters == null || parameters.token == null)
            {
                return BadRequest(new Response("Wrong parameters", null));
            }

            string token = parameters.token;
            string error = "";
            if (!TokenManager.CheckUser(token))
            {
                error = ErrorTypes.UNAUTH_USER_ERROR.ToString();
            }

            Response resp; 
            if (error == "") 
            {
                Lobby newLobby = new Lobby(parameters.lobbyName);
                Lobbies.AddLobby(newLobby);
                int id = newLobby.Id;
                resp = new Response(error, new NewLobbyResponse(id));
            }
            else
            {
                resp = new Response(error, null);
            }

            IActionResult res = Ok(resp);
            return res;
        }
    }

    [Route("/api/lobby/{id}")]
    public class LobbyController : Controller
    {
        // POST
        [HttpPost]
        public IActionResult Post([FromBody] LobbyRequest parameters, [FromRoute] int id)
        {
            if (parameters == null || parameters.token == null)
            {
                return BadRequest(new Response("Wrong parameters", null));
            }

            string token = parameters.token;
            string error = "";
            if (!TokenManager.CheckUser(token))
            {
                error = ErrorTypes.UNAUTH_USER_ERROR.ToString();
            }

            Response resp;
            if (error == "")
            {
                Lobby curLobby = Lobbies.GetLobby(id);
                Player p = TokenManager.GetPlayer(token);
                if (curLobby == null)
                {
                    error = ErrorTypes.NONEXIST_LOBBY_ERROR.ToString();
                    resp = new Response(error, null);
                }
                else if (curLobby.GetPlayer(token) != null)
                {
                    error = ErrorTypes.ALREADY_CONNECT_TO_LOBBY_ERROR.ToString();
                    resp = new Response(error, null);
                }
                else if(p.Status != PlayerStatus.Default)
                {
                    error = ErrorTypes.ALREADY_CONNECT_TO_DIFF_LOBBY_ERROR.ToString();
                    resp = new Response(error, null);
                }
                else if(curLobby.Status != LobbyStatus.WaitingForPlayer)
                {
                    error = ErrorTypes.FULL_LOBBY_ERROR.ToString();
                    resp = new Response(error, null);
                }
                else
                {
                    curLobby.ConnectPlayer(p);
                    resp = new Response(error, new LobbyResponse(curLobby));
                }
            }
            else
            {
                resp = new Response(error, null);
            }

            IActionResult res = Ok(resp);
            return res;
        }
    }
}
