sleep 20

/opt/mssql-tools/bin/sqlcmd -S localhost -U SA -P 'Pa$$w0rd1234' -i db_init.sql
if [ $? -eq 0 ]
    then
        echo "db_init.sql completed"
        break
fi