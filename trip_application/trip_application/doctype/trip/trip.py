# Copyright (c) 2023, MazeWorks and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document



class Trip(Document):
    pass
    # def before_save(self):
    #     self.calculate_fuel_expense_amount()

    # def calculate_fuel_expense_amount(self):
    #     for expense_row in self.fuel_expense_child:
    #         if expense_row.diesel_consumed_qty and expense_row.rate_per_litre:
    #             fuel_expense_amount = expense_row.diesel_consumed_qty    * expense_row.rate_per_litre
    #             print(f"Calculated Expense Amount: {fuel_expense_amount}")
    #             expense_row.fuel_expense_amount = fuel_expense_amount
