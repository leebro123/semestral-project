using System;
using System.Globalization;

namespace SmartPlugORM
{
    public class EmeterEntity
    {
        public int Voltage { get; set; }

        public int Current { get; set; }

        public int Power { get; set; }

        public DateTime CreatedAt { get; set; }

        public override string ToString()
        {
            return $"{Voltage}, {Current}, {Power}, {CreatedAt.ToString(CultureInfo.CurrentCulture)}";
        }
    }
}
