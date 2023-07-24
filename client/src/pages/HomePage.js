import React from "react";
import { Link } from "react-router-dom";

export default function HomePage() {
    return (
        <>
            <section className="pt-16">
                <div className="container items-center">
                    <Link to="/invoices/create">
                        <button>Create Invoice</button>
                    </Link>
                </div>
            </section>
        </>
    );
}
