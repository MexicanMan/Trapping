using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Text;

using WebSocketSharp;
using WebSocketSharp.Server;

namespace ProjectAstolfo.Model
{
    public class Listener : WebSocketBehavior
    {
        protected override void OnMessage(MessageEventArgs e)
        {
            string msg = e.Data;
            Console.WriteLine("Client sent \n\tMessage : "+msg);
            //if (this.State == WebSocketState.Open)
               //Send("Клиент прислал сообщение: " + msg);
            var wsContext = this.Context;
            WSRequest wsr = JsonConvert.DeserializeObject<WSRequest>(msg);
            if(!Router.ProcessRequest(wsContext, wsr.token, wsr.type, wsr.payload))
            {
                try
                {
                    Send(JsonConvert.SerializeObject(new WSResponse("Что-то пошло не так.", "ERROR", null)));
                }
                catch(Exception ex)
                {
                    Console.WriteLine("Error - " + ex.Message);
                }
            }
        }

        protected override void OnOpen()
        {
            Console.WriteLine("Opened");
            //if (this.State == WebSocketState.Open)
                //Send("Клиент подключился.");
        }

        protected override void OnClose(CloseEventArgs e)
        {
            Console.WriteLine("Умер");
        }

        protected override void OnError(ErrorEventArgs e)
        {
            Console.WriteLine("Client has disconnected!");
        }
    }
}
