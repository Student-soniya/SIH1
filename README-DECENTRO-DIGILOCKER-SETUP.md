# Decentro DigiLocker integration

This backend uses Decentro's staging DigiLocker APIs rather than calling DigiLocker directly. The integration creates a Decentro session, returns an authorization URL, and then uses the returned Decentro transaction ID to retrieve issued files or a file download response.

## Credentials

Never add credentials to `appsettings.json` or Git. Store the Decentro staging credentials locally:

```bash
cd SchemeReady/backend
dotnet user-secrets set "Decentro:ClientId" "YOUR_DECENTRO_CLIENT_ID"
dotnet user-secrets set "Decentro:ClientSecret" "YOUR_DECENTRO_CLIENT_SECRET"
dotnet user-secrets set "Decentro:ModuleSecret" "YOUR_KYC_ONBOARDING_MODULE_SECRET"
```

The current Decentro DigiLocker SSO endpoints use the `client_id` and `client_secret` headers. The module secret is stored for KYC/onboarding APIs that explicitly require it.

Register this redirect URI in the Decentro staging configuration if Decentro asks you to register one:

```text
http://localhost:5242/api/decentro/digilocker/callback
```

## API flow

1. `POST /api/decentro/digilocker/session` with `{ "beneficiaryId": 123 }`.
2. Redirect the user to `authorizationUrl` in the response. Retain `decentroTransactionId` for that user's flow.
3. After the user completes the DigiLocker flow, `POST /api/decentro/digilocker/documents` with `{ "initialDecentroTransactionId": "DEC..." }`.
4. To request a document, `POST /api/decentro/digilocker/documents/download` with `{ "initialDecentroTransactionId": "DEC...", "fileUrn": "in.gov..." }`.

All Decentro requests include a new unique reference ID and a consent purpose. Obtain user consent before initiating the document-access flow.

## Staging and production

`appsettings.json` defaults to Decentro staging at `https://in.staging.decentro.tech`. For production, set `Decentro__BaseUrl=https://in.decentro.tech` and use the production credentials issued by Decentro.
