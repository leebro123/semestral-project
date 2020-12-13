using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using SmartPlugAPI.Cors;
using SmartPlugORM;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace SmartPlug.Controllers
{
    [ApiController]
    [AllowCrossSite]
    [Route("api/[controller]")]
    public class EmeterController : ControllerBase
    {
 
        private readonly ILogger<EmeterController> _logger;

        public EmeterController(ILogger<EmeterController> logger)
        {
            _logger = logger;
        }   

        [HttpGet]
        [Route("all")]
        public IEnumerable<EmeterEntity> GetAll()
        {
            using (SmartPlugConnection connection = new SmartPlugConnection())
            {
                connection.Open();
                EmeterEntityRepository emeterEntityRepository = new EmeterEntityRepository(connection);

                return emeterEntityRepository.GetAll().ToArray();
            }
        }

        [Route("byDate")]
        public IEnumerable<EmeterEntity> GetByDate(string fromDate, string toDate)
        {
            DateTime fromDateDateTime = Convert.ToDateTime(fromDate);
            DateTime toDateDateTime = Convert.ToDateTime(toDate);

            using (SmartPlugConnection connection = new SmartPlugConnection())
            {
                connection.Open();
                EmeterEntityRepository emeterEntityRepository = new EmeterEntityRepository(connection);

                return emeterEntityRepository.GetByDate(fromDateDateTime, toDateDateTime).ToArray();
            }
        }
    }
}