from fastapi import APIRouter, HTTPException
from typing import List, Dict, Any
from app.models.company_profile import (
    CompanyProfile, CompanyPresetSummary, SwitchPresetRequest
)
from app.services.preset_manager import preset_manager

router = APIRouter(prefix="/api/company", tags=["Company & Presets"])

@router.get("/presets", response_model=List[CompanyPresetSummary])
def list_presets():
    """List all available enterprise presets (Logistics, B2B SaaS, Retail)."""
    return preset_manager.get_available_presets()

@router.get("/profile", response_model=CompanyProfile)
def get_company_profile():
    """Get the active company's operational profile, active metrics, and strategic goals."""
    return preset_manager.get_active_profile()

@router.post("/switch-preset", response_model=CompanyProfile)
def switch_company_preset(req: SwitchPresetRequest):
    """Switch active company profile and rebuild the graph & evidence store."""
    try:
        updated_profile = preset_manager.switch_preset(req.preset_id)
        return updated_profile
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
