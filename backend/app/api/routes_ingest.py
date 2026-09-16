from fastapi import APIRouter, HTTPException
from typing import List
from app.models.schemas import DocumentIngestionRequest, IngestionResponse, EvidenceItem
from app.services.ingestion_engine import ingestion_engine
from app.services.vector_service import vector_service

router = APIRouter(prefix="/api", tags=["Ingestion & Evidence"])

@router.post("/ingest", response_model=IngestionResponse)
def ingest_document(req: DocumentIngestionRequest) -> IngestionResponse:
    try:
        return ingestion_engine.ingest_document(req)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/evidence/{doc_id}", response_model=EvidenceItem)
def get_evidence_item(doc_id: str) -> EvidenceItem:
    item = vector_service.get_by_id(doc_id)
    if not item:
        raise HTTPException(status_code=404, detail="Evidence item not found")
    return item

@router.get("/evidence", response_model=List[EvidenceItem])
def list_evidence() -> List[EvidenceItem]:
    return list(vector_service.documents.values())
