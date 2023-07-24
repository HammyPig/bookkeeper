import React from "react";
import InvoiceTable from "../components/InvoiceTable";

export default function InvoicesPage() {
    return (
        <section className="pt-16">
            <div className="container items-center">
                <InvoiceTable />
            </div>
        </section>
    );
}
