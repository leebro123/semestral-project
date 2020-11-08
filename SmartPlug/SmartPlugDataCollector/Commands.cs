using Newtonsoft.Json;

namespace SmartPlugDataCollector
{   
    public static class Commands
    {
        public static string Emeter()
        {
            return JsonConvert.SerializeObject(new
            {
                emeter = new
                {
                    get_realtime = new { },
                    get_vgain_igain = new { }
                }
            });
        }
    }
}
