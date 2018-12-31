using System;
using System.Collections.Generic;
using Server.Model.Util;
using ProjectAstolfo.Model.Game;
using ProjectAstolfo.Model.Util;

namespace ProjectAstolfo.Model
{
    public class GameManager : INotifier
    {
        private Field playField;

        private Dictionary<string, int> PlayersCharacters = new Dictionary<string, int>();

        private INotifier notifier;

        public GameManager(INotifier not)
        {
            notifier = not;
        }
        
        public Field InitializeSimpleGame(string token_1, string nick_1, string token_2, string nick_2)
        {
            playField = FieldGenerator.GenerateSimpleField(this);
            playField.AddCharacter(1, nick_1);
            playField.AddCharacter(2, nick_2);
            PlayersCharacters.Add(token_1, 1);
            PlayersCharacters.Add(token_2, 2);
            playField.PrepareFieldForStart();
            return playField;
        }

        public void StartRun()
        {
            List<Character> chars = playField.CharacterList;
            for(int i = 0; i < chars.Count; i++)
            {
                chars[i].PrepareForRun();
            }
        }

        public bool MoveCharacter(string token, string dir)
        {
            bool ret = false;
            if(!PlayersCharacters.ContainsKey(token))
            {
                ret = false;
            }
            else
            {
                int id = PlayersCharacters[token];
                DiscreteCoordinates coords = new DiscreteCoordinates();
                switch (dir)
                {
                    case "up":
                        {
                            coords = new DiscreteCoordinates(0, -1);
                            break;
                        }
                    case "down":
                        {
                            coords = new DiscreteCoordinates(0, 1);
                            break;
                        }
                    case "left":
                        {
                            coords = new DiscreteCoordinates(-1, 0);
                            break;
                        }
                    case "right":
                        {
                            coords = new DiscreteCoordinates(1, 0);
                            break;
                        }
                    default:
                        {
                            break;
                        }
                }      
                ret = playField.MoveCharacter(id, coords);
            }
            return ret;
        }

        public bool PlaceTrap(string token, string trap, int xpos, int ypos, out bool placed)
        {
            bool ret = false;
            placed = false;
            if (!PlayersCharacters.ContainsKey(token))
            {
                ret = false;
            }
            else
            {
                int id = PlayersCharacters[token];
                Modificator modif = Enum.Parse<Modificator>(trap);
                DiscreteCoordinates coords = new DiscreteCoordinates(xpos, ypos);
                ret = playField.PlaceTrap(id, modif, coords, out placed);
                if(modif == Modificator.Pitfall)
                {
                    ret = false;
                }
            }
            return ret;
        }

        public void KillCharacter(string token)
        {
            if (PlayersCharacters.ContainsKey(token))
            {
                int id = PlayersCharacters[token];
                playField.KillCharacter(id);
            }
        }

        public void NotifyShowTrap(int xpos, int ypos, Modificator modif)
        {
            notifier.NotifyShowTrap(xpos, ypos, modif);
        }

        public void NotifyKillCharacter(string nickname)
        {
            notifier.NotifyKillCharacter(nickname);
        }

        public void NotifyFinish(string nickname)
        {
            notifier.NotifyFinish(nickname);
        }

        public void NotifyDraw()
        {
            notifier.NotifyDraw();
        }

        public void NotifyActivatedTrap(int xpos, int ypos, Modificator modif)
        {
            notifier.NotifyActivatedTrap(xpos, ypos, modif);
        }

        public void NotifyRemoveTrap(int xpos, int ypos)
        {
            notifier.NotifyRemoveTrap(xpos, ypos);
        }

    }
}
