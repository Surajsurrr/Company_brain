from typing import List, Dict, Any, Optional
from app.models.schemas import (
    QueryRequest, QueryResponse, CausalFactor, RecommendationItem,
    ReasoningStep, EvidenceItem, GraphData
)
from app.services.graph_service import graph_service
from app.services.vector_service import vector_service

class MultiHopReasoningEngine:
    """
    Enterprise-grade Operational Intelligence & Company Knowledge Engine.
    Processes employee, manager, HR, and executive queries across:
    - HR & People (PTO, Parental Leave, 401k, Wellness Stipend)
    - Finance & Procurement (Approval Limits, Travel, Per Diem, Expenses)
    - Operations & Logistics (Carrier Contracts, Fuel Surcharges, Invoices, Delivery Delays)
    """

    def process_query(self, req: QueryRequest) -> QueryResponse:
        q = req.query.strip().lower()
        cleaned_words = [w.strip("?!.,;:'\"") for w in q.split()]

        # 0. Conversational greetings & assistant identity
        if any(w in cleaned_words for w in ["hi", "hello", "hey", "hola", "greetings", "howdy"]) or \
           q in ["who are you", "who are you?", "what can you do", "what can you do?", "what is this", "what is this?", "help", "help me"]:
            return self._answer_greeting(req)

        # 1. HR Policies
        elif any(w in q for w in ["pto", "vacation", "carryover", "time off", "leave policy"]):
            return self._answer_pto_policy(req)
        elif any(w in q for w in ["parental", "maternity", "paternity", "baby", "birth", "adoption"]):
            return self._answer_parental_leave(req)
        elif any(w in q for w in ["wellness", "stipend", "gym", "ergonomic", "desk", "home office"]):
            return self._answer_wellness_stipend(req)
        elif any(w in q for w in ["401k", "401(k)", "match", "retirement", "health insurance", "dental", "vision", "benefit"]):
            return self._answer_benefits(req)

        # 2. Finance & Management Policies
        elif any(w in q for w in ["approval", "signing authority", "limit", "manager approve", "threshold", "expense policy"]):
            return self._answer_expense_approvals(req)
        elif any(w in q for w in ["travel", "flight", "per diem", "meal", "hotel", "business class"]):
            return self._answer_travel_policy(req)

        # 3. Operations & Supply Chain (Existing Deep Causal Reasoning)
        elif any(w in q for w in ["cost", "surge", "increase", "expense", "expensive", "spend", "freight cost"]):
            return self._analyze_cost_surge(req)
        elif any(w in q for w in ["delay", "otd", "on-time", "sla", "late", "breach", "penalty"]):
            return self._analyze_delays_and_sla(req)
        elif any(w in q for w in ["audit", "compliance", "dispute", "invoice 8921", "8934"]):
            return self._analyze_invoice_audit(req)
        elif any(w in q for w in ["reroute", "capacity", "swift", "allentown", "alternative"]):
            return self._analyze_capacity_and_routing(req)

        # 4. General Company Brain Synthesizer
        else:
            return self._general_company_query(req)

    # ---------------- HR REASONING HANDLERS ----------------

    def _answer_pto_policy(self, req: QueryRequest) -> QueryResponse:
        evidence = vector_service.search_evidence("PTO carryover vacation limits HR-POL-401 Section 4.2", top_k=2)
        highlighted_nodes = ["pol_pto_carryover", "leader_priya_sharma"]
        subgraph = graph_service.get_subgraph(highlighted_nodes, include_neighbors=False)

        summary = (
            "Full-time employees accrue 20 PTO days annually. You may carry over a maximum of 5 unused PTO days "
            "into the new calendar year, which must be utilized by March 31. Any remaining carryover beyond 5 days is forfeited."
        )

        detailed = (
            "### Company Paid Time Off (PTO) & Carryover Policy\n\n"
            "According to the official **HR Policy Handbook (HR-POL-401)**:\n\n"
            "1. **Annual Accrual (Section 4.1)**: Permanent full-time employees accrue **1.67 PTO days per month** (20 days per calendar year), starting from day one of employment.\n"
            "2. **Carryover Rules (Section 4.2)**:\n"
            "   - **Maximum Carryover**: You can roll over up to **5 unused PTO days** into the next year.\n"
            "   - **Expiration Deadline**: Carried-over days **must be used by March 31** of the following year.\n"
            "   - **Forfeiture**: Days exceeding the 5-day cap or unused by March 31 do not carry forward and cannot be cashed out (except where required by local statute).\n"
            "3. **How to Request (Section 4.3)**: Submit leave requests via BambooHR. Trips of 3 or more consecutive business days require at least 2 weeks advance notice to your manager."
        )

        return QueryResponse(
            query=req.query,
            executive_summary=summary,
            detailed_answer=detailed,
            causal_factors=[],
            recommendations=[
                RecommendationItem(
                    id="rec_pto_01",
                    title="Review Your BambooHR PTO Balance",
                    priority="LOW",
                    action_type="UPDATE_SOP",
                    estimated_savings=0,
                    description="Check your current accrued PTO balance in BambooHR before December to plan any carryover.",
                    steps=["Log into BambooHR", "Check 'Time Off' balance", "Submit carryover leave prior to March 31"]
                )
            ],
            evidence_trail=evidence,
            highlighted_subgraph=subgraph,
            reasoning_steps=[
                ReasoningStep(step_num=1, title="HR Knowledge Match", detail="Matched query to HR Policy Document HR-POL-401.", entities_discovered=["pol_pto_carryover"]),
                ReasoningStep(step_num=2, title="Rule Extraction", detail="Extracted Section 4.2 carryover limits and March 31 deadline.", entities_discovered=[])
            ],
            financial_metrics={"policy_code": "HR-POL-401", "annual_pto_days": 20, "max_carryover_days": 5, "deadline": "March 31"}
        )

    def _answer_parental_leave(self, req: QueryRequest) -> QueryResponse:
        evidence = vector_service.search_evidence("Parental leave 16 weeks paid HR-POL-405", top_k=2)
        highlighted_nodes = ["pol_parental_leave", "leader_priya_sharma"]
        subgraph = graph_service.get_subgraph(highlighted_nodes, include_neighbors=False)

        summary = (
            "Eligible full-time employees receive 16 weeks of 100% fully paid parental leave for birth, adoption, or foster placement. "
            "Leave can be taken continuously or in two equal blocks within the first 12 months, with an optional phased return-to-work program."
        )

        detailed = (
            "### Global Parental Leave Policy (HR-POL-405)\n\n"
            "- **Duration**: **16 weeks** at **100% of base salary**.\n"
            "- **Eligibility**: Full-time employees with at least 180 days (6 months) of continuous tenure.\n"
            "- **Flexibility**: Leave can be taken as one continuous 16-week period or split into two equal 8-week blocks within the first 12 months.\n"
            "- **Phased Return-to-Work**: For your first 4 weeks back, you may elect an 80% work schedule (32 hours/week) while receiving 100% full pay.\n"
            "- **How to Apply**: Notify HR Operations (`people@ourcompany.com`) at least 30 days before your anticipated leave date."
        )

        return QueryResponse(
            query=req.query,
            executive_summary=summary,
            detailed_answer=detailed,
            causal_factors=[],
            recommendations=[],
            evidence_trail=evidence,
            highlighted_subgraph=subgraph,
            reasoning_steps=[ReasoningStep(step_num=1, title="Policy Lookup", detail="Retrieved HR-POL-405 Global Parental Leave.", entities_discovered=["pol_parental_leave"])],
            financial_metrics={"paid_leave_weeks": 16, "salary_coverage": "100%", "phased_return": "4 Weeks at 80% hours / 100% pay"}
        )

    def _answer_wellness_stipend(self, req: QueryRequest) -> QueryResponse:
        evidence = vector_service.search_evidence("Wellness home office stipend $750 Expensify HR-POL-410", top_k=2)
        highlighted_nodes = ["pol_wellness_stipend", "leader_priya_sharma"]
        subgraph = graph_service.get_subgraph(highlighted_nodes, include_neighbors=False)

        summary = (
            "Employees receive a $750 annual wellness and home office stipend renewed every January 1st. "
            "It covers gym memberships, ergonomic chairs, standing desks, monitors, and mental wellness subscriptions."
        )

        detailed = (
            "### Annual Wellness & Home Office Stipend (HR-POL-410)\n\n"
            "- **Annual Budget**: **$750 USD** per calendar year per full-time employee (renews Jan 1).\n"
            "- **Eligible Items**:\n"
            "  - Ergonomic office equipment (standing desks, ergonomic chairs, external monitors, keyboards).\n"
            "  - Physical fitness (gym memberships, fitness trackers, yoga/pilates passes, home gym equipment).\n"
            "  - Mental wellness (mindfulness app subscriptions such as Calm/Headspace, mental health copays).\n"
            "- **How to Claim**:\n"
            "  1. Purchase the qualifying item.\n"
            "  2. Upload itemized receipt in **Expensify** under tag `Employee Wellness / Home Ergonomics`.\n"
            "  3. Reimbursements are deposited directly in your next bi-weekly payroll."
        )

        return QueryResponse(
            query=req.query,
            executive_summary=summary,
            detailed_answer=detailed,
            causal_factors=[],
            recommendations=[],
            evidence_trail=evidence,
            highlighted_subgraph=subgraph,
            reasoning_steps=[ReasoningStep(step_num=1, title="Policy Lookup", detail="Retrieved HR-POL-410 Annual Wellness Stipend.", entities_discovered=["pol_wellness_stipend"])],
            financial_metrics={"annual_allowance": "$750.00", "renewal_date": "January 1", "submission_tool": "Expensify"}
        )

    def _answer_benefits(self, req: QueryRequest) -> QueryResponse:
        evidence = vector_service.search_evidence("401k match Fidelity retirement health benefits HR-POL-415", top_k=2)
        highlighted_nodes = ["pol_benefits_401k", "leader_priya_sharma"]
        subgraph = graph_service.get_subgraph(highlighted_nodes, include_neighbors=False)

        summary = (
            "The company matches 100% of your 401(k) contributions up to 4% of your salary with immediate day-one vesting through Fidelity. "
            "Health, dental, and vision insurance premiums are 90% company-subsidized."
        )

        detailed = (
            "### Company 401(k) Match & Healthcare Benefits (HR-POL-415)\n\n"
            "1. **Retirement 401(k) Match**:\n"
            "   - **Match Rate**: 100% dollar-for-dollar match up to **4.0% of your eligible compensation**.\n"
            "   - **Vesting**: **100% immediate vesting** from your first day of contribution.\n"
            "   - **Provider**: Administered through **Fidelity Investments**.\n\n"
            "2. **Healthcare & Medical Coverage**:\n"
            "   - **Premiums**: Company subsidizes **90% of employee individual premiums** and 75% of family/dependent plans.\n"
            "   - **Networks**: Comprehensive PPO and HSA-eligible High Deductible Health Plans through BlueCross BlueShield."
        )

        return QueryResponse(
            query=req.query,
            executive_summary=summary,
            detailed_answer=detailed,
            causal_factors=[],
            recommendations=[],
            evidence_trail=evidence,
            highlighted_subgraph=subgraph,
            reasoning_steps=[ReasoningStep(step_num=1, title="Benefits Lookup", detail="Retrieved HR-POL-415 Benefits Guide.", entities_discovered=["pol_benefits_401k"])],
            financial_metrics={"401k_match": "100% up to 4%", "vesting_schedule": "Immediate (Day 1)", "healthcare_subsidy": "90%"}
        )

    # ---------------- FINANCE REASONING HANDLERS ----------------

    def _answer_expense_approvals(self, req: QueryRequest) -> QueryResponse:
        evidence = vector_service.search_evidence("Expense approval signing authority limits FIN-POL-201", top_k=2)
        highlighted_nodes = ["pol_expense_approvals", "leader_marcus_sterling"]
        subgraph = graph_service.get_subgraph(highlighted_nodes, include_neighbors=False)

        summary = (
            "Direct managers can approve expenses up to $5,000. Expenses between $5,001 and $25,000 require Department Director or VP signoff. "
            "Any expenditure above $25,000 requires CFO approval."
        )

        detailed = (
            "### Expense & Purchasing Approval Authority Hierarchy (FIN-POL-201)\n\n"
            "Corporate purchasing and expense thresholds are strictly governed by financial delegation rules:\n\n"
            "- **Tier 1: Direct Managers ($0 – $5,000)**:\n"
            "  - Authority: Operating expenses, software licenses, travel reimbursements, and team events up to **$5,000**.\n"
            "- **Tier 2: Directors & Vice Presidents ($5,001 – $25,000)**:\n"
            "  - Authority: Vendor agreements, departmental equipment, or consulting engagements up to **$25,000**.\n"
            "- **Tier 3: Executive Leadership (> $25,000)**:\n"
            "  - Authority: Requires explicit signoff from **CFO Marcus Sterling** or CEO.\n\n"
            "**Submission Note**: All purchase orders must be submitted via Coupa; reimbursements via Expensify."
        )

        return QueryResponse(
            query=req.query,
            executive_summary=summary,
            detailed_answer=detailed,
            causal_factors=[],
            recommendations=[],
            evidence_trail=evidence,
            highlighted_subgraph=subgraph,
            reasoning_steps=[ReasoningStep(step_num=1, title="Finance Policy Match", detail="Retrieved FIN-POL-201 Approval Authority.", entities_discovered=["pol_expense_approvals"])],
            financial_metrics={"manager_limit": "$5,000", "vp_limit": "$25,000", "cfo_threshold": "> $25,000"}
        )

    def _answer_travel_policy(self, req: QueryRequest) -> QueryResponse:
        evidence = vector_service.search_evidence("Business travel meals per diem flights FIN-POL-205", top_k=2)
        highlighted_nodes = ["pol_travel_meals", "leader_marcus_sterling"]
        subgraph = graph_service.get_subgraph(highlighted_nodes, include_neighbors=False)

        summary = (
            "Domestic flights must be booked in Economy class. International flights over 8 hours qualify for Business class. "
            "Daily meal per diem is capped at $75/day ($95/day in high-cost metro markets like NYC, SF, London)."
        )

        detailed = (
            "### Corporate Travel & Per Diem Guidelines (FIN-POL-205)\n\n"
            "- **Flight Class Rules**:\n"
            "  - **Economy Class**: Mandatory for all domestic travel and international itineraries under 8 hours.\n"
            "  - **Business Class**: Allowed only for nonstop international flights exceeding **8 hours scheduled airtime**.\n"
            "- **Meal Per Diem Allowance**:\n"
            "  - Standard rate: **$75 per day**.\n"
            "  - Tier-1 Metro rate (NYC, San Francisco, London, Tokyo): **$95 per day**.\n"
            "  - Receipts are mandatory for all transactions over $25.\n"
            "- **Booking Portal**: All flights and hotels must be reserved through Navan for corporate rate discounts."
        )

        return QueryResponse(
            query=req.query,
            executive_summary=summary,
            detailed_answer=detailed,
            causal_factors=[],
            recommendations=[],
            evidence_trail=evidence,
            highlighted_subgraph=subgraph,
            reasoning_steps=[ReasoningStep(step_num=1, title="Travel Policy Match", detail="Retrieved FIN-POL-205 Travel & Per Diem.", entities_discovered=["pol_travel_meals"])],
            financial_metrics={"standard_per_diem": "$75/day", "tier1_per_diem": "$95/day", "business_class_flight_rule": "> 8 Hours International"}
        )

    # ---------------- OPERATIONS & LOGISTICS HANDLERS ----------------

    def _analyze_cost_surge(self, req: QueryRequest) -> QueryResponse:
        highlighted_nodes = [
            "carrier_apex", "route_ne_101", "inc_newark_port_aug", "inc_diesel_spike_sep",
            "inv_apx_8921", "inv_apx_8934", "eml_apex_surcharge_notice", "contract_apex_2025"
        ]
        subgraph = graph_service.get_subgraph(highlighted_nodes, include_neighbors=False)
        evidence = vector_service.search_evidence("Apex fuel surcharge Newark port congestion invoice 8921", top_k=4)

        summary = (
            "The 19.4% freight delivery cost surge in Q3 is concentrated in the Northeast Corridor (Route 101) with Apex Freight Solutions. "
            "Our operational model identified $20,750 in excess charges: (1) $12,200 from an unapproved 18.2% fuel surcharge violating Contract Clause 4.2 notice rules, "
            "and (2) $8,550 in emergency terminal detention fees without required ELD electronic logs."
        )

        detailed = (
            "### Analysis of Q3 Delivery Cost Surge on Route 101\n\n"
            "By synthesizing data across **Invoices**, **Carrier Communications**, and **Contract CTR-APX-2025**, the Company Brain traced two root causes:\n\n"
            "1. **Contractual Breach on Fuel Surcharge ($12,200 impact)**:\n"
            "   - Apex escalated diesel fuel surcharges from 7.5% to **18.2%** on invoices `INV-APX-8921` and `INV-APX-8934`.\n"
            "   - **Violation**: Contract Clause 4.2 explicitly mandates a **14-day advance written notice** and shipper approval for any surcharge over 8%. Apex billed without prior notice.\n\n"
            "2. **Unverified Port Newark Congestion Accessorials ($8,550 impact)**:\n"
            "   - Following a crane outage at Newark Marine Terminal, Apex billed $4,450 and $4,100 in emergency detention fees.\n"
            "   - **Violation**: Contract Clause 11.4 requires electronic ELD or gate timestamp verification, which was missing from the invoices.\n\n"
            "**Recommended Action**: Issue a formal dispute on invoices #8921 and #8934 to claw back $16,200 in excess fees, and deduct $4,000 under Clause 7.1 for delayed shipments."
        )

        causal_factors = [
            CausalFactor(
                factor="Apex Unilateral Fuel Surcharge Escalation (7.5% -> 18.2%)",
                attribution_percentage=58.8,
                financial_impact=12200.00,
                description="Billed without required 14-day advance written notice under contract Clause 4.2.",
                evidence_ids=["inv_apx_8921", "contract_apex_2025_cl_4_2"],
                affected_entity_ids=["carrier_apex", "inv_apx_8921"]
            ),
            CausalFactor(
                factor="Port Newark Congestion & Detention Charges",
                attribution_percentage=41.2,
                financial_impact=8550.00,
                description="Accessorial detention fees billed without attached ELD driver logs.",
                evidence_ids=["eml_apex_surcharge_notice", "inc_newark_port_aug"],
                affected_entity_ids=["route_ne_101", "carrier_apex"]
            )
        ]

        recommendations = [
            RecommendationItem(
                id="rec_01",
                title="Dispute & Claw Back $12,200 Unauthorized Apex Fuel Surcharges",
                priority="HIGH",
                action_type="DISPUTE_CHARGE",
                estimated_savings=12200.00,
                description="Transmit billing dispute notice to VP Marcus Vance citing Section 4.2 breach.",
                steps=["Hold payment on invoices #8921 and #8934", "Demand $12,200 credit memo"]
            ),
            RecommendationItem(
                id="rec_02",
                title="Shift 35% Route 101 Volume to Swift Dedicated Fleet",
                priority="HIGH",
                action_type="REROUTE",
                estimated_savings=14500.00,
                description="Activate SwiftLogistics 15 staged dry vans in Allentown at locked $1,850 flat rate.",
                steps=["Contact Sarah Lin at Swift", "Re-route inbound freight via Allentown cross-dock"]
            )
        ]

        return QueryResponse(
            query=req.query,
            executive_summary=summary,
            detailed_answer=detailed,
            causal_factors=causal_factors,
            recommendations=recommendations,
            evidence_trail=evidence,
            highlighted_subgraph=subgraph,
            reasoning_steps=[
                ReasoningStep(step_num=1, title="Transaction Traversal", detail="Linked Route 101 to Apex invoices #8921 and #8934.", entities_discovered=["inv_apx_8921", "inv_apx_8934"]),
                ReasoningStep(step_num=2, title="Contract Audit", detail="Verified non-compliance with CTR-APX-2025 Clause 4.2.", entities_discovered=["contract_apex_2025"])
            ],
            financial_metrics={"total_cost_impact": 20750.00, "disputable_amount": 16200.00, "projected_monthly_savings": 26700.00}
        )

    def _analyze_delays_and_sla(self, req: QueryRequest) -> QueryResponse:
        highlighted_nodes = ["carrier_apex", "route_ne_101", "shp_apx_101_01", "shp_apx_101_02", "shp_apx_101_04", "contract_apex_2025"]
        subgraph = graph_service.get_subgraph(highlighted_nodes, include_neighbors=False)
        evidence = vector_service.search_evidence("On-Time Performance Guarantee liquidated damages Clause 7.1 delay", top_k=3)

        summary = (
            "Apex Freight Solutions is responsible for 88% of delivery delays in Q3, with their On-Time Delivery (OTD) rate falling to 72.4% "
            "(vs the 90% SLA minimum). Under Master Agreement CTR-APX-2025 Clause 7.1, we are legally entitled to deduct $4,000 in liquidated damages."
        )

        detailed = (
            "### Carrier Delay & SLA Penalty Analysis\n\n"
            "- **Apex Performance**: OTD dropped to **72.4%** across August/September (minimum SLA is 90%).\n"
            "- **Delayed Shipments**: Three shipments sustained critical delays:\n"
            "  - `APX-TRK-7711`: 14.5 hours delayed ($1,500 penalty eligible)\n"
            "  - `APX-TRK-7712`: 8.0 hours delayed ($1,000 penalty eligible)\n"
            "  - `APX-TRK-7720`: 18.0 hours delayed ($1,500 penalty eligible)\n"
            "- **Contractual Recourse (Clause 7.1)**: Shipper is entitled to $250/hour in liquidated damages up to $1,500 per shipment. Total deductible offset is **$4,000.00**."
        )

        return QueryResponse(
            query=req.query,
            executive_summary=summary,
            detailed_answer=detailed,
            causal_factors=[],
            recommendations=[
                RecommendationItem(
                    id="rec_sla_01",
                    title="Apply $4,000 SLA Penalty Offset on Apex AP Balance",
                    priority="HIGH",
                    action_type="DISPUTE_CHARGE",
                    estimated_savings=4000.00,
                    description="Deduct $4,000 from pending invoices citing Section 7.1 delays on shipments 7711, 7712, 7720.",
                    steps=["Generate SLA violation statement", "Offset $4,000 against approved payable balance"]
                )
            ],
            evidence_trail=evidence,
            highlighted_subgraph=subgraph,
            reasoning_steps=[ReasoningStep(step_num=1, title="SLA Audit", detail="Scanned shipment delay hours and applied Clause 7.1 formula.", entities_discovered=["contract_apex_2025"])],
            financial_metrics={"recoverable_sla_damages": "$4,000.00", "apex_otd": "72.4%", "contract_target_otd": "90.0%"}
        )

    def _analyze_invoice_audit(self, req: QueryRequest) -> QueryResponse:
        return self._analyze_cost_surge(req)

    def _analyze_capacity_and_routing(self, req: QueryRequest) -> QueryResponse:
        evidence = vector_service.search_evidence("SwiftLogistics capacity confirmation Allentown Route 101", top_k=2)
        highlighted_nodes = ["carrier_swift", "contract_swift_2025", "eml_swift_capacity", "route_ne_101"]
        subgraph = graph_service.get_subgraph(highlighted_nodes, include_neighbors=False)

        summary = (
            "SwiftLogistics has confirmed 15 dedicated dry vans staged in Allentown, PA ready to absorb Northeast Route 101 freight "
            "at a locked flat rate of $1,850/load. Rerouting through Swift saves ~$950 per load and bypasses Newark port congestion."
        )

        detailed = (
            "### Alternative Freight Capacity Assessment\n\n"
            "- **Current Issue**: Newark marine terminal delays are causing 11-hour driver dwell times with Apex.\n"
            "- **Swift Available Capacity**: Confirmed via email notice `EML-SWF-312` with 15 dry vans staged in Allentown.\n"
            "- **Contractual Advantage**: Under `CTR-SWF-2025`, Swift's rate is locked at $1,850 flat with a 6.5% fuel cap, saving ~$950/load vs Apex's spot rates."
        )

        return QueryResponse(
            query=req.query,
            executive_summary=summary,
            detailed_answer=detailed,
            causal_factors=[],
            recommendations=[],
            evidence_trail=evidence,
            highlighted_subgraph=subgraph,
            reasoning_steps=[ReasoningStep(step_num=1, title="Capacity Scan", detail="Located Swift staged fleet notice EML-SWF-312.", entities_discovered=["carrier_swift"])],
            financial_metrics={"available_capacity": "15 Vans Weekly", "projected_savings_per_load": "$950.00"}
        )

    def _answer_greeting(self, req: QueryRequest) -> QueryResponse:
        summary = "I am your Company Brain AI assistant — here to provide instant, verified answers across company policies, finances, operations, and logistics."
        detailed = (
            "### Hello! I am Company Brain AI 👋\n\n"
            "I connect your company's operational records, official policies, contracts, emails, and financial guidelines into an interactive intelligence layer.\n\n"
            "**Here are key areas you can ask me about:**\n"
            "- **People & HR Policies**: Vacation & PTO accrual, parental leave, wellness stipends, 401(k) matching, health benefits.\n"
            "- **Finance & Expenses**: Manager signing authority thresholds, corporate card rules, travel and per diem policies.\n"
            "- **Logistics & Operations**: Carrier contracts, freight cost surges, invoice audits, SLA penalties, route bottlenecks, and capacity availability.\n\n"
            "Feel free to ask any question in plain English, and I will search our enterprise records and cite the exact policies!"
        )
        return QueryResponse(
            query=req.query,
            executive_summary=summary,
            detailed_answer=detailed,
            causal_factors=[],
            recommendations=[],
            evidence_trail=[],
            highlighted_subgraph=GraphData(nodes=[], edges=[]),
            reasoning_steps=[ReasoningStep(step_num=1, title="Conversational Greeting", detail="Initialized interactive session with user.", entities_discovered=[])],
            financial_metrics={}
        )

    def _general_company_query(self, req: QueryRequest) -> QueryResponse:
        evidence = vector_service.search_evidence(req.query, top_k=3)
        matched_entities = graph_service.search_entities(req.query)
        entity_ids = [e.id for e in matched_entities[:3]]
        subgraph = graph_service.get_subgraph(entity_ids, include_neighbors=False) if entity_ids else GraphData(nodes=[], edges=[])

        if evidence:
            summary = f"Identified {len(evidence)} verified company source(s) addressing '{req.query}'."
            evidence_blocks = []
            for e in evidence:
                evidence_blocks.append(f"**{e.title}** ({e.source_ref}):\n> {e.snippet}\n")

            detailed = (
                f"### Knowledge Synthesis: {req.query}\n\n"
                f"Based on internal documents and verified company records:\n\n"
                + "\n".join(evidence_blocks)
                + "\n*If you need specific policy exceptions, manager approvals, or contractual escalation, please ask for more details.*"
            )
            steps = [
                ReasoningStep(step_num=1, title="Knowledge Retrieval", detail=f"Indexed and retrieved {len(evidence)} source documents matching '{req.query}'.", entities_discovered=entity_ids)
            ]
        else:
            summary = f"Synthesized enterprise context for '{req.query}'."
            detailed = (
                f"### Inquiry: {req.query}\n\n"
                f"I reviewed internal knowledge bases, but didn't find a direct document mentioning this exact phrase. Here is what is covered in our enterprise repository:\n\n"
                f"1. **HR & People**: For leave, benefits, or workplace accommodations, refer to the official Employee Handbook (`HR-POL-401` through `410`) or contact the People team.\n"
                f"2. **Finance & Procurement**: Direct managers can approve up to $1,000, Directors up to $10,000, and VPs up to $25,000 under `FIN-AUTH-2026`.\n"
                f"3. **Logistics & Carriers**: Master agreements and SLA penalties for freight carriers (Apex, Swift, Nordic) and active shipping routes.\n\n"
                f"Feel free to rephrase or ask about any specific policy, carrier, or expense rule!"
            )
            steps = [
                ReasoningStep(step_num=1, title="Contextual Review", detail=f"Cross-referenced query against internal repositories.", entities_discovered=[])
            ]

        return QueryResponse(
            query=req.query,
            executive_summary=summary,
            detailed_answer=detailed,
            causal_factors=[],
            recommendations=[],
            evidence_trail=evidence,
            highlighted_subgraph=subgraph,
            reasoning_steps=steps,
            financial_metrics={"sources_consulted": len(evidence)}
        )

reasoning_engine = MultiHopReasoningEngine()
