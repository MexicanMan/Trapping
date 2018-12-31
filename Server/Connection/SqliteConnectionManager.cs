using ProjectAstolfo.Json;
using System;
using System.Collections.Generic;
using System.Data.Common;
using System.Data.SQLite;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace Server
{
    public class SqliteConnectionManager : DBConnectionManager, IDisposable
    {

        private SQLiteConnection connection;
        private string databaseName = "Users.db";

        public SqliteConnectionManager()
        {
            if (!File.Exists(databaseName) || new FileInfo(databaseName).Length == 0)
            {
                if (File.Exists(databaseName))
                {
                    File.Delete(databaseName);
                }
                SQLiteConnection.CreateFile(databaseName);
                connection = new SQLiteConnection(string.Format("Data Source={0};", databaseName));
                connection.Open();
                SQLiteCommand command = new SQLiteCommand(@"CREATE TABLE `users` (
	                                                    `id`	INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
	                                                    `Username`	TEXT NOT NULL,
	                                                    `Email`	TEXT NOT NULL,
	                                                    `Password`	TEXT NOT NULL
                                                    ); ", connection);
                command.ExecuteNonQuery();
                connection.Close();
            }
        }

        public int RegisterUser(string username, string email, string password)
        {
            int id = -1;
            using (connection = new SQLiteConnection(string.Format("Data Source={0};", databaseName)))
            {
                connection.Open();
                using (SQLiteCommand command = new SQLiteCommand(string.Format(
                    @"INSERT INTO 'users' ('Username', 'Email', 'Password') VALUES ('{0}', '{1}', '{2}');",
                    username, email, password), connection))
                {
                    command.ExecuteNonQuery();
                }
                using (SQLiteCommand command = new SQLiteCommand(string.Format(
                    @"SELECT id FROM 'users' WHERE Username = '{0}' AND Email = '{1}';",
                    username, email), connection))
                {
                    using (SQLiteDataReader reader = command.ExecuteReader())
                    {
                        int count = 0;
                        foreach (DbDataRecord record in reader)
                        {
                            count++;
                            id = Int32.Parse(record["id"].ToString());
                        }
                        /*
                        if (count != 1)
                        {
                            id = -1;
                        }
                        */
                    }
                }
                connection.Close();
            }
            return id;
        }

        public TokenResponse CheckUser(string email, string password)
        {
            int id = -1;
            string username = "";
            using (connection = new SQLiteConnection(string.Format("Data Source={0};", databaseName)))
            {
                connection.Open();
                using (SQLiteCommand command = new SQLiteCommand(string.Format(
                    @"SELECT id, Username FROM 'users' WHERE Email = '{0}' AND Password = '{1}';",
                    email, password), connection))
                {
                    using (SQLiteDataReader reader = command.ExecuteReader())
                    {
                        foreach (DbDataRecord record in reader)
                        {
                            id = Int32.Parse(record["id"].ToString());
                            username = record["Username"].ToString();
                        }
                    }
                }
                connection.Close();
            }
            return new TokenResponse(id.ToString(), username);
        }

        public bool CheckUsername(string username)
        {
            bool ret = false;
            using (connection = new SQLiteConnection(string.Format("Data Source={0};", databaseName)))
            {
                connection.Open();
                using (SQLiteCommand command = new SQLiteCommand(string.Format(
                @"SELECT id FROM 'users' WHERE Username = '{0}';",
                username), connection))
                {
                    using (SQLiteDataReader reader = command.ExecuteReader())
                    {
                        foreach (DbDataRecord record in reader)
                        {
                            ret = true;
                        }
                    }
                }
                connection.Close();
            }
            return ret;
        }

        public bool CheckEmail(string email)
        {
            bool ret = false;
            using (connection = new SQLiteConnection(string.Format("Data Source={0};", databaseName)))
            {
                connection.Open();
                using (SQLiteCommand command = new SQLiteCommand(string.Format(
                @"SELECT id FROM 'users' WHERE Email = '{0}';",
                email), connection))
                {

                    using (SQLiteDataReader reader = command.ExecuteReader())
                    {
                        foreach (DbDataRecord record in reader)
                        {
                            ret = true;
                        }
                    }
                }
                connection.Close();
            }
            return ret;
        }

        //На всякий
        public void Dispose()
        {
            //CloseConnection();
        }
    }
}
