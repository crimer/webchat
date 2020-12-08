FROM mcr.microsoft.com/mssql/server:2017-latest
USER root

COPY db_init.sql db_init.sql
COPY db_setup.sh db_setup.sh
COPY entrypoint.sh entrypoint.sh

RUN chmod +x entrypoint.sh

CMD /bin/bash ./entrypoint.sh