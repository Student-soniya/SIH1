# ==========================================
# Backend Dockerfile (Scoped to SchemeReady/backend directory)
# ==========================================
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

COPY SchemeReady.Api.csproj ./
RUN dotnet restore SchemeReady.Api.csproj

COPY . ./
RUN dotnet publish SchemeReady.Api.csproj -c Release -o /app/publish --no-restore

FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime
WORKDIR /app

RUN mkdir -p /app/data/documents /app/data/tmp

ENV ASPNETCORE_ENVIRONMENT=Production \
    PORT=10000 \
    ASPNETCORE_URLS="http://+:10000" \
    SCHEMEREADY_CORS_ORIGINS="*" \
    SCHEMEREADY_JWT_SIGNING_KEY="SchemeReady_DefaultProductionSigningSecretKey_2026_Min256Bits!" \
    SCHEMEREADY_JWT_ISSUER="https://schemeready.onrender.com" \
    SCHEMEREADY_JWT_AUDIENCE="https://schemeready.onrender.com" \
    SCHEMEREADY_DOCUMENT_ROOT="/app/data/documents"

COPY --from=build /app/publish .

COPY docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh

EXPOSE 10000 8080 5000

ENTRYPOINT ["/docker-entrypoint.sh"]
CMD ["dotnet", "SchemeReady.Api.dll"]
