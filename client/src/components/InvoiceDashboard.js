import React, { useState, useEffect } from "react";

export default function InvoiceDashboard() {
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

    const Invoice = ({ invoice }) => {
        const [isOpen, setIsOpen] = useState(false);

        const toggleOpen = () => {
            setIsOpen(!isOpen);
        };

        return (
            <>
                <section className={`rounded-t-lg bg-secondary p-4 border-2 border-grey-500 ${isOpen ? "" : "rounded-b-lg mb-0"}`} onClick={toggleOpen}>
                    <div className="container md:!w-1/4">
                        <p>{invoice.number}</p>
                    </div>
                    <div className="container md:!w-1/4">
                        <p>{invoice.customerName}</p>
                    </div>
                    <div className="container md:!w-1/4">
                        <p>{invoice.dueDate}</p>
                    </div>
                    <div className="container md:!w-1/4">
                        {/* <p>{invoice.tasks.length}</p> */}
                    </div>
                </section>
                {isOpen && <InvoiceDetails invoice={invoice} />}
                
            </>
        );
    };

    const InvoiceDetails = ({ invoice }) => {
        return (
            <section className="rounded-b-lg bg-secondary border-2 border-t-0 border-grey-500 p-4 !mt-0">
                <div className="container">
                    <div>
                        <input className="mr-1" type="checkbox" /><label>order screens</label>
                    </div>
                    <div>
                        <input className="mr-1" type="checkbox" /><label>do reveals</label>
                    </div>
                    <label className="!mt-8">Notes: </label><textarea></textarea>
                    <div className="!mt-8">
                        <button className="px-8 py-2 bg-primary text-white" type="submit">Submit</button>
                    </div>
                </div>
            </section>
        );
    };

    return (
        <>
            <section className="rounded-lg bg-secondary p-4">
                <div className="container md:!w-1/4">
                    <p>Number</p>
                </div>
                <div className="container md:!w-1/4">
                    <p>Customer Name</p>
                </div>
                <div className="container md:!w-1/4">
                    <p>Due Date</p>
                </div>
                <div className="container md:!w-1/4">
                    <p>Tasks Pending</p>
                </div>
            </section>
                {invoices.map((invoice) => (
                    <Invoice invoice={invoice} />
                ))}
        </>
    );
}