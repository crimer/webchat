using ApplicationCore.Options;
using Infrastructure.Interfaces;
using Microsoft.Extensions.Options;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Threading.Tasks;

namespace Infrastructure.Data
{
    public class AdoDataAccess : IDataAccess
    {
        private string _connectionString { get; set; }
        public AdoDataAccess(IOptions<DatabaseSettings> options)
        {
//#if Release
//             _connectionString = options.Value.DockerString;
//#endif
//#if Debug
//            _connectionString = options.Value.ConnectionString;
//#endif
            _connectionString = options.Value.ConnectionString;
        }

        private async Task<SqlConnection> GetConnectionAsync()
        {
            SqlConnection connection = new SqlConnection(this._connectionString);
            if (connection.State != ConnectionState.Open)
                await connection.OpenAsync();
            return connection;
        }

        private SqlCommand GetCommand(SqlConnection connection, string query, CommandType commandType)
        {
            SqlCommand command = new SqlCommand(query, connection);
            command.CommandType = commandType;
            return command;
        }

        public async Task<int> ExecuteProcedureAsync(string procedureName, List<SqlParameter> parameters)
        {
            int returnValue = -1;
            var dbConnection = await this.GetConnectionAsync();
            using (SqlConnection connection = dbConnection)
            {
                SqlCommand command = this.GetCommand(connection, procedureName, CommandType.StoredProcedure);
                if (parameters != null && parameters.Count > 0)
                {
                    command.Parameters.AddRange(parameters.ToArray());
                }
                returnValue = await command.ExecuteNonQueryAsync();
            }
            return returnValue;
        }

        public async Task<IEnumerable<T>> GetProcedureDataAsync<T>(string procedureName, List<SqlParameter> parameters,
            Func<SqlDataReader, T> generator)
        {
            SqlDataReader dataReader;

            List<T> datas = new List<T>();

            var dbConnection = await this.GetConnectionAsync();
            using (SqlConnection connection = dbConnection)
            {
                SqlCommand command = this.GetCommand(connection, procedureName, CommandType.StoredProcedure);
                if (parameters != null && parameters.Count > 0)
                {
                    command.Parameters.AddRange(parameters.ToArray());
                }
                dataReader = await command.ExecuteReaderAsync();
                if (dataReader != null && dataReader.HasRows)
                {
                    while (await dataReader.ReadAsync())
                        datas.Add(generator(dataReader));
                }
                else
                {
                    return Enumerable.Empty<T>();
                }
            }
            return datas;
        }

        public static T GetValue<T>(SqlDataReader reader, string collumnName)
        {
            return reader[collumnName] == DBNull.Value ? default(T) : (T)reader[collumnName];
        }
    }
}
