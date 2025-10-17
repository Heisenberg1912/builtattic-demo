# Builtattic Marketplace

This monorepo contains the Vite React client and Express + MongoDB backend that power the Builtattic marketplace and support desk integrations.

## Local Development

```bash
npm install
npm run dev
```

This runs the client and server concurrently. Environment variables for each workspace live in `client/.env` and `server/.env` while development values are provided in the new `*.env.example` files.

## Production Deployment

The project now includes:

- **Dockerfile** – builds the React client and packages the Express API for Cloud Run.
- **cloudbuild.yaml** – opinionated Cloud Build pipeline to build, push, and deploy the container.
- **Structured logging + secret loading** – Winston JSON logs for Cloud Logging and optional Secret Manager integration.
- **Hardened webhook** – shared-secret gate for the support email ingress endpoint.

For a complete walkthrough, including Google Cloud prerequisites, secret provisioning, and custom domain setup, see `docs/DEPLOYMENT.md`.
