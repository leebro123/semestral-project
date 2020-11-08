using System;
using System.Data;
using System.Linq;
using System.Threading;
using Microsoft.Data.Sqlite;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using SmartPlugORM;

namespace SmartPlugDataCollector
{
    class Program
    {
        static void Main(string[] args)
        {
            //string plugAddress = "192.168.0.206";
            string plugAddress = args[0];
            using (SmartPlugConnection connection = new SmartPlugConnection())
            {
                connection.Open();
                EmeterEntityRepository emeterEntityRepository = new EmeterEntityRepository(connection);

                try
                {
                    while (true)
                    {
                        dynamic stats = Utils.Send(plugAddress, Commands.Emeter());

                        Emeter emeter = JsonConvert.DeserializeObject<Emeter>(JsonConvert.SerializeObject(stats["emeter"]["get_realtime"]));
                        emeterEntityRepository.Insert(EmeterConvertor.ToEmeterEntity(emeter));
                        
                        Thread.Sleep(30000);
                    }
                }
                catch (Exception e)
                {
                    Console.WriteLine(e.ToString());
                }
            }
        }
    }
}
