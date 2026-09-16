"""
Comprehensive Seed Dataset for AI-Company Brain
Covers multi-department enterprise domains:
- HR & People (PTO, Parental Leave, Benefits, Wellness, Remote Work)
- Finance & Travel (Expense Approvals, Reimbursement Limits, Per Diem)
- Operations & Logistics (Carriers, Invoices, Delivery Delays, SLA Penalties)
- Org Structure (Leadership, Department Heads)
"""

SEED_DATA = {
    # ---------------- HR & PEOPLE POLICIES ----------------
    "hr_policies": [
        {
            "id": "pol_pto_carryover",
            "doc_ref": "HR-POL-401",
            "title": "Paid Time Off (PTO) & Carryover Policy",
            "category": "HR & People",
            "summary": "Standard full-time employees accrue 20 PTO days per year. A maximum of five (5) unused PTO days may be carried over into the next calendar year, which must be utilized by March 31. Any additional unused PTO days expire without payout unless required by local labor law.",
            "clauses": [
                {"section": "4.1", "title": "Annual Accrual", "text": "Full-time employees accrue 1.67 PTO days per month (20 days annually), effective from day 1 of employment."},
                {"section": "4.2", "title": "Carryover Limits", "text": "A maximum of five (5) accrued, unused PTO days may be rolled over into the next calendar year. Carried-over days must be taken before March 31st of the subsequent year, after which they are forfeited."},
                {"section": "4.3", "title": "Manager Advance Notice", "text": "PTO requests for three (3) or more consecutive days require at least two weeks advance written notice via BambooHR."}
            ]
        },
        {
            "id": "pol_parental_leave",
            "doc_ref": "HR-POL-405",
            "title": "Global Parental Leave Policy",
            "category": "HR & People",
            "summary": "Provides 16 weeks of 100% paid parental leave for all new parents (birth, adoption, or foster placement) after 6 months of continuous service. Can be taken continuously or in two equal blocks within 12 months of the child's arrival.",
            "clauses": [
                {"section": "5.1", "title": "Eligibility & Duration", "text": "All full-time employees with at least 180 days of tenure are entitled to sixteen (16) consecutive or split weeks of fully paid parental leave at 100% base salary."},
                {"section": "5.2", "title": "Phased Return-to-Work", "text": "Returning parents may elect an 80% reduced schedule (32 hours/week) for their first 4 weeks back at full 100% pay to support family transition."}
            ]
        },
        {
            "id": "pol_wellness_stipend",
            "doc_ref": "HR-POL-410",
            "title": "Annual Wellness & Home Office Stipend",
            "category": "HR & People",
            "summary": "Employees receive a $750 annual tax-free wellness and home office stipend. Eligible expenses include gym memberships, ergonomics, standing desks, mental health apps, and fitness equipment.",
            "clauses": [
                {"section": "8.1", "title": "Annual Allowance", "text": "Every permanent full-time employee is eligible for an annual allowance of $750 USD, renewed on January 1 of each calendar year."},
                {"section": "8.2", "title": "Reimbursement Procedure", "text": "Submit itemized receipts through Expensify under category 'Employee Wellness / Home Ergonomics'. Approvals are processed in bi-weekly payroll cycles."}
            ]
        },
        {
            "id": "pol_benefits_401k",
            "doc_ref": "HR-POL-415",
            "title": "401(k) Retirement Match & Health Benefits",
            "category": "HR & People",
            "summary": "Company matches 100% of employee 401(k) contributions up to 4% of base compensation, with immediate 100% vesting. Comprehensive health, dental, and vision premiums are 90% company-subsidized.",
            "clauses": [
                {"section": "2.1", "title": "401(k) Match", "text": "Company provides dollar-for-dollar 401(k) matching up to 4.0% of eligible gross earnings, administered through Fidelity. Vesting is 100% immediate from day one."},
                {"section": "2.2", "title": "Medical Coverage", "text": "Tier-1 PPO and HDHP health plans provided through BlueCross BlueShield. 90% of individual and 75% of dependent health premiums paid by company."}
            ]
        }
    ],

    # ---------------- FINANCE & TRAVEL POLICIES ----------------
    "finance_policies": [
        {
            "id": "pol_expense_approvals",
            "doc_ref": "FIN-POL-201",
            "title": "Corporate Expense & Purchasing Approval Authority",
            "category": "Finance & Procurement",
            "summary": "Defines approval thresholds: Direct Managers approve expenses up to $5,000; Department Directors/VPs approve up to $25,000; CFO or CEO approval required for purchases exceeding $25,000.",
            "clauses": [
                {"section": "3.1", "title": "Manager Approval Limit ($0 - $5,000)", "text": "Direct managers have signing authority for operational expenses and travel reimbursements up to $5,000 USD per occurrence."},
                {"section": "3.2", "title": "Director & VP Authority ($5,001 - $25,000)", "text": "Expenses between $5,001 and $25,000 require written authorization from the Department Vice President or functional Director."},
                {"section": "3.3", "title": "Executive Authority (> $25,000)", "text": "All contracts, purchase orders, or capital expenditures exceeding $25,000 must be signed off by the Chief Financial Officer (CFO) or CEO."}
            ]
        },
        {
            "id": "pol_travel_meals",
            "doc_ref": "FIN-POL-205",
            "title": "Business Travel, Flights & Per Diem Policy",
            "category": "Finance & Procurement",
            "summary": "Economy class is mandatory for domestic flights and international flights under 8 hours. Daily meal per diem is capped at $75/day ($95/day in high-cost cities like NYC, London, SF). Receipts required for all expenses over $25.",
            "clauses": [
                {"section": "6.1", "title": "Flight Booking Class", "text": "Domestic air travel must be booked in Economy / Main Cabin class through Navan. Business class is only permitted for non-stop international flights with scheduled flight duration exceeding 8 hours."},
                {"section": "6.2", "title": "Meal Per Diem", "text": "Daily meal reimbursement is capped at $75 per day standard ($95 in tier-1 designated metro areas). Alcohol must be itemized and cannot exceed one beverage per dinner."}
            ]
        }
    ],

    # ---------------- ORG & LEADERSHIP ----------------
    "leadership": [
        {"name": "Elena Ramos", "title": "VP of Supply Chain & Operations", "department": "Operations", "email": "e.ramos@ourcompany.com"},
        {"name": "Marcus Sterling", "title": "Chief Financial Officer (CFO)", "department": "Finance", "email": "m.sterling@ourcompany.com"},
        {"name": "Priya Sharma", "title": "Head of People & HR Operations", "department": "Human Resources", "email": "p.sharma@ourcompany.com"},
        {"name": "David Chen", "title": "Director of Logistics & Distribution", "department": "Operations", "email": "d.chen@ourcompany.com"}
    ],

    # ---------------- OPERATIONS & LOGISTICS ----------------
    "carriers": [
        {
            "id": "carrier_apex",
            "name": "Apex Freight Solutions",
            "code": "APX",
            "tier": "Tier-1 Primary",
            "contact_email": "ops@apexfreight.com",
            "rep_name": "Marcus Vance",
            "on_time_rate": "72.4%",
            "total_spend_q3": 146850,
            "status": "Review Required",
            "contract_id": "contract_apex_2025"
        },
        {
            "id": "carrier_swift",
            "name": "SwiftLogistics Trans",
            "code": "SWF",
            "tier": "Tier-1 Secondary",
            "contact_email": "dispatch@swifttrans.com",
            "rep_name": "Sarah Lin",
            "on_time_rate": "93.8%",
            "total_spend_q3": 89400,
            "status": "Healthy",
            "contract_id": "contract_swift_2025"
        },
        {
            "id": "carrier_nordic",
            "name": "Nordic Transport Co",
            "code": "NOR",
            "tier": "Specialized Reefer",
            "contact_email": "accounts@nordictrans.com",
            "rep_name": "Erik Lindqvist",
            "on_time_rate": "98.1%",
            "total_spend_q3": 62500,
            "status": "Healthy",
            "contract_id": "contract_nordic_2025"
        }
    ],
    
    "contracts": [
        {
            "id": "contract_apex_2025",
            "carrier_id": "carrier_apex",
            "title": "Apex Master Transportation Agreement 2025-2027",
            "doc_ref": "CTR-APX-2025",
            "effective_date": "2025-01-01",
            "expiry_date": "2027-12-31",
            "clauses": [
                {
                    "clause_num": "4.2",
                    "title": "Fuel Surcharge Adjustments",
                    "text": "Fuel surcharges shall be tied directly to the EIA Weekly PADD 1 Diesel Average. Any surcharge increase exceeding 8.0% over base requires a mandatory 14-day advance written notice and formal approval by Shipper Procurement before invoice submission."
                },
                {
                    "clause_num": "7.1",
                    "title": "On-Time Performance Guarantee & Liquidated Damages",
                    "text": "Carrier guarantees a minimum 90% On-Time Delivery (OTD) rate per monthly billing cycle. For delayed shipments exceeding 4 hours without documented catastrophic force majeure, Shipper retains the right to deduct a $250/hour liquidated damages fee up to $1,500 per incident."
                },
                {
                    "clause_num": "11.4",
                    "title": "Accessorial and Detention Fees",
                    "text": "Standard detention free time is two (2) hours at pickup and delivery. Detention charges thereafter shall not exceed $75/hour and require electronic timestamp verification (ELD or gate logs) attached to the corresponding invoice."
                }
            ]
        },
        {
            "id": "contract_swift_2025",
            "carrier_id": "carrier_swift",
            "title": "SwiftLogistics Dedicated Freight SLA",
            "doc_ref": "CTR-SWF-2025",
            "effective_date": "2025-03-01",
            "expiry_date": "2026-03-01",
            "clauses": [
                {
                    "clause_num": "3.1",
                    "title": "Fixed Quarter Cap",
                    "text": "Base rates remain locked with a maximum 3.0% annual index adjustment. Fuel surcharge formula is capped at 6.5%."
                },
                {
                    "clause_num": "6.2",
                    "title": "Capacity Commitment",
                    "text": "Swift guarantees dedicated minimum capacity of 25 weekly dry-van tractor-trailers across Midwest routes."
                }
            ]
        }
    ],

    "routes": [
        {
            "id": "route_ne_101",
            "name": "Northeast Corridor (Route 101)",
            "origin": "Port of Newark, NJ",
            "destination": "Boston Logistics Center, MA",
            "miles": 224,
            "avg_transit_hours": 6.5,
            "primary_carrier_id": "carrier_apex",
            "risk_level": "High - Congestion & Surcharges"
        },
        {
            "id": "route_mw_202",
            "name": "Midwest Auto Belt (Route 202)",
            "origin": "Chicago Rail Yard, IL",
            "destination": "Detroit Assembly Center, MI",
            "miles": 285,
            "avg_transit_hours": 5.8,
            "primary_carrier_id": "carrier_swift",
            "risk_level": "Low - Operational Normal"
        },
        {
            "id": "route_so_303",
            "name": "Southeast Reefer Link (Route 303)",
            "origin": "Savannah Terminal, GA",
            "destination": "Atlanta Cold Hub, GA",
            "miles": 248,
            "avg_transit_hours": 4.5,
            "primary_carrier_id": "carrier_nordic",
            "risk_level": "Moderate - Seasonal Demand"
        }
    ],

    "incidents": [
        {
            "id": "inc_newark_port_aug",
            "title": "Newark Elizabeth Container Terminal System Outage & Gate Backlog",
            "date": "2026-08-14",
            "severity": "CRITICAL",
            "location": "Port of Newark, NJ",
            "description": "Terminal operating system outage combined with crane breakdown created a 4-day dwell time crisis. Trucks queued for up to 11 hours outside terminal gates.",
            "impact": "Triggered widespread emergency port congestion surcharges ($4,450 on single invoices) and 48-hour delivery delays across Northeast Route 101.",
            "affected_route_ids": ["route_ne_101"],
            "affected_carrier_ids": ["carrier_apex"]
        },
        {
            "id": "inc_diesel_spike_sep",
            "title": "EIA PADD 1 Regional Diesel Refinery Maintenance Spike",
            "date": "2026-09-02",
            "severity": "HIGH",
            "location": "Northeast Petroleum District",
            "description": "Unscheduled maintenance at Linden Refinery led to localized diesel price surge (+14.2% in 10 days).",
            "impact": "Apex Freight applied unilateral fuel surcharge escalation from 7.5% to 18.2% without prior 14-day notice required by Contract Clause 4.2.",
            "affected_route_ids": ["route_ne_101"],
            "affected_carrier_ids": ["carrier_apex"]
        }
    ],

    "emails": [
        {
            "id": "eml_apex_surcharge_notice",
            "doc_ref": "EML-APX-881",
            "date": "2026-08-16",
            "sender": "Marcus Vance <m.vance@apexfreight.com>",
            "recipient": "Supply Chain Procurement <procurement@ourcompany.com>",
            "subject": "URGENT: Emergency Port Congestion Surcharge Notification - Newark Marine Terminal",
            "carrier_id": "carrier_apex",
            "content": (
                "Due to unprecedented crane breakdowns and gate system failures at Port Newark Container Terminal, "
                "our drivers are experiencing excessive wait times in excess of 9 hours per container pull. "
                "Effective immediately (August 17, 2026), Apex Freight Solutions is implementing an Emergency Congestion "
                "Surcharge of $350 per container pull and an unbilled detention fee adjustment of $95/hr. "
                "These accessorial fees will reflect on all August and September billing cycles until terminal dwell times normalize."
            ),
            "flags": ["Surcharge Warning", "Contractual Deviation", "Port Congestion"]
        },
        {
            "id": "eml_procurement_dispute",
            "doc_ref": "EML-INT-904",
            "date": "2026-09-05",
            "sender": "Elena Ramos <e.ramos@ourcompany.com>",
            "recipient": "Finance AP Team <ap@ourcompany.com>",
            "subject": "Audit Alert: Apex Freight Invoices INV-APX-8921 and INV-APX-8934 Surcharges",
            "carrier_id": "carrier_apex",
            "content": (
                "Team, please place a temporary payment hold on Apex Freight invoices #8921 and #8934. "
                "Our cross-functional review detected $11,550 in unverified accessorial fees (fuel surcharge surged to 18% "
                "and congestion line item added). Under Master Agreement CTR-APX-2025 Clause 4.2, Apex was obligated to provide "
                "14-day advance notice. Furthermore, their SLA compliance dropped to 72% this month. "
                "We need to dispute these charges and offset against Section 7.1 delay penalties."
            ),
            "flags": ["Payment Hold", "Dispute Notice", "Audit Finding"]
        },
        {
            "id": "eml_swift_capacity",
            "doc_ref": "EML-SWF-312",
            "date": "2026-08-25",
            "sender": "Sarah Lin <s.lin@swifttrans.com>",
            "recipient": "Logistics Dispatch <dispatch@ourcompany.com>",
            "subject": "Available Capacity Confirmation - Route 101 & 202 Secondary Support",
            "carrier_id": "carrier_swift",
            "content": (
                "Following up on our quarterly check-in. SwiftLogistics has 15 additional dry vans staged in Allentown, PA "
                "ready to take overflow freight on the Northeast 101 route at our contracted locked rate ($1,850/load flat). "
                "If your primary carrier is facing terminal bottlenecks, we can route directly through our inland cross-dock."
            ),
            "flags": ["Capacity Offer", "Cost Reduction Opportunity", "Rerouting Option"]
        }
    ],

    "invoices": [
        {
            "id": "inv_apx_8921",
            "doc_ref": "INV-APX-8921",
            "carrier_id": "carrier_apex",
            "carrier_name": "Apex Freight Solutions",
            "invoice_date": "2026-08-31",
            "due_date": "2026-09-30",
            "status": "DISPUTED / PENDING AUDIT",
            "base_freight": 32000.00,
            "fuel_surcharge": 6400.00,
            "congestion_accessorial": 4450.00,
            "total_amount": 42850.00,
            "line_items": [
                {"description": "Freight Transit - Route 101 (16 Loads)", "amount": 32000.00},
                {"description": "Fuel Escalation Surcharge (18.2% vs baseline 7.5%)", "amount": 6400.00, "flag": "VIOLATES_NOTICE_CLAUSE_4_2"},
                {"description": "Emergency Port Congestion Accessorial Surcharge", "amount": 4450.00, "flag": "DISPUTED_UNAUTHORIZED"}
            ],
            "linked_shipment_ids": ["shp_apx_101_01", "shp_apx_101_02", "shp_apx_101_03"],
            "linked_email_ids": ["eml_apex_surcharge_notice", "eml_procurement_dispute"]
        },
        {
            "id": "inv_apx_8934",
            "doc_ref": "INV-APX-8934",
            "carrier_id": "carrier_apex",
            "carrier_name": "Apex Freight Solutions",
            "invoice_date": "2026-09-10",
            "due_date": "2026-10-10",
            "status": "PENDING REVIEW",
            "base_freight": 29000.00,
            "fuel_surcharge": 5800.00,
            "congestion_accessorial": 4100.00,
            "total_amount": 38900.00,
            "line_items": [
                {"description": "Freight Transit - Route 101 (14 Loads)", "amount": 29000.00},
                {"description": "Fuel Escalation Surcharge (18.2%)", "amount": 5800.00, "flag": "VIOLATES_NOTICE_CLAUSE_4_2"},
                {"description": "Terminal Congestion Detention Fees", "amount": 4100.00, "flag": "NO_ELD_LOGS_ATTACHED"}
            ],
            "linked_shipment_ids": ["shp_apx_101_04", "shp_apx_101_05"],
            "linked_email_ids": ["eml_procurement_dispute"]
        },
        {
            "id": "inv_swf_4412",
            "doc_ref": "INV-SWF-4412",
            "carrier_id": "carrier_swift",
            "carrier_name": "SwiftLogistics Trans",
            "invoice_date": "2026-08-28",
            "due_date": "2026-09-28",
            "status": "APPROVED_PAID",
            "base_freight": 21000.00,
            "fuel_surcharge": 2200.00,
            "congestion_accessorial": 0.0,
            "total_amount": 23200.00,
            "line_items": [
                {"description": "Midwest Dedicated Route 202 (12 Loads)", "amount": 21000.00},
                {"description": "Fuel Surcharge (Contract Capped 6.2%)", "amount": 2200.00, "flag": "COMPLIANT"}
            ],
            "linked_shipment_ids": ["shp_swf_202_01", "shp_swf_202_02"],
            "linked_email_ids": []
        }
    ],

    "shipments": [
        {
            "id": "shp_apx_101_01",
            "tracking_code": "APX-TRK-7711",
            "carrier_id": "carrier_apex",
            "route_id": "route_ne_101",
            "invoice_id": "inv_apx_8921",
            "date": "2026-08-18",
            "status": "Delayed 14h",
            "delay_hours": 14.5,
            "cause": "Port Newark Terminal Gate Outage",
            "freight_cost": 2650.00,
            "sla_breach": True,
            "sla_penalty_eligible": 1500.00
        },
        {
            "id": "shp_apx_101_02",
            "tracking_code": "APX-TRK-7712",
            "carrier_id": "carrier_apex",
            "route_id": "route_ne_101",
            "invoice_id": "inv_apx_8921",
            "date": "2026-08-20",
            "status": "Delayed 8h",
            "delay_hours": 8.0,
            "cause": "Driver Dwell & Congestion",
            "freight_cost": 2800.00,
            "sla_breach": True,
            "sla_penalty_eligible": 1000.00
        },
        {
            "id": "shp_apx_101_04",
            "tracking_code": "APX-TRK-7720",
            "carrier_id": "carrier_apex",
            "route_id": "route_ne_101",
            "invoice_id": "inv_apx_8934",
            "date": "2026-09-04",
            "status": "Delayed 18h",
            "delay_hours": 18.0,
            "cause": "Refinery Fuel Shortage & Dwell",
            "freight_cost": 2950.00,
            "sla_breach": True,
            "sla_penalty_eligible": 1500.00
        }
    ]
}
