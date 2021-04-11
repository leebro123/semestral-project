using System;
using NUnit.Framework;
using SmartPlugDataCollector;

namespace SmartPlugTests
{
    public class UtilsTest
    {
        [SetUp]
        public void Setup()
        {
        }

        [Test]
        [TestCase("{\"test\": \"test\"}", false, "0PKG45Dkxvzc/orvnOjKtw==",
            TestName = "Encrypt test case with payload = {0} and hasHeader = {1}")]
        [TestCase("{\"test\": \"test\"}", true, "AAAAENDyhuOQ5Mb83P6K75zoyrc=",
            TestName = "Encrypt test case with payload = {0} and hasHeader = {1}")]
        [Parallelizable(ParallelScope.All)]
        public void TestEncrypt(string payload, bool hasHeader, string expectedResult)
        {
            byte[] res = Utils.Encrypt(payload, hasHeader);
            string result = Convert.ToBase64String(res);

            Assert.AreEqual(result, expectedResult);
        }

        [Test]
        [TestCase("", false, TestName = "Encrypt test case with empty payload")]
        public void TestEncrypt2(string payload, bool hasHeader)
        {
            var ex = Assert.Throws<Exception>(() => Utils.Encrypt(payload, hasHeader), "");
            Assert.AreEqual(ex.Message, "string 'payload' must not be empty");
        }

        [Test]
        [TestCaseSource(nameof(_cases))]
        [Parallelizable(ParallelScope.All)]
        public void TestDecrypt(byte[] cipher, bool hasHeader, string expectedResult)
        {
            string res = Utils.Decrypt(cipher, hasHeader);
            Assert.AreEqual(res, expectedResult);
        }

        [Test]
        [TestCase(new byte[0], false, TestName = "Decrypt test case with empty cipher")]
        public void TestDecrypt2(byte[] cipher, bool hasHeader)
        {
            var ex = Assert.Throws<Exception>(() => Utils.Decrypt(cipher, hasHeader), "");
            Assert.AreEqual(ex.Message, "byte[] 'cipher' must not be empty");
        }

        private static object[] _cases =
        {
            new object[] {Convert.FromBase64String("0PKG45Dkxvzc/orvnOjKtw=="), false, "{\"test\": \"test\"}"},
            new object[] {Convert.FromBase64String("AAAAENDyhuOQ5Mb83P6K75zoyrc="), true, "{\"test\": \"test\"}"},
        };
    }
}