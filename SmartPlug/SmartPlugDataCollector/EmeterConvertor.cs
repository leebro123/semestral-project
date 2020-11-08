using System;
using SmartPlugORM;

namespace SmartPlugDataCollector
{
    public class EmeterConvertor
    {
        public static EmeterEntity ToEmeterEntity(Emeter emeter)
        {
            EmeterEntity emeterEntity = new EmeterEntity
            {
                Current = emeter.Current,
                Voltage = emeter.Voltage,
                Power = emeter.Power,
                CreatedAt = DateTime.Now
            };

            return emeterEntity;
        }
    }
}
