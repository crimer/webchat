using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;

namespace Infrastructure.Interfaces
{
    public interface IDataAccess
    {
        public SqlConnection GetConnection();
        public SqlCommand GetCommand(SqlConnection connection, string query, CommandType commandType);
        public int ExecuteQuery(string procedureName, List<SqlParameter> parameters, CommandType commandType = CommandType.StoredProcedure);
        public object ExecuteScalar(string procedureName, List<SqlParameter> parameters, CommandType commandType = CommandType.StoredProcedure);
        public SqlDataReader GetDataReader(string procedureName, List<SqlParameter> parameters, CommandType commandType = CommandType.StoredProcedure);
    }
}
