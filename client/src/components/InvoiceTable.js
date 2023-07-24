import React, { useState, useEffect } from "react";

export default function InvoiceTable() {
    const [invoices, setInvoices] = useState([]);

    useEffect(() => {
        getInvoices();
    }, []);

    function getInvoices() {
        fetch("/api/invoices")
            .then(response => response.json())
            .then(invoices => {
                setInvoices(invoices);
            });
    }

    return (
        <table>
            <thead>
                <tr>
                    <th>Number</th>
                    <th>Customer Name</th>
                    <th>Issue Date</th>
                    <th>Due Date</th>
                    <th>Amount Paid</th>
                    <th>Amount Due</th>
                    <th>Status</th>
                </tr>
            </thead>
            <tbody>
                {invoices.map((invoice, invoiceIndex) => (
                    <tr key={invoiceIndex}>
                        <td>{invoice.number}</td>
                        <td>{invoice.customerName}</td>
                        <td>{invoice.issueDate}</td>
                        <td>{invoice.dueDate}</td>
                        <td>{invoice.amountPaid}</td>
                        <td>{invoice.amountDue}</td>
                        <td>{invoice.status}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}
