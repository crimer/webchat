
FROM mcr.microsoft.com/dotnet/core/aspnet:3.1-nanoserver-1903 AS base
WORKDIR /app
EXPOSE 80

FROM mcr.microsoft.com/dotnet/core/sdk:3.1-nanoserver-1903 AS build
WORKDIR /src
COPY ["MessageChat/MessageChat.csproj", "MessageChat/"]
COPY ["ApplicationCore/ApplicationCore.csproj", "ApplicationCore/"]
COPY ["Infrastructure/Infrastructure.csproj", "Infrastructure/"]
RUN dotnet restore "MessageChat/MessageChat.csproj"
COPY . .
WORKDIR "/src/MessageChat"
RUN dotnet build "MessageChat.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "MessageChat.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "MessageChat.dll"]