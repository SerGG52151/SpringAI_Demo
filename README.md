# SpringAI_Demo

A basic chat application built with Spring AI, Ollama, and a TypeScript frontend.

## Project layout

- `backend/` - Spring Boot API that talks to Ollama through Spring AI.
- `frontend/` - Vite + React + TypeScript chat client.

## Prerequisites

- Java 21 or newer
- Maven 3.9+
- Node.js 20+
- Ollama running locally at `http://localhost:11434`

## Ollama setup

Pull the default model used by the demo:

```bash
ollama pull mistral
```

If you want to use a different model, set `OLLAMA_MODEL` before starting the backend.

## Run the backend

```bash
cd backend
mvn spring-boot:run
```

The API listens on `http://localhost:8080`.

## Run the frontend

```bash
cd frontend
npm install
npm run dev
```

Open the app at the URL printed by Vite, usually `http://localhost:5173`.

## Environment variables

- `OLLAMA_BASE_URL` - Ollama server URL, defaults to `http://localhost:11434`
- `OLLAMA_MODEL` - Ollama model name, defaults to `mistral`
- `VITE_API_BASE_URL` - Optional API base URL for the frontend, useful outside the Vite dev proxy

## API

- `POST /api/chat`

Request body:

```json
{
	"messages": [
		{ "role": "user", "content": "Hello" },
		{ "role": "assistant", "content": "Hi" }
	]
}
```

Response body:

```json
{
	"reply": "..."
}
```