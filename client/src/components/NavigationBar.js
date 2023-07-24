import React from "react";
import { Link } from 'react-router-dom';

export default function NavigationBar() {
    return (
        <section>
            <div className="container items-center p-8">
                <nav>
                    <ul className="flex space-x-4">
                        <li>
                            <Link exact to="/">Home</Link>
                        </li>
                        <li>
                            <Link to="/invoices">Invoices</Link>
                        </li>
                        <li>
                            <Link to="/items">Items</Link>
                        </li>
                    </ul>
                </nav>
            </div>
        </section>

    );
};