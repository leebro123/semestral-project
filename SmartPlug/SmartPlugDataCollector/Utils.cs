using Newtonsoft.Json;
using System;
using System.Linq;
using System.Net;
using System.Net.Sockets;
using System.Text;
using System.Threading;

namespace SmartPlugDataCollector
{
    public static class Utils
    {
        public static dynamic Send(string ip, string jsonPayload, SocketType socketType = SocketType.Stream, ProtocolType protocolType = ProtocolType.Tcp, int port = 9999)
        {
            using (var sender = new Socket(AddressFamily.InterNetwork, socketType, protocolType))
            {
                var tpEndPoint = new IPEndPoint(IPAddress.Parse(ip), port);
                sender.Connect(tpEndPoint);
                sender.Send(Encrypt(jsonPayload, protocolType == ProtocolType.Tcp));
                byte[] buffer = new byte[2048];
                sender.ReceiveTimeout = 5000;
                EndPoint recEndPoint = tpEndPoint;
                
                int bytesLen = sender.Receive(buffer);
                if (bytesLen > 0)
                {
                    return JsonConvert.DeserializeObject<dynamic>(Decrypt(buffer.Take(bytesLen).ToArray(), protocolType == ProtocolType.Tcp));
                }
                else
                {
                    throw new Exception("Error");
                }
            }
        }

        private static UInt32 ReverseBytes(UInt32 value)
        {
            return (value & 0x000000FFU) << 24 | (value & 0x0000FF00U) << 8 |
                   (value & 0x00FF0000U) >> 8 | (value & 0xFF000000U) >> 24;
        }
        private static byte[] Encrypt(string payload, bool hasHeader = true)
        {
            byte key = 0xAB;
            byte[] cipherBytes = new byte[payload.Length];
            byte[] header = hasHeader ? BitConverter.GetBytes(ReverseBytes((UInt32)payload.Length)) : new byte[] { };
            for (var i = 0; i < payload.Length; i++)
            {
                cipherBytes[i] = Convert.ToByte(payload[i] ^ key);
                key = cipherBytes[i];
            }
            return header.Concat(cipherBytes).ToArray();
        }
        private static string Decrypt(byte[] cipher, bool hasHeader = true)
        {
            byte key = 0xAB;
            byte nextKey;
            if (hasHeader)
                cipher = cipher.Skip(4).ToArray();
            byte[] result = new byte[cipher.Length];

            for (int i = 0; i < cipher.Length; i++)
            {
                nextKey = cipher[i];
                result[i] = (byte)(cipher[i] ^ key);
                key = nextKey;
            }
            return Encoding.UTF7.GetString(result);
        }
    }
}
