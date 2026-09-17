from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.routes_query import router as query_router
from app.api.routes_graph import router as graph_router
from app.api.routes_ingest import router as ingest_router
from app.api.routes_company import router as company_router
from app.api.routes_consultancy import router as consultancy_router

app = FastAPI(
    title="AI-Company Brain API",
    description="Enterprise-Grade Operational Intelligence & Relational Graph Platform",
    version="2.0.0"
)

# Enable CORS for frontend development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(query_router)
app.include_router(graph_router)
app.include_router(ingest_router)
app.include_router(company_router)
app.include_router(consultancy_router)

@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "service": "AI-Company Brain",
        "version": "1.0.0",
        "mode": "Operational Intelligence & Graph RAG"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
