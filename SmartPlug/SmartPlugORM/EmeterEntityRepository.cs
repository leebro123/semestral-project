using System;
using System.Collections.Generic;
using System.Data;
using Microsoft.Data.Sqlite;

namespace SmartPlugORM
{
    public class EmeterEntityRepository : IEmeterEntityRepository
    {
        private const string insertQueryString =
            @"INSERT INTO emeter(current, voltage, power, created_at) VALUES (@current, @voltage, @power, @created_at)";

        private const string selectAllQueryString = @"SELECT current, voltage, power, created_at FROM emeter";

        private const string selectByDateQueryString =
            @"SELECT current, voltage, power, created_at FROM emeter WHERE created_at BETWEEN @fromDate AND @toDate";

        private SmartPlugConnection SmartPlugConnection { get; set; }

        public void Insert(EmeterEntity emeter)
        {
            SmartPlugConnection.Open();
            var command = this.SmartPlugConnection.Connection.CreateCommand();

            command.CommandText = insertQueryString;
            command.CommandType = CommandType.Text;

            command.Parameters.AddWithValue("@current", emeter.Current);
            command.Parameters.AddWithValue("@voltage", emeter.Voltage);
            command.Parameters.AddWithValue("@power", emeter.Power);
            command.Parameters.AddWithValue("@created_at", emeter.CreatedAt.ToString("s"));

            command.ExecuteNonQuery();
            SmartPlugConnection.Dispose();
        }

        public IEnumerable<EmeterEntity> GetAll()
        {
            SmartPlugConnection.Open();
            var command = this.SmartPlugConnection.Connection.CreateCommand();
            List<EmeterEntity> emeterEntities = new List<EmeterEntity>();

            command.CommandText = selectAllQueryString;
            command.CommandType = CommandType.Text;

            SqliteDataReader r = command.ExecuteReader();
            while (r.Read())
            {
                EmeterEntity emeterEntity = new EmeterEntity
                {
                    Voltage = Convert.ToInt32(r["voltage"]),
                    Current = Convert.ToInt32(r["current"]),
                    Power = Convert.ToInt32(r["power"]),
                    CreatedAt = Convert.ToDateTime(r["created_at"])
                };

                emeterEntities.Add(emeterEntity);
            }

            SmartPlugConnection.Dispose();
            return emeterEntities;
        }

        public IEnumerable<EmeterEntity> GetByDate(DateTime fromDate, DateTime toDate)
        {
            SmartPlugConnection.Open();
            var command = this.SmartPlugConnection.Connection.CreateCommand();
            List<EmeterEntity> emeterEntities = new List<EmeterEntity>();

            command.CommandText = selectByDateQueryString;
            command.CommandType = CommandType.Text;

            command.Parameters.AddWithValue("@fromDate", fromDate.ToString("s"));
            command.Parameters.AddWithValue("@toDate", toDate.ToString("s"));

            SqliteDataReader r = command.ExecuteReader();
            while (r.Read())
            {
                EmeterEntity emeterEntity = new EmeterEntity
                {
                    Voltage = Convert.ToInt32(r["voltage"]),
                    Current = Convert.ToInt32(r["current"]),
                    Power = Convert.ToInt32(r["power"]),
                    CreatedAt = Convert.ToDateTime(r["created_at"])
                };

                emeterEntities.Add(emeterEntity);
            }

            SmartPlugConnection.Dispose();
            return emeterEntities;
        }

        public EmeterEntityRepository(SmartPlugConnection smartPlugConnection)
        {
            this.SmartPlugConnection = smartPlugConnection;
        }
    }
}