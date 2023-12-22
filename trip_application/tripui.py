import requests
import json
import frappe
import locale
from frappe.utils import now_datetime, nowdate, today
from frappe import db
from datetime import datetime


@frappe.whitelist()
def workspace():
    # Execute the SQL query using Frappe Database API
    doctype = "Trip"
    current_filters = {"status": "Open"}
    fields = ['name', 'vehicle_number', 'purpose', 'trip_amount', 'status']

    result = frappe.get_list(
        doctype,
        fields=fields,
        filters=current_filters,
        limit=50,
    )

    # Get the current date
    current_date = today()
    print(f"Total Kilometers: {current_date}")

    # Query to count trips for today
    current_date_query = """
        SELECT COUNT(trip_date) AS today_count
        FROM `tabTrip`
        WHERE DATE(trip_date) = CURDATE()
    """

    today_count_result = frappe.db.sql(current_date_query)
    today_counts = today_count_result[0][0] if today_count_result else 0

    # Count total trips
    total_count = frappe.db.count('Trip')

    # Set the current date and time to 00:00:00
    start_of_today = today() + " 00:00:00"
    current_datetime = now_datetime()
    print(f'Current Date and Time: {current_datetime}')

    # Query to count trips with a date filter for the current date
    today_count = db.count('Trip', filters={'trip_date': ['>=', start_of_today]})

    # Count trips with status 'Started'
    Trip_status_count = frappe.db.count('Trip', filters={'status': 'Started'})
    Vehicle_Master_status_count = frappe.db.count('Vehicle Master', filters={'status': 'Active'})
    Driver_Master_status_count = frappe.db.count('Driver Master', filters={'status': 'Active'})
    Utilized_vehicle = Trip_status_count
    Un_Utilized_vehicle = Vehicle_Master_status_count - Utilized_vehicle

    # Get a list of trips with specific fields
    invoices = frappe.get_list('Trip', fields=['name', 'vehicle_number', 'purpose', 'trip_amount', 'status'])

    today_status_count = frappe.get_list(
        'Trip',
        fields=['trip_amount', 'no_of_kms'],
        filters={'trip_date': ['>=', start_of_today]}
    )

    # Count the number of vehicles
    vehicle_count = frappe.db.count('Vehicle Master')
    In_Active_vehicle = vehicle_count - Vehicle_Master_status_count
    In_Active_Driver = frappe.db.count('Driver Master', filters={'status': 'In Active'})

    # Calculate total amount and total kilometers
    total_amount = sum(float(invoice.get('trip_amount', 0)) for invoice in invoices)
    total_kms = sum(float(invoice.get('no_of_kms', 0)) for invoice in invoices)
    today_amount = sum(float(invoice.get('trip_amount', 0)) for invoice in today_status_count)
    today_kms = sum(float(invoice.get('no_of_kms', 0)) for invoice in today_status_count)
    invoices_list = frappe.get_list('Trip', fields=['name', 'vehicle_number', 'purpose', 'trip_amount', 'status'])
    total_records = len(invoices_list)
    html_table = '<table class="table"><thead class="bg-light"><tr>'
    html_table += '<th>Trip ID</th><th>Vehicle Number</th><th>Purpose</th><th>Trip Amount</th><th>Status</th></tr></thead><tbody>'

    # Iterate through invoices and append to the HTML table
    for invoice in invoices_list:
        html_table += '<tr>'
        html_table += f'<td><div class="d-flex align-items-center"><div class="table-user-name"><p class="mb-0 font-weight-medium">{invoice.get("name")}</p></div></div></td>'
        html_table += f'<td>{invoice.get("vehicle_number")}</td>'
        html_table += f'<td>{invoice.get("purpose")}</td>'
        # Set the locale to India
        amount = invoice.get("trip_amount")
        # Format the trip amount as Indian currency
        formatted_amount = f'₹ {amount:,.2f}'

        html_table += f'<td>{formatted_amount}</td>'
        status = invoice.get("status")
        status_class = "badge-inverse-success" if status == "Completed" else "badge-inverse-danger"

        html_table += f'<td><div class="badge {status_class}">{status}</div></td>'
      
        html_table += '</tr>'

    # Close the HTML table
    html_table += '</tbody></table>'

    # Display the HTML table using frappe.msgprint
    


    return total_amount, total_count, total_kms, vehicle_count, today_amount, today_count, today_kms, \
           Vehicle_Master_status_count, Driver_Master_status_count, Utilized_vehicle, In_Active_vehicle, \
           In_Active_Driver, Un_Utilized_vehicle, html_table
