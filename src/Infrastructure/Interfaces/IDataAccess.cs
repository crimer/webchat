using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Threading.Tasks;

namespace Infrastructure.Interfaces
{
    public interface IDataAccess
    {
        public Task<SqlConnection> GetConnectionAsync();
        public SqlCommand GetCommand(SqlConnection connection, string query, CommandType commandType);
        public Task<int> ExecuteNonQueryAsync(string procedureName, List<SqlParameter> parameters, CommandType commandType = CommandType.StoredProcedure);
        public Task<object> ExecuteScalarAsync(string procedureName, List<SqlParameter> parameters, CommandType commandType = CommandType.StoredProcedure);
        public Task<SqlDataReader> GetDataReaderAsync(string procedureName, List<SqlParameter> parameters, CommandType commandType = CommandType.StoredProcedure);
    }
}
