using System;
using Microsoft.Data.Sqlite;

namespace SmartPlugORM
{
    public class SmartPlugConnection : IDisposable
    {
        public SqliteConnection Connection { get; set; }

        public SmartPlugConnection()
        {
            //this.Connection = new SqliteConnection("Data Source=file:/Users/libormichalek/sqlite/SmartPlug.db");
            this.Connection = new SqliteConnection("Data Source=file:/home/pi/sqlite/SmartPlug.db");
        }

        public void Open()
        {
            this.Connection.Open();
        }

        public void Dispose()
        {
            this.Connection.Dispose();
        }
    }
}
