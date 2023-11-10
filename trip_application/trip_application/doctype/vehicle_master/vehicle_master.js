// // Copyright (c) 2023, MazeWorks and contributors
// // For license information, please see license.txt

frappe.ui.form.on("Vehicle Master", {
    validate: function(frm) {
        var existingDocumentTypes = [];

        // Iterate through child table rows and check for duplicate document_type values
        $.each(frm.doc.vehicle_doc_child_table || [], function(index, row) {
            if (row.document_type) {
                // Check if document_type already exists in the existingDocumentTypes array
                if (existingDocumentTypes.includes(row.document_type)) {
                    frappe.msgprint(__("Duplicate Document Type '{0}' found in the Document Details table. \n Each Document Type must be Unique.", [row.document_type]));
                    frappe.validated = false;
                    return false;
                } else {
                    // Add document_type to the existingDocumentTypes array for future checks
                    existingDocumentTypes.push(row.document_type);
                }
            }
        });
    },
	refresh: function(frm) {
        frm.fields_dict['vehicle_doc_child_table'].grid.get_field('issued_by').get_query = function(doc, cdt, cdn) {
            var child = locals[cdt][cdn];
            if (child.document_type) {
                return {
                    filters: [
                        ['Vehicle Document Issued Master', 'document_type', '=', child.document_type]
                    ]
                };
            } else {
                return {
                    filters: []
                };
            }
        };
    }
});

