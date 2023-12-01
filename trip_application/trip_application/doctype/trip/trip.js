// // Copyright (c) 2023, MazeWorks and contributors
// // For license information, please see license.txt

frappe.ui.form.on('Trip', {
    
    setup: (frm) => {

		frm.set_query("vehicle_number", () => {
			return {
				query: "trip_application.trip_application.doctype.vehicle_master.vehicle_master.get_available_vehicles",
                
			};
		});
        

	},
    validate: function(frm) {
        var trip_date = frm.doc.trip_date;
        var trip_end_date = frm.doc.trip_end_date;
        var current_date = frappe.datetime.nowdate();

        // if (frm.doc.__islocal){
        //     window.location.reload();
        // }    
        
        
        if (trip_date && trip_end_date) {
            
            var fromDateObj = new Date(trip_date);
            var toDateObj = new Date(trip_end_date);
            

            if (toDateObj < fromDateObj) {
                frappe.msgprint('"Trip End Date" cannot be earlier than "Trip Start Date".');
                frappe.validated = false;
            }

        }

        if (frm.doc.driver_details) {
            for (var i = 0; i < frm.doc.driver_details.length; i++) {
                
                var currentDateObj = new Date(); 

                var fromDateObj = new Date(frm.doc.trip_date);
                var toDateObj = (!!frm.doc.driver_details[i].start_date ? new Date(frm.doc.driver_details[i].start_date) : currentDateObj );
                // console.log(toDateObj)
                if (toDateObj < fromDateObj) {
                    frappe.msgprint('"Driver Details-Start Date" cannot be earlier than "Trip Start Date".');
                    frappe.validated = false;
                    return;
                }
            }
        }

        if (frm.doc.expense_type_child) {
            for (var i = 0; i < frm.doc.expense_type_child.length; i++) {
                var fromDateObj = new Date(frm.doc.trip_date);
                var toDateObj = new Date(frm.doc.expense_type_child[i].expense_date);

                if (toDateObj < fromDateObj) {
                    frappe.msgprint('"Expense Type-Date" cannot be earlier than "Trip Start Date".');
                    frappe.validated = false;
                    return;
                }
            }
        }

        if (frm.doc.driver_details) {
            for (var i = 0; i < frm.doc.driver_details.length; i++) {
                
                var currentDateObj = new Date(); 

                var fromDateObj = new Date(frm.doc.driver_details[i].start_date);
                var toDateObj = (!!frm.doc.driver_details[i].end_date ? new Date(frm.doc.driver_details[i].end_date) : currentDateObj );

                if (toDateObj < fromDateObj) {
                    frappe.msgprint('"Driver Details-End Date" cannot be earlier than "Driver Details-Start Date".');
                    frappe.validated = false;
                    return;
                }
            }
        }
        
        

        

        if (frm.doc.no_of_kms === 0 && frm.doc.status != 'Started') {
            frappe.msgprint(__('Zero value is not allowed for "No of KMS"'));
            frappe.validated = false;
            
        }

        

            
    },
    
    after_save: function(frm) {
            window.location.reload();

            
    },

    onload: function(frm) {

        
        
        if (frm.doc.status != "Started") {
        
            frm.toggle_reqd('trip_end_date', !frm.doc.__islocal);
            frm.toggle_reqd('no_of_kms', !frm.doc.__islocal);

        }   
        
        if (frm.doc.status != "Started") {
            frm.set_df_property('status', 'read_only', 1);

        }

        if (frm.doc.status === "Started") {
            frm.set_df_property('no_of_kms', 'read_only', 1);
            frm.set_df_property('trip_end_date', 'read_only', 1);
            frm.set_df_property('trip_remarks', 'read_only', 1);

        }


        if (frm.doc.__islocal) {
            frm.set_df_property('no_of_kms', 'read_only', 1);
            frm.set_df_property('trip_end_date', 'read_only', 1);
            frm.set_df_property('trip_remarks', 'read_only', 1);
        }
        

        if (frm.doc.__islocal) {
            var row = frappe.model.add_child(cur_frm.doc, 'driver_details', 'driver_details');
            
            row.driver_name = ''; 
            row.start_date = null; 
            row.end_date = null; 
            
            refresh_field('driver_details'); 
            
        }
        







    },
    status: function(frm) {
        
        if (frm.doc.status === "Started") {
            frm.set_df_property('no_of_kms', 'read_only', 1);
            frm.set_df_property('trip_end_date', 'read_only', 1);
            frm.set_df_property('trip_remarks', 'read_only', 1);

            frm.toggle_reqd('trip_end_date', frm.doc.status != "Started");
            frm.toggle_reqd('no_of_kms', frm.doc.status != "Started");
            

            frm.fields_dict['driver_details'].grid.toggle_reqd('end_date', frm.doc.status !== 'Started');    
            
            // frm.fields_dict['driver_details'].grid.toggle_display('end_date', frm.doc.status === 'Started');
        
        }

        if (frm.doc.status === "Cancelled") {

            frm.toggle_reqd('no_of_kms', frm.doc.status != "Cancelled");

        }

        
        

        if (frm.doc.status != "Started") {
            frm.set_df_property('no_of_kms', 'read_only', 0);
            frm.set_df_property('trip_end_date', 'read_only', 0);
            frm.set_df_property('trip_remarks', 'read_only', 0);

            frm.toggle_reqd('trip_end_date', frm.doc.__islocal || !frm.doc.__islocal);

            frm.fields_dict['driver_details'].grid.toggle_reqd('end_date', !['Started','Cancelled'].includes(frm.doc.status));
            
        }
           

        if (frm.doc.status != "Cancelled" && frm.doc.status != "Started") {

            frm.toggle_reqd('no_of_kms', frm.doc.__islocal || !frm.doc.__islocal);

        }
        
        

    },

    
    refresh: function(frm) {
        
        frm.fields_dict['driver_details'].grid.get_field('driver_name').get_query = function(doc, cdt, cdn) {
            var child = locals[cdt][cdn];
            
            return {
                filters:[['status','=', "Active"],['name','not in',doc.driver_details.map(d => d.driver_name)]]
            };
        };

        frm.fields_dict['driver_details'].grid.toggle_reqd('end_date', frm.doc.status !== 'Started');    
            
        // frm.fields_dict['driver_details'].grid.toggle_display('end_date', frm.doc.status === 'Started');
        
        
        

        frm.fields_dict['expense_type_child'].grid.get_field('driver_name').get_query = function(doc, cdt, cdn) {
            var child = locals[cdt][cdn];
            return {
                filters: [['name','in', doc.driver_details.map(d => d.driver_name)]]
            };
        };

        
        
        
        
        
        
        
    },

    
    
});





frappe.ui.form.on('Driver Child Table', {
	// onload: function(frm) {
    //     frm.toggle_reqd('end_date', !frm.doc.__islocal);
    // }    
});




frappe.ui.form.on('Trip Expense Type Child Table', {
    expense_amount: function(frm, cdt, cdn) {
        
        var child = locals[cdt][cdn];

        var child_table = frm.doc.expense_type_child || [];
        // console.log(child_table);

        var total_amount = child_table.reduce(function(sum, row) {
            return sum + (row.expense_amount || 0);
        }, 0);

        frappe.model.set_value(frm.doctype, frm.docname, 'trip_amount', total_amount);
    }

});


// frappe.ui.form.on('Driver Child Table', {
//     onload: function(frm) {
//         // Function to add a static row to the child table 'items'
//         function addStaticRow() {
//             var child = frm.add_child('driver_details', {}); // Adding an empty row
//             // Modify properties of the row if needed
//             child.fieldname = 'driver_name'; // Replace 'fieldname' with your actual field name
//             // Set other field values if required
//             // child.field2 = 'value2';
//             // child.field3 = 'value3';
//         }

//         // Check if it's a new document
//         if (frm.doc.__islocal) {
//             // Add a static row to the child table 'items'
//             addStaticRow();
//         }
//     }
// });



