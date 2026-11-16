from fastapi import FastAPI

app = FastAPI(title="Apuestas deportivas · Reportes")


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok"}
