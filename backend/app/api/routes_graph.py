from fastapi import APIRouter, HTTPException
from typing import Dict, Any
from app.models.schemas import GraphData
from app.services.graph_service import graph_service

router = APIRouter(prefix="/api/graph", tags=["Graph"])

@router.get("", response_model=GraphData)
def get_knowledge_graph() -> GraphData:
    return graph_service.get_full_graph()

@router.get("/stats")
def get_graph_stats() -> Dict[str, Any]:
    full_graph = graph_service.get_full_graph()
    type_counts = {}
    for n in full_graph.nodes:
        type_counts[n.type] = type_counts.get(n.type, 0) + 1
    
    return {
        "total_nodes": len(full_graph.nodes),
        "total_edges": len(full_graph.edges),
        "node_breakdown": type_counts,
        "active_entities": {
            "carriers": type_counts.get("carrier", 0),
            "invoices": type_counts.get("invoice", 0),
            "contracts": type_counts.get("contract", 0),
            "incidents": type_counts.get("incident", 0),
            "emails": type_counts.get("email", 0),
            "shipments": type_counts.get("shipment", 0),
            "routes": type_counts.get("route", 0)
        }
    }

@router.get("/node/{node_id}")
def get_node_details(node_id: str):
    if not graph_service.graph.has_node(node_id):
        raise HTTPException(status_code=404, detail="Entity node not found")
    data = graph_service.graph.nodes[node_id]
    neighbors = list(graph_service.graph.neighbors(node_id))
    predecessors = list(graph_service.graph.predecessors(node_id))
    return {
        "id": node_id,
        "label": data.get("label"),
        "type": data.get("type"),
        "properties": data.get("properties"),
        "summary": data.get("summary"),
        "connected_out": neighbors,
        "connected_in": predecessors
    }
