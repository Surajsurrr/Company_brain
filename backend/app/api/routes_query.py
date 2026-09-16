from fastapi import APIRouter, HTTPException
from typing import List, Dict, Any
from app.models.schemas import QueryRequest, QueryResponse
from app.services.reasoning_engine import reasoning_engine

router = APIRouter(prefix="/api", tags=["Reasoning"])

@router.post("/query", response_model=QueryResponse)
def execute_query(req: QueryRequest) -> QueryResponse:
    try:
        response = reasoning_engine.process_query(req)
        return response
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/sample-queries")
def get_sample_queries() -> List[Dict[str, Any]]:
    return [
        {
            "id": "hr_1",
            "category": "HR & Employee",
            "role": "Employee / HR",
            "title": "What is our policy on carryover PTO?",
            "prompt": "What is our company policy on carryover PTO and what is the deadline to use it?",
            "badge": "HR Policy",
            "icon": "Calendar"
        },
        {
            "id": "hr_2",
            "category": "HR & Employee",
            "role": "Employee / HR",
            "title": "How do I claim my annual wellness stipend?",
            "prompt": "How much is our annual home office & wellness stipend and how do I submit a claim?",
            "badge": "Benefits",
            "icon": "Heart"
        },
        {
            "id": "mgr_1",
            "category": "Management & Finance",
            "role": "Manager",
            "title": "What is my signing authority limit for team expenses?",
            "prompt": "What are the expense approval thresholds for direct managers vs directors and VPs?",
            "badge": "Finance Policy",
            "icon": "CheckCircle"
        },
        {
            "id": "ops_1",
            "category": "Operations & Logistics",
            "role": "Operations / Finance",
            "title": "Why did our delivery costs surge in Q3?",
            "prompt": "Why did our freight delivery cost surge in Q3 for Northeast routes?",
            "badge": "Operations",
            "icon": "TrendingUp"
        },
        {
            "id": "ops_2",
            "category": "Operations & Logistics",
            "role": "Operations / Finance",
            "title": "Which carrier caused delays and what can we penalize?",
            "prompt": "Which carrier had the highest SLA delivery delays and what liquidated damages can we deduct?",
            "badge": "Contracts & SLA",
            "icon": "ShieldAlert"
        }
    ]
