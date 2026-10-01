# NoteGrab

Paste study notes → FastAPI backend → Claude generates a multiple-choice quiz → answer it in the browser.

## Run it

```bash
python -m venv .venv && source .venv/bin/activate   # Windows: .venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env    # then put your real ANTHROPIC_API_KEY in .env
uvicorn main:app --reload
```

Open http://localhost:8000. Interactive API docs are at http://localhost:8000/docs.

## How it works

- `POST /api/quiz` takes `{ "notes": str, "num_questions": int }`.
- The backend forces Claude to call a `submit_quiz` tool whose JSON schema defines the quiz shape, so the response is always structured JSON instead of free text that needs parsing.
- Pydantic validates both the request and Claude's output before it reaches the frontend.
- The frontend is plain HTML/JS served by FastAPI, so there is no CORS or build step.
