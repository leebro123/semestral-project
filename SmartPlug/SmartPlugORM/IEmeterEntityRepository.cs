using System;
using System.Collections.Generic;

namespace SmartPlugORM
{
    public interface IEmeterEntityRepository
    {
        public IEnumerable<EmeterEntity> GetAll();

        public IEnumerable<EmeterEntity> GetByDate(DateTime fromDate, DateTime toDate);
    }
}