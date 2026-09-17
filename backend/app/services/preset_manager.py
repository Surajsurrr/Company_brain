from typing import Dict, Any, List, Optional
import copy
from app.models.company_profile import (
    CompanyProfile, CompanyPresetSummary, OperationalMetric, StrategicGoal
)
from app.models.schemas import EntityNode, RelationEdge, EvidenceItem
from data.seed.seed_data import SEED_DATA

# ----------------- PRESET DEFINITIONS -----------------

PRESET_PROFILES: Dict[str, Dict[str, Any]] = {
    "apex_logistics": {
        "profile": CompanyProfile(
            id="apex_logistics",
            name="Apex Global Logistics",
            tagline="Enterprise Cold-Chain & Multimodal Freight Operations",
            industry="Logistics & Supply Chain",
            annual_revenue=145000000.0,
            currency="USD",
            headcount=1240,
            headquarters="Chicago, IL",
            description="Tier-1 cold-chain freight and third-party logistics provider managing multi-state distribution corridors with contract carriers and private fleet operations.",
            departments=["Fleet Operations", "Procurement & Contracts", "Finance & Accounts Payable", "Compliance & Safety", "Customer Logistics"],
            active_metrics=[
                OperationalMetric(
                    id="m_otd",
                    name="On-Time Delivery Rate (OTD)",
                    current_value="86.4%",
                    target_value="95.0%",
                    trend="WARNING",
                    unit="%",
                    category="OPERATIONAL",
                    financial_impact_annual=320000.0
                ),
                OperationalMetric(
                    id="m_fuel_variance",
                    name="Fuel Surcharge Billing Variance",
                    current_value="+18.7%",
                    target_value="0.0%",
                    trend="WARNING",
                    unit="%",
                    category="FINANCIAL",
                    financial_impact_annual=142000.0
                ),
                OperationalMetric(
                    id="m_invoice_dispute",
                    name="Disputed Invoice Ratio",
                    current_value="14.2%",
                    target_value="< 3.0%",
                    trend="DOWN",
                    unit="%",
                    category="FINANCIAL",
                    financial_impact_annual=85000.0
                )
            ],
            strategic_goals=[
                StrategicGoal(
                    id="sg_cost_containment",
                    title="Automate Freight Audit & Recover Uncontracted Surcharges",
                    target_quarter="Q4 2026",
                    priority="CRITICAL",
                    owner_department="Finance & Accounts Payable",
                    target_roi_multiple=4.2,
                    description="Claw back unauthorized accessorial and fuel surcharge overbillings and mandate weekly index alignment."
                ),
                StrategicGoal(
                    id="sg_sla_stabilization",
                    title="Stabilize Northeast Corridor On-Time Delivery to 95%",
                    target_quarter="Q1 2027",
                    priority="HIGH",
                    owner_department="Fleet Operations",
                    target_roi_multiple=2.8,
                    description="Reroute non-perishable freight via Swift Transport to relieve Newark hub bottlenecks."
                )
            ],
            entity_ontology=["carrier", "route", "invoice", "contract", "incident", "policy", "facility", "personnel"],
            relation_ontology=["OPERATES", "BILLED_FOR", "GOVERNS", "IMPACTED_BY", "ASSIGNED_TO", "REPORTS_TO", "CONNECTS_TO"]
        )
    },
    "cloudscale_saas": {
        "profile": CompanyProfile(
            id="cloudscale_saas",
            name="CloudScale Systems",
            tagline="Enterprise AI-Powered Observability & Cloud Data Platform",
            industry="B2B Cloud SaaS",
            annual_revenue=38000000.0,
            currency="USD",
            headcount=240,
            headquarters="San Francisco, CA",
            description="High-growth B2B enterprise SaaS providing real-time distributed tracing, telemetry ingestion, and automated anomaly detection for Fortune 500 infrastructure teams.",
            departments=["Customer Success & Support", "Cloud Infrastructure & FinOps", "Enterprise Sales", "Core Engineering", "Finance & Revenue Ops"],
            active_metrics=[
                OperationalMetric(
                    id="m_nrr",
                    name="Net Revenue Retention (NRR)",
                    current_value="104.2%",
                    target_value="122.0%",
                    trend="DOWN",
                    unit="%",
                    category="CUSTOMER",
                    financial_impact_annual=680000.0
                ),
                OperationalMetric(
                    id="m_finops",
                    name="Cloud Infrastructure Cost % of ARR",
                    current_value="28.4%",
                    target_value="17.0%",
                    trend="WARNING",
                    unit="%",
                    category="FINANCIAL",
                    financial_impact_annual=430000.0
                ),
                OperationalMetric(
                    id="m_sev1_sla",
                    name="Sev-1 Incident Resolution Time",
                    current_value="182 mins",
                    target_value="< 45 mins",
                    trend="WARNING",
                    unit="mins",
                    category="OPERATIONAL",
                    financial_impact_annual=250000.0
                )
            ],
            strategic_goals=[
                StrategicGoal(
                    id="sg_finops_opt",
                    title="Optimize Snowflake & AWS Multi-Tenant Compute Spend",
                    target_quarter="Q4 2026",
                    priority="CRITICAL",
                    owner_department="Cloud Infrastructure & FinOps",
                    target_roi_multiple=5.4,
                    description="Implement dynamic tiering and reserved capacity to bring infrastructure gross margins from 71.6% to 83%."
                ),
                StrategicGoal(
                    id="sg_churn_firewall",
                    title="Enterprise Tier-1 Account Churn Firewall",
                    target_quarter="Q1 2027",
                    priority="CRITICAL",
                    owner_department="Customer Success & Support",
                    target_roi_multiple=6.1,
                    description="Resolve ingestion throttling issues for FinServe Inc and MegaCorp to protect $2.4M in renewal ARR."
                )
            ],
            entity_ontology=["customer", "contract", "cloud_service", "incident", "ticket", "feature", "team", "engineer"],
            relation_ontology=["SUBSCRIBES_TO", "HOSTED_ON", "DISRUPTED_BY", "RESOLVED_BY", "OWNS", "VIOLATES_SLA", "BILLED_FOR"]
        )
    },
    "omniverse_retail": {
        "profile": CompanyProfile(
            id="omniverse_retail",
            name="Omniverse Brands",
            tagline="Omnichannel Direct-to-Consumer & Retail Apparel Group",
            industry="Omnichannel Retail & D2C",
            annual_revenue=88000000.0,
            currency="USD",
            headcount=480,
            headquarters="Austin, TX",
            description="Omnichannel lifestyle apparel and performance footwear retailer operating 42 flagship retail locations and a high-volume direct-to-consumer digital commerce channel.",
            departments=["Merchandising & Sourcing", "E-Commerce & Digital", "Supply Chain & Fulfillment", "Customer Experience", "Financial Planning"],
            active_metrics=[
                OperationalMetric(
                    id="m_gross_margin",
                    name="Gross Product Margin",
                    current_value="51.2%",
                    target_value="58.5%",
                    trend="DOWN",
                    unit="%",
                    category="FINANCIAL",
                    financial_impact_annual=1100000.0
                ),
                OperationalMetric(
                    id="m_return_rate",
                    name="D2C Apparel Return Rate",
                    current_value="24.8%",
                    target_value="< 15.0%",
                    trend="WARNING",
                    unit="%",
                    category="OPERATIONAL",
                    financial_impact_annual=720000.0
                ),
                OperationalMetric(
                    id="m_stockout",
                    name="Core SKU Stockout Rate",
                    current_value="11.4%",
                    target_value="< 2.5%",
                    trend="WARNING",
                    unit="%",
                    category="CUSTOMER",
                    financial_impact_annual=950000.0
                )
            ],
            strategic_goals=[
                StrategicGoal(
                    id="sg_supplier_leadtime",
                    title="Nearshore Manufacturing & Supplier SLA Enforcement",
                    target_quarter="Q4 2026",
                    priority="HIGH",
                    owner_department="Merchandising & Sourcing",
                    target_roi_multiple=3.5,
                    description="Curtail 45-day ocean freight lead times by allocating 30% volume to Latin America production partners."
                ),
                StrategicGoal(
                    id="sg_returns_reversal",
                    title="Implement AI Size Fit Engine & Stricter Returns Window",
                    target_quarter="Q1 2027",
                    priority="HIGH",
                    owner_department="E-Commerce & Digital",
                    target_roi_multiple=4.0,
                    description="Reduce sizing-related return loops by 40% and save $540,000 in reverse logistics and restocking costs."
                )
            ],
            entity_ontology=["supplier", "sku_category", "warehouse", "sales_channel", "purchase_order", "shipment", "policy", "campaign"],
            relation_ontology=["SUPPLIES", "STOCKED_AT", "FULFILLED_BY", "GOVERNED_BY", "RETURNED_FROM", "PURCHASED_VIA"]
        )
    }
}

class PresetManager:
    def __init__(self):
        self.active_preset_id: str = "apex_logistics"

    def get_available_presets(self) -> List[CompanyPresetSummary]:
        summaries = []
        estimates = {
            "apex_logistics": (24, 18),
            "cloudscale_saas": (22, 16),
            "omniverse_retail": (20, 15)
        }
        for pid, data in PRESET_PROFILES.items():
            prof = data["profile"]
            est_nodes, est_ev = estimates.get(pid, (20, 15))
            summaries.append(CompanyPresetSummary(
                id=prof.id,
                name=prof.name,
                industry=prof.industry,
                tagline=prof.tagline,
                description=prof.description,
                node_count_estimate=est_nodes,
                evidence_count_estimate=est_ev
            ))
        return summaries

    def get_active_profile(self) -> CompanyProfile:
        return PRESET_PROFILES[self.active_preset_id]["profile"]

    def switch_preset(self, preset_id: str) -> CompanyProfile:
        if preset_id not in PRESET_PROFILES:
            raise ValueError(f"Unknown preset ID '{preset_id}'. Available: {list(PRESET_PROFILES.keys())}")
        
        self.active_preset_id = preset_id
        
        # Reload Graph and Vector Services with the company's dataset
        self._reload_services_for_preset(preset_id)
        return self.get_active_profile()

    def _reload_services_for_preset(self, preset_id: str):
        from app.services.graph_service import graph_service
        from app.services.vector_service import vector_service

        # 1. Reset Graph
        graph_service.graph.clear()

        # 2. Reset Vector Store
        vector_service.documents.clear()

        if preset_id == "apex_logistics":
            graph_service._initialize_seed_graph()
            vector_service._build_seed_evidence_index()
        elif preset_id == "cloudscale_saas":
            self._load_saas_seed(graph_service, vector_service)
        elif preset_id == "omniverse_retail":
            self._load_retail_seed(graph_service, vector_service)

    def _load_saas_seed(self, graph_service, vector_service):
        nodes = [
            EntityNode(id="cust_finserve", label="FinServe Global", type="customer", properties={"tier": "Enterprise Tier-1", "arr": 1400000, "status": "AT_RISK"}, summary="FinServe Global: $1.4M ARR enterprise customer experiencing severe latency during peak trading."),
            EntityNode(id="cust_megacorp", label="MegaCorp Tech", type="customer", properties={"tier": "Enterprise Tier-1", "arr": 1000000, "status": "AT_RISK"}, summary="MegaCorp Tech: $1.0M ARR client with SLA breach warnings on telemetry ingestion pipeline."),
            EntityNode(id="srv_telemetry", label="Telemetry Ingestion Engine", type="cloud_service", properties={"infra": "AWS EKS + Kafka", "monthly_cost": 115000}, summary="High-throughput Kafka cluster handling 14M events/sec. Currently CPU constrained."),
            EntityNode(id="srv_snowflake", label="Snowflake Data Lakehouse", type="cloud_service", properties={"infra": "Snowflake Enterprise", "monthly_cost": 105000, "overrun_pct": 34.5}, summary="Data warehouse storage & compute. Exceeded monthly budget by $36,200 due to unindexed queries."),
            EntityNode(id="inc_sev1_latency", label="INC-802: Kafka Buffer Overflow", type="incident", properties={"severity": "SEV-1", "date": "2026-09-08", "downtime_mins": 145}, summary="Sev-1 incident causing 145 mins data ingestion drop. Triggered $75,000 contractual SLA penalty."),
            EntityNode(id="contract_finserve_sla", label="FinServe Enterprise SLA Agreement", type="contract", properties={"doc_ref": "MSA-2025-FIN", "uptime_guarantee": "99.95%", "penalty_rate": "10% credit"}, summary="Contract guarantees 99.95% ingestion uptime with 10% invoice rebate per 30-min breach."),
            EntityNode(id="team_finops", label="FinOps & Infrastructure Team", type="team", properties={"lead": "Marcus Vance", "headcount": 8}, summary="Infrastructure team tasked with compute optimization and cluster autoscaling.")
        ]
        for n in nodes:
            graph_service.add_entity(n)

        edges = [
            ("cust_finserve", "srv_telemetry", "SUBSCRIBES_TO", 1.5),
            ("cust_megacorp", "srv_telemetry", "SUBSCRIBES_TO", 1.4),
            ("srv_telemetry", "srv_snowflake", "PIPELINES_TO", 1.3),
            ("srv_telemetry", "inc_sev1_latency", "DISRUPTED_BY", 1.8),
            ("cust_finserve", "contract_finserve_sla", "GOVERNED_BY", 1.5),
            ("inc_sev1_latency", "contract_finserve_sla", "VIOLATES_SLA", 1.9),
            ("team_finops", "srv_snowflake", "MANAGES", 1.2)
        ]
        for src, tgt, rel, w in edges:
            graph_service.graph.add_edge(src, tgt, relation=rel, weight=w)

        evs = [
            EvidenceItem(
                id="doc_saas_sla",
                type="contract",
                title="FinServe MSA SLA Schedule C",
                source_ref="MSA-2025-FIN §4.2",
                snippet="CloudScale guarantees 99.95% continuous ingestion availability. Latency above 400ms exceeding 30 consecutive minutes triggers a 10% monthly rebate credit ($11,666 per occurrence).",
                full_content="Schedule C - Availability & Service Level Commitments.\nVendor: CloudScale Systems\nClient: FinServe Global Inc.\nPenalty: Liquidated service credits applied directly to quarterly billing.",
                date="2026-01-15",
                metadata={"customer": "FinServe", "risk": "HIGH"},
                relevance_score=0.98
            ),
            EvidenceItem(
                id="doc_finops_audit",
                type="invoice",
                title="Snowflake Q3 Compute Utilization & Cost Overrun Report",
                source_ref="FINOPS-2026-Q3",
                snippet="Snowflake credit burn ran 34.5% above contracted baseline ($105,000 vs $78,000 budgeted). Root cause: Large ad-hoc telemetry analytics queries executed without clustering keys.",
                full_content="FinOps Engineering Analysis:\nWarehouse size: 2X-Large\nTotal overage: $36,200\nRecommended action: Enforce auto-suspend 60s and partition by customer_org_id.",
                date="2026-09-01",
                metadata={"category": "Cloud Spend", "overrun": 36200},
                relevance_score=0.95
            ),
            EvidenceItem(
                id="doc_saas_inc802",
                type="incident",
                title="Post-Mortem: INC-802 Kafka Cluster Partition Throttling",
                source_ref="PAGERDUTY-INC-802",
                snippet="On Sept 8, Kafka broker 4 experienced partition exhaustion under 14M events/sec traffic spike from MegaCorp. Data pipeline throttled for 145 minutes, violating FinServe Tier-1 SLA.",
                full_content="Incident Response Summary:\nIncident: INC-802\nImpact: 145 minutes degraded ingestion\nCorrective Action: Deploy partition autoscaling and dynamic rate-limiting per customer tenant.",
                date="2026-09-09",
                metadata={"severity": "SEV-1", "downtime": 145},
                relevance_score=0.97
            )
        ]
        for ev in evs:
            vector_service.add_document(ev)

    def _load_retail_seed(self, graph_service, vector_service):
        nodes = [
            EntityNode(id="supp_pacifex", label="Pacifex Textiles Ltd", type="supplier", properties={"country": "Vietnam", "reliability_score": "78%", "category": "Apparel"}, summary="Pacifex Textiles: Primary manufacturer for winter performance outerwear. Facing 3-week shipping delays."),
            EntityNode(id="sku_outerwear", label="Nordic Weather Parka SKU-491", type="sku_category", properties={"margin": "58%", "stockout_risk": "CRITICAL", "gmv_target": 4200000}, summary="Flagship winter apparel SKU generating $4.2M target GMV. Currently at 12 days inventory buffer."),
            EntityNode(id="wh_chicago", label="Midwest Central Fulfillment Hub", type="warehouse", properties={"capacity_used": "94%", "city": "Joliet, IL"}, summary="Primary omnichannel fulfillment center servicing East Coast & Midwest retail stores."),
            EntityNode(id="po_8841", label="PO-8841 Outerwear Batch", type="purchase_order", properties={"value": 1100000, "status": "DELAYED_IN_TRANSIT", "eta_delay_days": 18}, summary="Purchase Order for 35,000 parkas delayed at Long Beach port due to customs documentation hold."),
            EntityNode(id="chan_ecommerce", label="Omniverse.com Direct Channel", type="sales_channel", properties={"gmv_share": "62%", "return_rate": "24.8%"}, summary="Direct-to-consumer e-commerce channel exhibiting 24.8% return rate primarily due to size fit disparity."),
            EntityNode(id="pol_returns_60d", label="60-Day Unconditional Returns Policy", type="policy", properties={"doc_ref": "RET-POL-2024", "window_days": 60, "free_shipping": True}, summary="Legacy policy granting free return shipping and 60-day return window, causing $720k annual reverse logistics drain.")
        ]
        for n in nodes:
            graph_service.add_entity(n)

        edges = [
            ("supp_pacifex", "po_8841", "SUPPLIES", 1.6),
            ("po_8841", "sku_outerwear", "FULFILLS_INVENTORY", 1.8),
            ("po_8841", "wh_chicago", "DELIVERS_TO", 1.4),
            ("chan_ecommerce", "sku_outerwear", "DISTRIBUTES", 1.5),
            ("chan_ecommerce", "pol_returns_60d", "GOVERNED_BY", 1.7)
        ]
        for src, tgt, rel, w in edges:
            graph_service.graph.add_edge(src, tgt, relation=rel, weight=w)

        evs = [
            EvidenceItem(
                id="doc_retail_po8841",
                type="purchase_order",
                title="PO-8841 Bill of Lading & Port Congestion Notice",
                source_ref="BL-PACIFEX-8841",
                snippet="Ocean shipment carrying 35,000 units of SKU-491 delayed by 18 days due to documentation mismatch at Long Beach port. Stockout imminent across 28 Midwest stores before Black Friday.",
                full_content="Purchase Order: PO-8841\nSupplier: Pacifex Textiles Ltd\nValue: $1,100,000\nDelay: 18 days past contracted delivery window\nContract Clause §7: Liquidated damages of 1.5% per week of delay.",
                date="2026-09-05",
                metadata={"supplier": "Pacifex", "risk": "CRITICAL"},
                relevance_score=0.98
            ),
            EvidenceItem(
                id="doc_returns_analysis",
                type="policy",
                title="D2C Reverse Logistics & Product Returns Audit 2026",
                source_ref="AUDIT-RET-2026",
                snippet="D2C return rates hit 24.8% on apparel. Sizing discrepancies accounted for 64% of return reasons. Average cost to process each return is $18.40 including two-way shipping and repackaging.",
                full_content="Operational Advisory Report:\nTotal annual returns expense: $720,000\nRoot Cause: Inconsistent fit specification between Asian manufacturing partners and US sizing charts.\nRecommendation: Shorten return window to 30 days and deploy TrueFit 3D sizing widget.",
                date="2026-08-20",
                metadata={"return_rate": 0.248, "annual_loss": 720000},
                relevance_score=0.96
            )
        ]
        for ev in evs:
            vector_service.add_document(ev)

preset_manager = PresetManager()
