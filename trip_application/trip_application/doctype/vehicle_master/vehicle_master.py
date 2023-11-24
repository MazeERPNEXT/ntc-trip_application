# Copyright (c) 2023, MazeWorks and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document


class VehicleMaster(Document):
	pass

@frappe.whitelist()
@frappe.validate_and_sanitize_search_inputs
def get_available_vehicles(doctype, txt, searchfield, start, page_len, filters):
    res = frappe.get_all("Vehicle Master",filters={
			"name": ("like", f"%{txt}%"),
            "status": ("Active"),
		})
    
    docs = []
    
    for r in res:
        filter_trip_vehicle = frappe.db.get_value(doctype="Trip", filters={"status": "Started","vehicle_number": r.name}, fieldname=["vehicle_number"])
        if r.name != filter_trip_vehicle:
            docs.append(r.name)

    
    docs = set(list(docs))
    
    return [[d] for d in docs]