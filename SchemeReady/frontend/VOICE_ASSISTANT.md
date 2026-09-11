# SchemeReady AI Voice Assistant

The SchemeReady frontend now includes a floating **Ask SchemeReady** voice assistant.

## What it does

- Uses the browser Web Speech API for microphone input.
- Supports English (`en-IN`), Hindi (`hi-IN`) and Kannada (`kn-IN`).
- Speaks assistant responses with browser speech synthesis when available.
- Sends spoken text through the existing `extractEntities()` flow so business type, location, loan requirement and user type can update the live onboarding profile.
- Provides quick actions for onboarding, scheme matching and readiness guidance.
- Falls back to typed chat when speech recognition is unavailable.
- Does not expose an OpenAI/API secret in client-side code.

## How to use

1. Start the frontend with `npm run dev`.
2. Click **Ask SchemeReady** at the bottom-right.
3. Allow microphone access when the browser asks.
4. Speak naturally, for example: `I want to start a tailoring business in Bengaluru and need 1.2 lakh rupees.`
5. The assistant extracts the onboarding details and updates the profile.

## Browser support

Speech recognition support varies by browser. Chromium-based browsers generally provide the best compatibility. If recognition is unavailable, the assistant remains usable through the text input and can still use the SchemeReady extraction endpoint.

## Security note

The implementation intentionally uses the existing SchemeReady backend extraction endpoint and browser speech APIs. No provider API key is stored in `VITE_*` client-side environment variables.