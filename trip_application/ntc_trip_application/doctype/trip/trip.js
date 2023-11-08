// // Copyright (c) 2023, MazeWorks and contributors
// // For license information, please see license.txt

frappe.ui.form.on('Trip', {
    setup: (frm) => {

		frm.set_query("vehicle_number", () => {
			return {
				query: "trip_application.ntc_trip_application.doctype.vehicle_master.vehicle_master.get_available_vehicles",
                
			};
		});
	},
    validate: function(frm) {
        var trip_date = frm.doc.trip_date;
        var trip_end_date = frm.doc.trip_end_date;
        var current_date = frappe.datetime.nowdate();

        // Validate To Date against From Date and Current Date
        if (trip_date && trip_end_date) {
            // Convert date strings to JavaScript Date objects for comparison
            var fromDateObj = new Date(trip_date);
            var toDateObj = new Date(trip_end_date);
            var currentDateObj = new Date(current_date);

            // Compare dates and show an error message if To Date is earlier than From Date
            if (toDateObj < fromDateObj) {
                frappe.msgprint('"Trip End Date" cannot be earlier than "Trip Start Date".');
                frappe.validated = false;
            }

            // Show an error message if To Date is before the current date
            // if (toDateObj < currentDateObj) {
            //     frappe.msgprint('Trip End Date cannot be in the past.');
            //     frappe.validated = false;
            // }
        }
    }
    
});




