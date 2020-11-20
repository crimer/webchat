using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Threading.Tasks;

namespace Infrastructure.Interfaces
{
    public interface IDataAccess
    {
        public Task<int> ExecuteProcedureAsync(string procedureName, List<SqlParameter> parameters);
        public Task<object> ExecuteScalarAsync(string procedureName, List<SqlParameter> parameters);
        public Task<IEnumerable<T>> GetProcedureDataAsync<T>(
            string procedureName, 
            List<SqlParameter> parameters, 
            Func<SqlDataReader, T> generator);
    }
}
