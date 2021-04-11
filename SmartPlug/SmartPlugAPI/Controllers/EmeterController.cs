using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using SmartPlugAPI.Cors;
using SmartPlugORM;


namespace SmartPlugApi.Controllers
{
    [ApiController]
    [AllowCrossSite]
    [Route("api/[controller]")]
    public class EmeterController : ControllerBase
    {
        private readonly IEmeterEntityRepository emeterEntityRepository;

        public EmeterController(IEmeterEntityRepository emeterEntityRepository)
        {
            this.emeterEntityRepository = emeterEntityRepository;
        }

        [HttpGet]
        [Route("all")]
        public IEnumerable<EmeterEntity> GetAll()
        {
            return emeterEntityRepository.GetAll().ToArray();
        }

        [Route("byDate")]
        public IEnumerable<EmeterEntity> GetByDate(string fromDate, string toDate)
        {
            if (!DateTime.TryParse(fromDate, out var fromDateDateTime) || !DateTime.TryParse(toDate, out var toDateDateTime))
            {
                throw new Exception("Parameters 'fromDate' and 'toDate' must be provided or are in wrong format");
            }

            if (DateTime.Compare(fromDateDateTime, toDateDateTime) > 0)
            {
                throw new Exception("'fromDate' parameter must not be later than 'toDate' parameter");
            }

            return emeterEntityRepository.GetByDate(fromDateDateTime, toDateDateTime).ToArray();
        }
    }
}