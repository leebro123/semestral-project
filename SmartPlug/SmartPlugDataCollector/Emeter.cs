using System;
using Newtonsoft.Json;

namespace SmartPlugDataCollector
{
    public class Emeter
    {
        [JsonProperty("voltage_mv")]
        public int Voltage { get; set; }

        [JsonProperty("current_ma")]
        public int Current { get; set; }

        [JsonProperty("power_mw")]
        public int Power { get; set; }
    }
}
