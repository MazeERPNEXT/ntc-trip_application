# Copyright (c) 2023, MazeWorks and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document


class DocumentDetailsChildTable(Document):
	pass

# document_details_child_table.py

	# def validate(self):
	# 	for row in self.get("vehicle_doc_child_table"):
    #     	# Check if document_type field is set in the child table row
	# 		print(self)
	# 		if row.document_type:
    #         	# Filter issued_by field options based on the selected document_type
	# 			issued_by_options = frappe.get_all("Your Issued By Doctype", filters={"document_type": row.document_type}, fields=["name"])
	# 			row.set("issued_by_options", issued_by_options)

