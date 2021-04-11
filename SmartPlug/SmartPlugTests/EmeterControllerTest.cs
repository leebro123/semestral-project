using System;
using System.Collections.Generic;
using System.Linq;
using Moq;
using NUnit.Framework;
using SmartPlugApi.Controllers;
using SmartPlugORM;

namespace SmartPlugTests
{
    public class EmeterControllerTest
    {
        private Mock<IEmeterEntityRepository> _emeterEntityRepository;

        private readonly List<EmeterEntity> _mockedResponse = new[]
        {
            new EmeterEntity {Voltage = 123, Current = 123, Power = 123, CreatedAt = DateTime.Now},
            new EmeterEntity {Voltage = 123, Current = 123, Power = 123, CreatedAt = DateTime.Now},
            new EmeterEntity {Voltage = 123, Current = 123, Power = 123, CreatedAt = DateTime.Now},
            new EmeterEntity {Voltage = 123, Current = 123, Power = 123, CreatedAt = DateTime.Now}
        }.ToList();

        private EmeterController _emeterController;

        [SetUp]
        public void Setup()
        {
            _emeterEntityRepository = new Mock<IEmeterEntityRepository>();
            _emeterEntityRepository
                .Setup(x => x.GetByDate(Convert.ToDateTime("2021-03-01"), Convert.ToDateTime("2021-03-03")))
                .Returns(_mockedResponse);

            _emeterController = new EmeterController(_emeterEntityRepository.Object);
        }


        [Test]
        [TestCase("2021-03-01", "2021-03-03", TestName = "GetByDate test case with fromDate = {0} and toDate = {1}")]
        public void TestGetByDate(string fromDate, string toDate)
        {
            var res = _emeterController.GetByDate(fromDate, toDate);
            Assert.AreEqual(res.ToList(), _mockedResponse);
        }


        [Test]
        [TestCase("2021-03-03", "2021-03-01", TestName = "GetByDate test case with 'fromDate' and 'toDate' swapped")]
        public void TestGetByDate2(string fromDate, string toDate)
        {
            var ex = Assert.Throws<Exception>(() => _emeterController.GetByDate(fromDate, toDate), "");
            Assert.AreEqual(ex.Message, "'fromDate' parameter must not be later than 'toDate' parameter");
        }


        [Test]
        [TestCase("2021-", "", TestName = "GetByDate test case with invalid 'fromDate' and 'toDate'")]
        public void TestGetByDate3(string fromDate, string toDate)
        {
            var ex = Assert.Throws<Exception>(() => _emeterController.GetByDate(fromDate, toDate), "");
            Assert.AreEqual(ex.Message, "Parameters 'fromDate' and 'toDate' must be provided or are in wrong format");
        }
    }
}