import math
import datetime
from typing import List, Dict, Any, Optional
import networkx as nx

from app.models.company_profile import (
    CompanyProfile, EnterpriseAuditResult, AuditFinding,
    StrategicBusinessPlan, RoadmapPhase, RoadmapPhaseItem
)
from app.services.graph_service import graph_service
from app.services.vector_service import vector_service
from app.services.preset_manager import preset_manager
from app.services.llm_client import llm_client

class StrategicConsultancyEngine:
    """
    Autonomous Enterprise Strategic Advisory & Business Planning AI.
    Performs graph-wide diagnostic audits, detects cost & operational leakages,
    and formulates comprehensive McKinsey-grade strategic business plans and 30-60-90 day execution roadmaps.
    """

    def run_diagnostic_audit(self) -> EnterpriseAuditResult:
        company = preset_manager.get_active_profile()
        g = graph_service.graph

        findings: List[AuditFinding] = []
        total_leakage = 0.0

        # 1. Analyze high-centrality and bottleneck entities
        if len(g.nodes) > 0:
            degrees = dict(g.degree())
            sorted_nodes = sorted(degrees.items(), key=lambda x: x[1], reverse=True)
            top_hubs = [nid for nid, deg in sorted_nodes[:3]]
        else:
            top_hubs = []

        # 2. Inspect edge relationships for SLA violations, disruptions, and overruns
        sla_edges = [(u, v, d) for u, v, d in g.edges(data=True) if d.get("relation") in ["VIOLATES_SLA", "DISRUPTS", "IMPACTS"]]
        
        # 3. Pull active company metrics that have financial exposure
        for m in company.active_metrics:
            if m.trend in ["WARNING", "DOWN"] and m.financial_impact_annual > 0:
                total_leakage += m.financial_impact_annual
                severity = "CRITICAL" if m.financial_impact_annual > 250000 else "HIGH"
                cat = "FINANCIAL_LEAKAGE" if m.category == "FINANCIAL" else "SLA_BREACH"
                
                findings.append(AuditFinding(
                    id=f"audit_{m.id}",
                    severity=severity,
                    category=cat,
                    title=f"Uncontained Operational Variance: {m.name}",
                    description=f"Current performance at {m.current_value} against target {m.target_value}. Annualized risk exposure calculated at ${m.financial_impact_annual:,.2f}.",
                    annual_financial_exposure=m.financial_impact_annual,
                    affected_entities=top_hubs[:2],
                    recommended_action=f"Institute automated policy gating and enforce vendor contract SLAs to recover baseline {m.target_value}."
                ))

        # 4. Check for unmitigated SLA disruptions in the graph
        if sla_edges:
            disrupted_nodes = list(set([u for u, v, d in sla_edges] + [v for u, v, d in sla_edges]))
            findings.append(AuditFinding(
                id="audit_sla_disruption",
                severity="CRITICAL",
                category="SLA_BREACH",
                title="Active Operational SLA & Reliability Vulnerability",
                description=f"Identified {len(sla_edges)} active operational disruption or contract SLA violation vectors across critical network nodes.",
                annual_financial_exposure=175000.0,
                affected_entities=disrupted_nodes[:4],
                recommended_action="Execute immediate vendor capacity rebalancing or automated penalty clawback under standard contract terms."
            ))
            total_leakage += 175000.0

        critical_count = sum(1 for f in findings if f.severity == "CRITICAL")
        
        # Calculate health score (0-100)
        health_score = max(42, min(95, int(100 - (critical_count * 12) - (len(findings) * 4))))
        efficiency_index = round(max(55.0, min(92.0, 100.0 - (total_leakage / max(company.annual_revenue * 0.05, 1000000)) * 20)), 1)

        return EnterpriseAuditResult(
            company_id=company.id,
            company_name=company.name,
            overall_health_score=health_score,
            efficiency_index=efficiency_index,
            total_financial_leakage=total_leakage,
            critical_risks_count=critical_count,
            findings=findings,
            audit_date=datetime.date.today().isoformat()
        )

    def generate_strategic_business_plan(self) -> StrategicBusinessPlan:
        company = preset_manager.get_active_profile()
        audit = self.run_diagnostic_audit()
        top_evidence = vector_service.search_evidence(company.name + " SLA contract audit cost", top_k=3)
        citations = [f"{ev.title} ({ev.source_ref})" for ev in top_evidence]

        # 1. Generate execution roadmap phases tailored to company profile
        phase1_items = []
        phase2_items = []
        phase3_items = []

        if company.id == "apex_logistics":
            phase1_items = [
                RoadmapPhaseItem(
                    id="p1_apex_audit",
                    title="Automated Fuel Surcharge & Accessorial Audit Clawback",
                    owner="Finance & Accounts Payable",
                    estimated_weeks=3,
                    estimated_impact="$142,000 Direct Cash Recovery",
                    action_items=[
                        "Flag Apex Freight invoices matching Invoice #8921 and #8934 for surcharge rate recalculation.",
                        "Enforce EIA PADD 1A weekly index compliance per Master Service Agreement §4.2.",
                        "Automate accounts payable 3-way match between bill of lading, contracted rate sheet, and EDI invoices."
                    ]
                ),
                RoadmapPhaseItem(
                    id="p1_apex_reroute",
                    title="Northeast Corridor Load Rebalancing to Swift Transport",
                    owner="Fleet Operations",
                    estimated_weeks=4,
                    estimated_impact="+8.5% On-Time Delivery Recovery",
                    action_items=[
                        "Shift 35% non-perishable freight volume from Newark Hub to Swift Transport Allentown bypass.",
                        "Re-open spot market backup carriers for Philadelphia metro distribution.",
                        "Implement real-time telematics alerts for dock dwell times exceeding 90 minutes."
                    ]
                )
            ]
            phase2_items = [
                RoadmapPhaseItem(
                    id="p2_apex_contract",
                    title="Carrier SLA Governance & Contract Renegotiation",
                    owner="Procurement & Legal",
                    estimated_weeks=6,
                    estimated_impact="15% Reduction in Carrier Disputes",
                    action_items=[
                        "Standardize liquidated delay damages clauses across all Tier-1 and Tier-2 carrier agreements.",
                        "Deploy automated carrier scorecard tracking OTD, temperature excursions, and claims ratios.",
                        "Institute quarterly volume allocation tiers tied directly to reliability performance."
                    ]
                )
            ]
            phase3_items = [
                RoadmapPhaseItem(
                    id="p3_apex_scale",
                    title="Predictive Freight AI & Dynamic Capacity Network",
                    owner="VP of Supply Chain",
                    estimated_weeks=8,
                    estimated_impact="$420,000 Annualized Operating Margin Gain",
                    action_items=[
                        "Integrate dynamic spot-rate hedging models with weather and traffic telemetry.",
                        "Consolidate midwest and southeast distribution hubs under unified fleet optimization."
                    ]
                )
            ]
        elif company.id == "cloudscale_saas":
            phase1_items = [
                RoadmapPhaseItem(
                    id="p1_saas_finserve",
                    title="FinServe Tier-1 SLA Mitigation & Kafka Buffer Stabilization",
                    owner="Customer Success & Core Engineering",
                    estimated_weeks=2,
                    estimated_impact="Protect $1.4M Enterprise ARR Renewal",
                    action_items=[
                        "Issue $23,300 service credit memo to FinServe Global with root-cause transparency report.",
                        "Scale Kafka ingestion partition brokers from 6 to 12 nodes with dynamic rate-limiting.",
                        "Set up PagerDuty Sev-1 escalations for ingestion latency exceeding 350ms."
                    ]
                ),
                RoadmapPhaseItem(
                    id="p1_saas_finops",
                    title="Snowflake Compute Optimization & Auto-Suspend Gating",
                    owner="Cloud Infrastructure & FinOps",
                    estimated_weeks=3,
                    estimated_impact="$36,200 Monthly Cloud Compute Savings",
                    action_items=[
                        "Enforce strict 60-second auto-suspend on all ad-hoc telemetry analytics warehouses.",
                        "Add cluster keys and partitioning on customer_org_id to eliminate full-table scans.",
                        "Implement FinOps alerts for queries consuming > 50 credits/hour."
                    ]
                )
            ]
            phase2_items = [
                RoadmapPhaseItem(
                    id="p2_saas_nrr",
                    title="Enterprise Tier-1 Health Scoring & Churn Firewall",
                    owner="VP Customer Success",
                    estimated_weeks=5,
                    estimated_impact="Increase NRR from 104.2% to 118%",
                    action_items=[
                        "Establish executive sponsor cadences with top 20 accounts generating 65% of ARR.",
                        "Deploy automated customer telemetry health index inside Salesforce."
                    ]
                )
            ]
            phase3_items = [
                RoadmapPhaseItem(
                    id="p3_saas_scale",
                    title="Multi-Tenant High-Throughput Edge Ingestion Architecture",
                    owner="Chief Technology Officer",
                    estimated_weeks=8,
                    estimated_impact="83% Infrastructure Gross Margins",
                    action_items=[
                        "Transition high-volume event stream pre-aggregation to Rust-based edge workers.",
                        "Negotiate AWS 3-year Savings Plans and committed spend discount with Snowflake."
                    ]
                )
            ]
        else:
            # Omniverse Retail
            phase1_items = [
                RoadmapPhaseItem(
                    id="p1_ret_supplier",
                    title="Emergency Sourcing Acceleration & Port Clearance for PO-8841",
                    owner="Merchandising & Sourcing",
                    estimated_weeks=2,
                    estimated_impact="Prevent $1.1M Black Friday Stockout",
                    action_items=[
                        "Coordinate expedited customs broker clearance at Long Beach port for 35,000 outerwear units.",
                        "Enforce 1.5% weekly liquidated damages deduction against Pacifex invoice.",
                        "Air-freight 4,000 priority units to Chicago fulfillment center to bridge retail inventory gap."
                    ]
                ),
                RoadmapPhaseItem(
                    id="p1_ret_returns",
                    title="Returns Policy Modernization & Sizing Optimization",
                    owner="E-Commerce & Digital",
                    estimated_weeks=4,
                    estimated_impact="$280,000 Reduction in Reverse Logistics Drains",
                    action_items=[
                        "Transition unconditional 60-day return window to 30-day standard with customer satisfaction exception.",
                        "Embed comprehensive size-fit recommender on outerwear product detail pages.",
                        "Establish local retail store drop-off returns to eliminate return packaging costs."
                    ]
                )
            ]
            phase2_items = [
                RoadmapPhaseItem(
                    id="p2_ret_nearshore",
                    title="Nearshore Manufacturing Diversification",
                    owner="VP Sourcing",
                    estimated_weeks=6,
                    estimated_impact="Reduce Average Lead Time from 45 to 16 Days",
                    action_items=[
                        "Onboard vetted Central American manufacturing partners for 30% of core apparel volume.",
                        "Reduce single-supplier exposure to Pacifex below 40%."
                    ]
                )
            ]
            phase3_items = [
                RoadmapPhaseItem(
                    id="p3_ret_omni",
                    title="Unified Omnichannel Inventory Allocation & Margin Expansion",
                    owner="Chief Operating Officer",
                    estimated_weeks=8,
                    estimated_impact="Expand Gross Margin from 51.2% to 58.0%",
                    action_items=[
                        "Implement ship-from-store algorithms across 42 flagship retail locations.",
                        "Deploy AI inventory positioning to cut interstate inventory transshipment costs."
                    ]
                )
            ]

        roadmap = [
            RoadmapPhase(
                phase_name="Phase 1: Immediate Triage & Leakage Containment",
                focus_area="Immediate cash recovery, SLA stabilization, and critical bottleneck resolution",
                target_window="Days 1-30",
                projected_savings=audit.total_financial_leakage * 0.45,
                initiatives=phase1_items
            ),
            RoadmapPhase(
                phase_name="Phase 2: Systematic Process Optimization & Policy Automation",
                focus_area="Contract renegotiation, automated monitoring guardrails, and operational resilience",
                target_window="Days 31-60",
                projected_savings=audit.total_financial_leakage * 0.35,
                initiatives=phase2_items
            ),
            RoadmapPhase(
                phase_name="Phase 3: Strategic Scale & Margin Expansion",
                focus_area="Long-term predictive modeling, architecture scaling, and market leadership",
                target_window="Days 61-90",
                projected_savings=audit.total_financial_leakage * 0.20,
                initiatives=phase3_items
            )
        ]

        # SWOT Synthesis
        swot = {
            "Strengths": [
                f"Established market presence with ${company.annual_revenue:,.0f} baseline revenue and dedicated customer accounts.",
                f"Robust operational infrastructure across {', '.join(company.departments[:3])}.",
                "Granular transaction and contract telemetry captured within the Enterprise Knowledge Graph."
            ],
            "Weaknesses": [
                f"Current operational efficiency index measured at {audit.efficiency_index}%, constrained by unmitigated operational variances.",
                f"Recurring financial leakage totaling ${audit.total_financial_leakage:,.2f} annually across uncontracted charges and SLA penalties.",
                "Siloed departmental communication causing delayed escalation on critical partner incidents."
            ],
            "Opportunities": [
                "Automate continuous 3-way invoice and contract reconciliation to eliminate manual dispute overhead.",
                "Deploy proactive routing / capacity balancing to boost customer SLA adherence above 96%.",
                "Monetize high-efficiency operations into higher gross margins and predictable enterprise renewals."
            ],
            "Threats": [
                "Partner and carrier margin erosion leading to sudden route cancellation or vendor churn.",
                "Severe customer attrition if Tier-1 SLA breaches remain unmitigated.",
                "Macro volatility across fuel, cloud compute, or tariff compliance costs."
            ]
        }

        # Causal Diagnosis
        causal_diagnosis = [
            {
                "root_driver": finding.title,
                "category": finding.category,
                "annual_financial_exposure": finding.annual_financial_exposure,
                "attribution_pct": round((finding.annual_financial_exposure / max(audit.total_financial_leakage, 1)) * 100, 1),
                "affected_nodes": finding.affected_entities,
                "mitigation": finding.recommended_action
            }
            for finding in audit.findings
        ]

        # Strategic Objectives
        objectives = [
            {
                "objective": goal.title,
                "target_quarter": goal.target_quarter,
                "priority": goal.priority,
                "department": goal.owner_department,
                "roi_multiple": f"{goal.target_roi_multiple}x",
                "description": goal.description
            }
            for goal in company.strategic_goals
        ]

        # Financial Impact Projection
        projected_roi = {
            "annual_revenue_baseline": company.annual_revenue,
            "total_leakage_identified": audit.total_financial_leakage,
            "total_projected_annual_recovery": audit.total_financial_leakage * 0.88,
            "net_margin_expansion_bps": round((audit.total_financial_leakage * 0.88 / max(company.annual_revenue, 1)) * 10000, 0),
            "implementation_cost_estimate": 65000.0,
            "net_roi_multiple": round((audit.total_financial_leakage * 0.88) / 65000.0, 1),
            "payback_period_months": 2.4
        }

        # Governance & Risks
        governance = [
            {"risk": "Vendor pushback during clawback execution", "mitigation": "Lead with verified Master Service Agreement audit clauses and offer phased reconciliation offset."},
            {"risk": "Engineering / operational capacity constraints", "mitigation": "Focus exclusively on Phase 1 quick wins within the first 30 days before initiating architectural refactoring."},
            {"risk": "Data drift between ERP and operational logs", "mitigation": "Institute automated nightly ingestion and graph synchronization via AI-Company Brain."}
        ]

        exec_summary = (
            f"The Enterprise Operational Intelligence Diagnostic for {company.name} reveals an overall organizational health score of "
            f"{audit.overall_health_score}/100 and an operational efficiency index of {audit.efficiency_index}%. "
            f"Cross-relational graph analysis across contracts, financial invoices, operational incidents, and communication logs identified "
            f"${audit.total_financial_leakage:,.2f} in annual financial leakage across {len(audit.findings)} primary operational vectors. "
            f"Executing this 90-day strategic roadmap is projected to recover ${projected_roi['total_projected_annual_recovery']:,.2f} "
            f"({projected_roi['net_margin_expansion_bps']} bps margin expansion) with an estimated net ROI of {projected_roi['net_roi_multiple']}x."
        )

        posture = (
            f"{company.name} maintains substantial market scale (${company.annual_revenue:,.0f} annual revenue) but experiences margin compression "
            f"from operational bottlenecks and uncontracted partner fees. By uniting siloed data into an interconnected knowledge fabric, "
            f"executive leadership can transition from reactive crisis mitigation into automated, predictive enterprise governance."
        )

        return StrategicBusinessPlan(
            company_id=company.id,
            company_name=company.name,
            industry=company.industry,
            plan_title=f"Strategic Turnaround & Operating Efficiency Plan: {company.name}",
            executive_summary=exec_summary,
            current_posture_assessment=posture,
            swot_analysis=swot,
            causal_diagnosis=causal_diagnosis,
            strategic_objectives=objectives,
            execution_roadmap=roadmap,
            projected_financial_impact=projected_roi,
            governance_and_risks=governance,
            source_evidence_citations=citations
        )

consultancy_engine = StrategicConsultancyEngine()
