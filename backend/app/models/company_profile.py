from typing import List, Dict, Any, Optional
from pydantic import BaseModel, Field

class OperationalMetric(BaseModel):
    id: str
    name: str
    current_value: str
    target_value: str
    trend: str = "STABLE"  # "UP", "DOWN", "STABLE", "WARNING"
    unit: str
    category: str  # "FINANCIAL", "OPERATIONAL", "COMPLIANCE", "CUSTOMER"
    financial_impact_annual: float = 0.0

class StrategicGoal(BaseModel):
    id: str
    title: str
    target_quarter: str
    priority: str = "HIGH"  # "CRITICAL", "HIGH", "MEDIUM"
    owner_department: str
    target_roi_multiple: float = 1.0
    description: str

class CompanyProfile(BaseModel):
    id: str
    name: str
    tagline: str
    industry: str  # e.g., "Logistics & Supply Chain", "B2B Cloud SaaS", "Omnichannel Retail & D2C"
    annual_revenue: float
    currency: str = "USD"
    headcount: int
    headquarters: str
    description: str
    departments: List[str]
    active_metrics: List[OperationalMetric] = []
    strategic_goals: List[StrategicGoal] = []
    entity_ontology: List[str] = []
    relation_ontology: List[str] = []

class CompanyPresetSummary(BaseModel):
    id: str
    name: str
    industry: str
    tagline: str
    description: str
    node_count_estimate: int
    evidence_count_estimate: int

class SwitchPresetRequest(BaseModel):
    preset_id: str

class RoadmapPhaseItem(BaseModel):
    id: str
    title: str
    owner: str
    estimated_weeks: int
    estimated_impact: str
    status: str = "PLANNED"
    action_items: List[str]

class RoadmapPhase(BaseModel):
    phase_name: str  # e.g. "Phase 1: Immediate Triage & Leakage Mitigation (Days 1-30)"
    focus_area: str
    target_window: str  # "Days 1-30", "Days 31-60", "Days 61-90"
    projected_savings: float
    initiatives: List[RoadmapPhaseItem]

class AuditFinding(BaseModel):
    id: str
    severity: str  # "CRITICAL", "HIGH", "MEDIUM", "LOW"
    category: str  # "FINANCIAL_LEAKAGE", "SLA_BREACH", "PROCESS_BOTTLENECK", "COMPLIANCE_RISK"
    title: str
    description: str
    annual_financial_exposure: float
    affected_entities: List[str]
    recommended_action: str

class EnterpriseAuditResult(BaseModel):
    company_id: str
    company_name: str
    overall_health_score: int  # 0 to 100
    efficiency_index: float    # e.g., 68.5%
    total_financial_leakage: float
    critical_risks_count: int
    findings: List[AuditFinding]
    audit_date: str

class StrategicBusinessPlan(BaseModel):
    company_id: str
    company_name: str
    industry: str
    plan_title: str
    executive_summary: str
    current_posture_assessment: str
    swot_analysis: Dict[str, List[str]]
    causal_diagnosis: List[Dict[str, Any]]
    strategic_objectives: List[Dict[str, Any]]
    execution_roadmap: List[RoadmapPhase]
    projected_financial_impact: Dict[str, Any]
    governance_and_risks: List[Dict[str, str]]
    source_evidence_citations: List[str] = []
