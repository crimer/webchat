#!/bin/bash

# Wait
sleep 90s

# Execute init script
/opt/mssql-tools/bin/sqlcmd -S localhost -U sa -P 'Pa$$w0rd1234' -d master -i create-database.sql &

# Start SQL server
/opt/mssql/bin/sqlservr