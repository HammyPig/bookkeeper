import React from "react";
import ItemTable from "../components/ItemTable";

export default function ItemsPage() {
    return (
        <>
            <section className="pt-16">
                <div className="container justify-center">
                    <ItemTable />
                </div>
            </section>
        </>
    );
}
