# Copyright (c) 2023, MazeWorks and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document


class DriverMaster(Document):
	pass

@frappe.whitelist()
@frappe.validate_and_sanitize_search_inputs
def get_available_driver(doctype, txt, searchfield, start, page_len, filters):
    res = frappe.get_all("Driver Master",filters={
            "name": ("like", f"%{txt}%"),
            "status": ("Active"),
		})
    print("JJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJ_____")    
    docs = []
    
    for r in res:
            print(r.name, "JJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJ_____")    
            docs.append(r.name)

    
    docs = set(list(docs))
    
    return [[d] for d in docs]

# @frappe.whitelist()
# @frappe.validate_and_sanitize_search_inputs
# def get_available_exp_driver(doctype, txt, searchfield, start, page_len, filters, trip_name=None, driver_name=None):
#     res = frappe.get_all("Driver Master",filters={
# 			"name": ("like", f"%{txt}%"),
#                         "status": ("Active"),
# 		})
    
#     docs = []
    
#     for r in res:
        
#         filter_trip_exp_driver = frappe.db.get_value(doctype="Driver Child Table", filters={"driver_name": r.name}, fieldname=["driver_name"])#filters={"status": "Started","vehicle_number": r.name}, fieldname=["vehicle_number"])
#         print(filter_trip_exp_driver, frappe.db.get_value, "JJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJ_____")    
#         if r.name == filter_trip_exp_driver:
#             docs.append(r.name)

    
#     docs = set(list(docs))
    
#     return [[d] for d in docs]

