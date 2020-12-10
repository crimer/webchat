FROM mcr.microsoft.com/mssql/server:2017-latest

ENV ACCEPT_EULA Y
ENV SA_PASSWORD Pa$$w0rd1234

# Copy initialization scripts
COPY ./entrypoint.sh .
COPY ./create-database.sql .

# Grant permissions for the run-initialization script to be executable
#RUN chmod +x /usr/src/app/run-initialization.sh

# Set environment variables, not to have to write them with docker run command
# Note: make sure that your password matches what is in the run-initialization script

EXPOSE 1433

# Run Microsoft SQl Server and initialization script (at the same time)
# Note: If you want to start MsSQL only (without initialization script) you can comment bellow line out, CMD entry from base image will be taken
CMD /bin/bash ./entrypoint.sh

# COPY db_init.sql db_init.sql
# COPY db_setup.sh db_setup.sh
# COPY entrypoint.sh entrypoint.sh

# RUN chmod +x entrypoint.sh

# CMD /bin/bash ./entrypoint.sh