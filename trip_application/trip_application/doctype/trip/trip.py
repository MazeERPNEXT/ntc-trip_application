# Copyright (c) 2023, MazeWorks and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document



class Trip(Document):
	pass
# class Trip(Document):
# 	def validate(self):
# 		doc = frappe.get_doc(self)
# 		print(doc,"11111111111111111111111111111111111111111111111111111111111")
# 		if doc.trip_end_date and self.trip_end_date != doc.trip_end_date:
# 			frappe.throw("Cannot update 'Trip End Date'. It is mandatory once set.")

