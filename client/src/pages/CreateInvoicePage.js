import React, { useState, useEffect } from "react";
import ItemList from "../components/ItemList";

export default function CreateInvoicePage() {
    const [invoice, setInvoice] = useState(
        {
            number: "",
            issueDate: new Date().toISOString().split("T")[0],
            dueDate: new Date().toISOString().split("T")[0],
            salesPerson: "",

            billingAddress: {
                fullName: "",
                street: "",
                suburb: "",
                state: "",
                postcode: "",
                phone: "",
                email: ""
            },

            itemsOverview: {
                colour: "",
                reveal: "",
                screen: "",
                glassType: "",
                frameStyle: "",
                bushfireAttackLevel: "",
                windRating: "",
                energyRating: "",
                acousticRating: ""
            },

            items: [
                {code: "", description: "", price: "", quantity: ""}
            ],

            deliveryMethod: { name: "", price: "", requiresAddress: false },
            deliveryAddressIsBillingAddress: true,
            deliveryAddress: {
                fullName: "",
                street: "",
                suburb: "",
                state: "",
                postcode: "",
                phone: "",
                email: ""
            },

            discount: 0,
            amountPaid: 0,
            paymentMethod: "",
        }
    );

    const [searchValue, setSearchValue] = useState("");
    const [deliveryMethods, setDeliveryMethods] = useState([]);

    useEffect(() => {
        fetch("/api/deliveryMethods")
            .then(response => response.json())
            .then(deliveryMethods => {
                setDeliveryMethods(deliveryMethods);
            });
    })

    function handleSearch() {
        fetch(`/api/invoices/${searchValue}`)
            .then(response => response.json())
            .then(invoice => {
                setInvoice(invoice);
            });
    }

    function handleEditField(e) {
        const { name, value } = e.target;
        const [fieldName, ...nestedFields] = name.split(".");
        const updatedInvoice = { ...invoice };

        if (nestedFields.length === 0) {
            updatedInvoice[fieldName] = value;
        } else {
            let currentField = updatedInvoice[fieldName];
            nestedFields.forEach((nestedField, index) => {
                if (index === nestedFields.length - 1) {
                    currentField[nestedField] = value;
                } else {
                    currentField = currentField[nestedField];
                }
            });
        }

        setInvoice(updatedInvoice);
    }

    function handleToggleField(e) {
        const { name, checked } = e.target;
        const [fieldName, ...nestedFields] = name.split(".");
        const updatedInvoice = { ...invoice };

        if (nestedFields.length === 0) {
            updatedInvoice[fieldName] = checked;
        } else {
            let currentField = updatedInvoice[fieldName];
            nestedFields.forEach((nestedField, index) => {
                if (index === nestedFields.length - 1) {
                    currentField[nestedField] = checked;
                } else {
                    currentField = currentField[nestedField];
                }
            });
        }
        
        setInvoice(updatedInvoice);
    }

    function handleAddItem() {
        const newItem = { code: "", description: "", quantity: "", price: "" };
        const newItems = [...invoice.items, newItem];
        const newInvoice = { ...invoice, items: newItems };
        setInvoice(newInvoice);
    }

    function handleEditItemCode(itemIndex, field, value) {
        handleEditItem(itemIndex, field, value);
        fetch(`/api/items/${value}`)
            .then(response => response.json())
            .then(item => {
                handleEditItem(itemIndex, "description", item.description);
                handleEditItem(itemIndex, "price", item.price);
                handleEditItem(itemIndex, "quantity", item.quantity);
            });
    }

    function handleEditItem(itemIndex, field, value) {
        const newItems = [...invoice.items]
        newItems[itemIndex][field] = value;
        const newInvoice = { ...invoice, items: newItems };
        setInvoice(newInvoice);
    }

    function handleDeleteItem(itemIndex) {
        const newItems = [...invoice.items];
        newItems.splice(itemIndex, 1);
        const newInvoice = { ...invoice, items: newItems };
        setInvoice(newInvoice);
    }

    function handleEditDeliveryMethodName(deliveryMethodName) {
        const deliveryMethod = deliveryMethods.find((deliveryMethod) => deliveryMethod.name === deliveryMethodName);
        const newInvoice = { ...invoice, deliveryMethod: deliveryMethod };
        setInvoice(newInvoice);
    }

    function isValidInvoice(invoice) {
        for (const item of invoice.items) {
            if (isNaN(parseFloat(item.quantity))) { return false; }
            if (isNaN(parseFloat(item.price))) { return false; }
        }

        return true;
    }

    function handlePreviewInvoice() {
        if (!isValidInvoice(invoice)) {
            window.alert("Quantity or Price is not a number.");
            return;
        }

        const queryParams = new URLSearchParams();
        queryParams.append("invoice", JSON.stringify(invoice));

        fetch(`/api/view-invoice?${queryParams}`)
            .then(response => response.blob())
            .then(pdfBlob => {
                const pdfUrl = URL.createObjectURL(pdfBlob);
                const newWindow = window.open();
                newWindow.location.href = pdfUrl;
            });
    }

    function getSubtotal() {
        return invoice.items.reduce((acc, item) => {
            return acc + (parseFloat(item.quantity) * parseFloat(item.price));
        }, 0);
    }

    function getTotal() {
        return getSubtotal() + parseFloat(invoice.deliveryMethod.price) - parseFloat(invoice.discount);
    }

    function getBalance() {
        return getTotal() - parseFloat(invoice.amountPaid);
    }

    function handleSubmit(e) {
        e.preventDefault();
        console.log(JSON.stringify(invoice));
    }

    return (
        <>
            <section className="pt-16">
                <div className="container">
                    <div>
                        <label className="mr-2">Search: <input value={searchValue} onChange={(e) => setSearchValue(e.target.value)} /></label>
                        <button className="py-1" onClick={handleSearch}>Search</button>
                    </div>
                </div>
            </section>
            <section className="pt-16">
                <div className="container">
                    <form className="w-full" onSubmit={handleSubmit}>
                        <section>
                            <div className="container lg:!w-1/2">
                                <h2>Bill to:</h2>
                                <label>Full name: <input name="billingAddress.fullName" value={invoice.billingAddress.fullName} onChange={(e) => handleEditField(e)} /></label>
                                <label>Street address: <input name="billingAddress.street" value={invoice.billingAddress.street} onChange={(e) => handleEditField(e)} /></label>
                                <label>Suburb: <input name="billingAddress.suburb" value={invoice.billingAddress.suburb} onChange={(e) => handleEditField(e)} /></label>
                                <label>State: <input name="billingAddress.state" value={invoice.billingAddress.state} onChange={(e) => handleEditField(e)} /></label>
                                <label>Postcode: <input name="billingAddress.postcode" value={invoice.billingAddress.postcode} onChange={(e) => handleEditField(e)} /></label>
                                <label>Phone number: <input name="billingAddress.phone" value={invoice.billingAddress.phone} onChange={(e) => handleEditField(e)} /></label>
                                <label>Email address: <input name="billingAddress.email" value={invoice.billingAddress.email} onChange={(e) => handleEditField(e)} /></label>
                            </div>
                            <div className="container lg:!w-1/2 items-end">
                                <label>Issue date: <input name="issueDate" type="date" value={invoice.issueDate} onChange={(e) => handleEditField(e)} /></label>
                                <label>Due date: <input name="dueDate" type="date" value={invoice.dueDate} onChange={(e) => handleEditField(e)} /></label>
                                <label>Sales person: <input name="salesPerson" value={invoice.salesPerson} onChange={(e) => handleEditField(e)} /></label>
                            </div>
                        </section>
                        <section className="pt-16">
                            <div className="container">
                                <div className="grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                                    <label>Colour: <input name="itemsOverview.colour" value={invoice.itemsOverview.colour} onChange={(e) => handleEditField(e)} /></label>
                                    <label>Reveal: <input name="itemsOverview.reveal" value={invoice.itemsOverview.reveal} onChange={(e) => handleEditField(e)} /></label>
                                    <label>Screen: <input name="itemsOverview.screen" value={invoice.itemsOverview.screen} onChange={(e) => handleEditField(e)} /></label>
                                    <label>Glass Type: <input name="itemsOverview.glassType" value={invoice.itemsOverview.glassType} onChange={(e) => handleEditField(e)} /></label>
                                    <label>Frame Style: <input name="itemsOverview.frameStyle" value={invoice.itemsOverview.frameStyle} onChange={(e) => handleEditField(e)} /></label>
                                    <label>BAL: <input name="itemsOverview.bushfireAttackLevel" value={invoice.itemsOverview.bushfireAttackLevel} onChange={(e) => handleEditField(e)} /></label>
                                    <label>Wind Rating: <input name="itemsOverview.windRating" value={invoice.itemsOverview.windRating} onChange={(e) => handleEditField(e)} /></label>
                                    <label>Energy Rating: <input name="itemsOverview.energyRating" value={invoice.itemsOverview.energyRating} onChange={(e) => handleEditField(e)} /></label>
                                    <label>Acoustic Rating: <input name="itemsOverview.acousticRating" value={invoice.itemsOverview.acousticRating} onChange={(e) => handleEditField(e)} /></label>
                                </div>
                            </div>
                        </section>
                        <section className="pt-16">
                            <div className="container items-center">
                                <ItemList items={invoice.items} handleAddItem={handleAddItem} handleEditItemCode={handleEditItemCode} handleEditItem={handleEditItem} handleDeleteItem={handleDeleteItem} />
                            </div>
                        </section>
                        <section className="pt-16">
                            <div className="container">
                                <label>Delivery Method: 
                                    <select name="deliveryMethod.name" value={invoice.deliveryMethod.name} onChange={(e) => handleEditDeliveryMethodName(e.target.value)} >
                                        {deliveryMethods.map((deliveryMethod) => (
                                            <option value={deliveryMethod.name}>{deliveryMethod.name}</option>
                                        ))}
                                    </select>
                                </label>
                                <label>Delivery Price: <input name="deliveryMethod.price" value={invoice.deliveryMethod.price} onChange={(e) => handleEditField(e)} /></label>
                                {invoice.deliveryMethod.requiresAddress && (
                                    <section>
                                        <div className="container">
                                            <h2>Delivery Address:</h2>
                                            <div>
                                                <input name="deliveryAddressIsBillingAddress" type="checkbox" checked={invoice.deliveryAddressIsBillingAddress} onChange={(e) => handleToggleField(e)}></input>
                                                <label className="ml-2">Same as billing address</label>
                                            </div>
                                            {!invoice.deliveryAddressIsBillingAddress && (
                                                <section>
                                                    <div className="container">
                                                        <label>Full name: <input name="deliveryAddress.fullName" value={invoice.deliveryAddress.fullName} onChange={(e) => handleEditField(e)} /></label>
                                                        <label>Street address: <input name="deliveryAddress.street" value={invoice.deliveryAddress.street} onChange={(e) => handleEditField(e)} /></label>
                                                        <label>Suburb: <input name="deliveryAddress.suburb" value={invoice.deliveryAddress.suburb} onChange={(e) => handleEditField(e)} /></label>
                                                        <label>State: <input name="deliveryAddress.state" value={invoice.deliveryAddress.state} onChange={(e) => handleEditField(e)} /></label>
                                                        <label>Postcode: <input name="deliveryAddress.postcode" value={invoice.deliveryAddress.postcode} onChange={(e) => handleEditField(e)} /></label>
                                                        <label>Phone number: <input name="deliveryAddress.phone" value={invoice.deliveryAddress.phone} onChange={(e) => handleEditField(e)} /></label>
                                                        <label>Email address: <input name="deliveryAddress.email" value={invoice.deliveryAddress.email} onChange={(e) => handleEditField(e)} /></label>
                                                    </div>
                                                </section>
                                            )}
                                        </div>
                                    </section>
                                )}
                            </div>
                        </section>
                        <section className="pt-16">
                            <div className="container items-end">
                                <label>Subtotal: {getSubtotal()}</label>
                                <label>Payment Method: 
                                    <select className="ml-2" name="paymentMethod" value={invoice.paymentMethod} onChange={(e) => handleEditField(e)} >
                                        <option value="Card">Card</option>
                                        <option value="Cash">Cash</option>
                                        <option value="Bank Transfer">Bank Transfer</option>
                                    </select>
                                </label>
                                <label>Discount: <input name="discount" value={invoice.discount} onChange={(e) => handleEditField(e)} /></label>
                                <label>Total: {getTotal()}</label>
                                <label>GST (incl.): {(getTotal() / 11).toFixed(2)}</label>
                                <label>Amount Paid: <input name="amountPaid" value={invoice.amountPaid} onChange={(e) => handleEditField(e)}/></label>
                                <label>Balance Due: {getBalance()}</label>
                            </div>
                        </section>
                        <section>
                            <div className="container items-end">
                                <div>
                                    <button className="mx-4 px-8 py-2 bg-gray-200" type="button" onClick={handlePreviewInvoice}>Preview</button>
                                    <button className="px-8 py-2 bg-blue-700 text-white" type="submit">Submit</button>
                                </div>
                            </div>
                        </section>
                    </form>
                </div>
            </section>
        </>
    );
}