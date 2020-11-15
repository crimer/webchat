using Infrastructure.Interfaces;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;

namespace Infrastructure.Data
{
    public class AdoDataAccess : IDataAccess
    {
        private string _connectionString { get; set; }
        public AdoDataAccess(string connection)
        {
            _connectionString = connection;
        }

        public SqlConnection GetConnection()
        {
            SqlConnection connection = new SqlConnection(this._connectionString);
            if (connection.State != ConnectionState.Open)
                connection.Open();
            return connection;
        }

        public SqlCommand GetCommand(SqlConnection connection, string query, CommandType commandType)
        {
            SqlCommand command = new SqlCommand(query, connection);
            command.CommandType = commandType;
            return command;
        }

        public int ExecuteQuery(string procedureName, List<SqlParameter> parameters, CommandType commandType = CommandType.StoredProcedure)
        {
            int returnValue = -1;
            using (SqlConnection connection = this.GetConnection())
            {
                SqlCommand command = this.GetCommand(connection, procedureName, commandType);
                if (parameters != null && parameters.Count > 0)
                {
                    command.Parameters.AddRange(parameters.ToArray());
                }
                returnValue = command.ExecuteNonQuery();
            }
            return returnValue;
        }

        public object ExecuteScalar(string procedureName, List<SqlParameter> parameters, CommandType commandType = CommandType.StoredProcedure)
        {
            object returnValue = null;
            using (SqlConnection connection = this.GetConnection())
            {
                SqlCommand command = this.GetCommand(connection, procedureName, commandType);
                if (parameters != null && parameters.Count > 0)
                {
                    command.Parameters.AddRange(parameters.ToArray());
                }
                returnValue = command.ExecuteScalar();
            }
            return returnValue;
        }

        public SqlDataReader GetDataReader(string procedureName, List<SqlParameter> parameters, CommandType commandType = CommandType.StoredProcedure)
        {
            SqlDataReader dataReader;
            using (SqlConnection connection = this.GetConnection())
            {
                SqlCommand command = this.GetCommand(connection, procedureName, commandType);
                if (parameters != null && parameters.Count > 0)
                {
                    command.Parameters.AddRange(parameters.ToArray());
                }
                dataReader = command.ExecuteReader();
            }
            return dataReader;
        }
    }
}
