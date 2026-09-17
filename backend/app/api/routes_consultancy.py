from fastapi import APIRouter
from typing import Dict, Any
from app.models.company_profile import (
    EnterpriseAuditResult, StrategicBusinessPlan
)
from app.services.consultancy_engine import consultancy_engine

router = APIRouter(prefix="/api/consultancy", tags=["Strategic Advisory & Consultancy"])

@router.get("/audit", response_model=EnterpriseAuditResult)
def run_diagnostic_audit():
    """
    Run an automated operational and financial diagnostic across the company Knowledge Graph and Evidence Store.
    """
    return consultancy_engine.run_diagnostic_audit()

@router.get("/business-plan", response_model=StrategicBusinessPlan)
@router.post("/business-plan", response_model=StrategicBusinessPlan)
def generate_strategic_business_plan():
    """
    Generate an executive-ready strategic business plan with SWOT, Causal Diagnosis, and 30-60-90 Day Roadmap.
    """
    return consultancy_engine.generate_strategic_business_plan()
