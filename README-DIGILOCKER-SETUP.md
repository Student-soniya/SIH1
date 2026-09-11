# DigiLocker API Integration

This project includes a DigiLocker OAuth2 client and endpoints for retrieving issued documents.

## Configure credentials

Register a requester application in the [DigiLocker API Setu portal](https://apisetu.gov.in/digilocker). Its redirect URI must exactly match the `DigiLocker:RedirectUri` setting (the local default is `http://localhost:5242/api/digilocker/callback`).

Do not put the client credentials in `appsettings.json`. For local development:

```bash
cd SchemeReady/backend
dotnet user-secrets init
dotnet user-secrets set "DigiLocker:ClientId" "your-client-id"
dotnet user-secrets set "DigiLocker:ClientSecret" "your-client-secret"
```

For deployment, provide `DigiLocker__ClientId` and `DigiLocker__ClientSecret` as environment variables or through the platform's secret store.

## API flow

1. Request `GET /api/digilocker/authorize?beneficiaryId=123` and redirect the browser to `authorizeUrl`.
2. DigiLocker calls `/api/digilocker/callback` with `code` and `state`; the API exchanges the code for a token.
3. Request `GET /api/digilocker/documents` with `X-DigiLocker-AccessToken` to list issued documents.
4. Request `GET /api/digilocker/documents/download/{fileUri}` with the same header to retrieve a document.

## Before production

- Persist encrypted access and refresh tokens against the beneficiary; the callback currently returns link metadata only.
- Replace the process-local OAuth state dictionary with a shared cache or database-backed store.
- Confirm the OAuth paths and scopes against the API Setu documentation for your registered app.
