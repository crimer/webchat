using ApplicationCore.Options;
using Infrastructure.Interfaces;
using Microsoft.Extensions.Options;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Threading.Tasks;

namespace Infrastructure.Data
{
    public class AdoDataAccess : IDataAccess
    {
        private string _connectionString { get; set; }
        public AdoDataAccess(IOptions<DatabaseSettings> options)
        {
            _connectionString = options.Value.ConnectionString;
        }

        public async Task<SqlConnection> GetConnectionAsync()
        {
            SqlConnection connection = new SqlConnection(this._connectionString);
            if (connection.State != ConnectionState.Open)
                await connection.OpenAsync();
            return connection;
        }

        public SqlCommand GetCommand(SqlConnection connection, string query, CommandType commandType)
        {
            SqlCommand command = new SqlCommand(query, connection);
            command.CommandType = commandType;
            return command;
        }

        public async Task<int> ExecuteNonQueryAsync(string procedureName, List<SqlParameter> parameters, CommandType commandType = CommandType.StoredProcedure)
        {
            int returnValue = -1;
            var dbConnection = await this.GetConnectionAsync();
            using (SqlConnection connection = dbConnection)
            {
                SqlCommand command = this.GetCommand(connection, procedureName, commandType);
                if (parameters != null && parameters.Count > 0)
                {
                    command.Parameters.AddRange(parameters.ToArray());
                }
                returnValue = await command.ExecuteNonQueryAsync();
            }
            return returnValue;
        }

        public async Task<object> ExecuteScalarAsync(string procedureName, List<SqlParameter> parameters, CommandType commandType = CommandType.StoredProcedure)
        {
            object returnValue = null;
            var dbConnection = await this.GetConnectionAsync();
            using (SqlConnection connection = dbConnection)
            {
                SqlCommand command = this.GetCommand(connection, procedureName, commandType);
                if (parameters != null && parameters.Count > 0)
                {
                    command.Parameters.AddRange(parameters.ToArray());
                }
                returnValue = await command.ExecuteScalarAsync();
            }
            return returnValue;
        }

        public async Task<SqlDataReader> GetDataReaderAsync(string procedureName, List<SqlParameter> parameters, CommandType commandType = CommandType.StoredProcedure)
        {
            SqlDataReader dataReader;
            var dbConnection = await this.GetConnectionAsync();
            using (SqlConnection connection = dbConnection)
            {
                SqlCommand command = this.GetCommand(connection, procedureName, commandType);
                if (parameters != null && parameters.Count > 0)
                {
                    command.Parameters.AddRange(parameters.ToArray());
                }
                dataReader = await command.ExecuteReaderAsync();
            }
            return dataReader;
        }
    }
}
