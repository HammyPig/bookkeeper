const express = require("express");
const puppeteer = require("puppeteer");

const app = express();
app.use(express.static("public"));

const port = 5000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

const invoices = [
    {
        number: "1000",
        issueDate: new Date("2023-01-01").toISOString().split("T")[0],
        dueDate: new Date("2023-01-08").toISOString().split("T")[0],
        salesPerson: "salesey",

        billingAddress: {
            fullName: "full name",
            street: "streetey",
            suburb: "suburbey",
            state: "statey",
            postcode: "0000",
            phone: "0000 000 000",
            email: "mail@email.com"
        },

        itemsOverview: {
            colour: "Black",
            reveal: "138mm",
            screen: "Fly Screen",
            glassType: "Frosted",
            frameStyle: "Framey",
            bushfireAttackLevel: "Bushfirey",
            windRating: "Windy",
            energyRating: "Energyey",
            acousticRating: "Acousticy"
        },

        items: [
            {code: "0606-b", description: "Sliding Window", price: "100", quantity: "1"},
            {code: "0606-w", description: "Sliding Window", price: "150.05", quantity: "2"}
        ],

        deliveryMethod: { name: "0-10 km", price: "138", requiresAddress: true },
        deliveryAddressIsBillingAddress: false,
        deliveryAddress: {
          fullName: "d full name",
          street: "e streetey",
          suburb: "l suburbey",
          state: "i statey",
          postcode: "v 0000",
          phone: "e 0000 000 000",
          email: "r mail@email.com"
        },

        discount: 1,
        amountPaid: 1,
        paymentMethod: "Cash",
    }
];

const items = [
  {
    code: "0606-b",
    stock: 10,
    description: "Aluminium Sliding Window 600 H x 610 W\nGlass Type: 4mm Clear Float Glass\nOpening: XO, Colour: Black",
    price: 175,
  },
  {
    code: "0606-s",
    stock: 5,
    description: "Aluminium Sliding Window 600 H x 610 W\nGlass Type: 4mm Clear Float Glass\nOpening: XO, Colour: Ultra Silver Gloss",
    price: 175,
  },
  {
    code: "0606-w",
    stock: 20,
    description: "Aluminium Sliding Window 600 H x 610 W\nGlass Type: 4mm Clear Float Glass\nOpening: XO, Colour: Pearl White",
    price: 175,
  },
];

app.get("/api/items/:itemCode", (req, res) => {
    const { itemCode } = req.params;
    const item = getItemByCode(itemCode);

    if (!item) { return res.status(404).json({ error: "Item not found" })};

    res.json(item);
})

const deliveryMethods = [
  { name: "Pickup", price: 0, requiresAddress: false},
  { name: "0-10 km", price: 99, requiresAddress: true },
  { name: "10-30 km", price: 149, requiresAddress: true },
  { name: "30-60 km", price: 199, requiresAddress: true },
  { name: "60-90 km", price: 249, requiresAddress: true },
  { name: "Factory Delivery B", price: 219, requiresAddress: true },
  { name: "Factory Delivery D", price: 199, requiresAddress: true },
  { name: "Sunshine Coast", price: 300, requiresAddress: true },
  { name: "North Gympie", price: 349, requiresAddress: true },
  { name: "Bradnams", price: 299, requiresAddress: true },
  { name: "Dowell", price: 199, requiresAddress: true },
]

app.get("/api/deliveryMethods", (req, res) => {
    return res.json(deliveryMethods);
})

function getItemByCode(itemCode) {
    return items.find((item) => item.code === itemCode);
}

function getInvoiceByNumber(invoiceNumber) {
    return invoices.find((invoice) => invoice.number === invoiceNumber);
}

function getInvoiceDeliveryAddress(invoice) {
    if (invoice.deliveryMethod.requiresAddress) {
        return `
            <p>
                <b>Ship to:</b><br>
                ${invoice.deliveryAddress.fullName}<br>
                ${invoice.deliveryAddress.street}<br>
                ${invoice.deliveryAddress.suburb} ${invoice.deliveryAddress.state} ${invoice.deliveryAddress.postcode}<br>
                ${invoice.deliveryAddress.phone}<br>
                ${invoice.deliveryAddress.email}<br>
            </p>
        `;
    } else {
        return "";
    }
}

function getInvoiceItemTable(invoice) {
  let tableHtml = "";

  for (const [itemIndex, item] of invoice.items.entries()) {
    tableHtml += `
      <tr key={itemIndex}>
        <td>${item.code}</td>
        <td>${item.description.replace(/\n/g, "<br>")}</td>
        <td style="text-align: right;">${item.quantity}</td>
        <td style="text-align: right;">$${parseFloat(item.price).toFixed(2)}</td>
        <td style="text-align: right;">$${(parseFloat(item.quantity) * parseFloat(item.price)).toFixed(2)}</td>
      </tr>
    `;
  }

  return tableHtml;
}

function getInvoiceSubtotal(invoice) {
    return invoice.items.reduce((acc, product) => {
        const quantity = parseFloat(product.quantity);
        const price = parseFloat(product.price);
        return acc + (price * quantity);
    }, 0).toFixed(2);
}

function getInvoiceGST(invoice) {
    return (getInvoiceSubtotal(invoice) / 11).toFixed(2);
}

app.get("/api/invoices", (req, res) => {
    return res.json(invoices);
})

app.get("/api/invoices/:invoiceNumber", (req, res) => {
    const { invoiceNumber } = req.params;
    const invoice = getInvoiceByNumber(invoiceNumber);

    if (!invoice) { return res.status(404).json({ error: "Invoice not found" })};

    res.json(invoice);
});

app.get("/api/view-invoice", async (req, res) => {
  const invoice = JSON.parse(req.query.invoice || "{}"); // default is {} if invoice is missing

  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>Generated HTML Page</title>
        <style>
          @page {
            size: A4;
            margin: 2cm;
          }

          section {
            display: flex;
            flex-wrap: wrap;
            width: 100%;
          }

          .container {
            display: flex;
            flex-direction: column;
            margin-left: auto;
            margin-right: auto;
            width: 100%;
          }

          body {
            font-family: Arial, sans-serif;
            font-size: 11px;
          }

          table {
            border-collapse: collapse;
            width: 100%,
          }

          thead {
            background-color: #9cd001;
          }

          tbody tr {
            border-bottom: 1px solid black;
          }
        </style>
      </head>
      <body>
        <section>
          <div class="container" style="width: 40%;">
            <h1>TAX INVOICE</h1>
            <p>
              <b>GCB Doors and Windows</b><br>
              1/140 Meakin Road<br>
              Kingston 4114, QLD<br>
              07 3333 1745<br>
              <a href="mailto:sales@doorsandwindowsbrisbane.com.au">sales@doorsandwindowsbrisbane.com.au</a><br>
              <a href="https://www.doorsandwindowsbrisbane.com.au/">www.doorsandwindowsbrisbane.com.au</a><br>
              ABN 56 078 876 320
            </p>
          </div>
          <div class="container" style="width: 60%; align-items: end;">
            <img src="https://www.doorsandwindowsbrisbane.com.au/wp-content/uploads/logo.jpg.webp" alt="logo" width="120" height="auto">
          </div>
        </section>
        <section>
        <section>
          <div class="container" style="width: 40%;">
            <p>
              <b>Bill to:</b><br>
              ${invoice.billingAddress.fullName}<br>
              ${invoice.billingAddress.street}<br>
              ${invoice.billingAddress.suburb} ${invoice.billingAddress.state} ${invoice.billingAddress.postcode}<br>
              ${invoice.billingAddress.phone}<br>
              ${invoice.billingAddress.email}<br>
            </p>
          </div>
          <div class="container" style="width: 40%;">
            ${getInvoiceDeliveryAddress(invoice)}
          </div>
          <div class="container" style="width: 20%; text-align: right;">
            <p>
              <b>Invoice number: ${invoice.number}</b><br>
              <b>Issue date:</b> ${invoice.issueDate}<br>
              <b>Due date:</b> ${invoice.dueDate}<br>
              <b>Sales person:</b> ${invoice.salesPerson}<br>
            </p>
          </div>
        </section>
        <section>
          <div class="container">
            <h2>Item Overview</h2>
            <table>
              <tbody>
                <tr>
                  <td>Product Colour:</td>
                  <td>${invoice.itemsOverview.colour}</td>
                  <td>Reveal:</td>
                  <td>${invoice.itemsOverview.reveal}</td>
                  <td>Screen:</td>
                  <td>${invoice.itemsOverview.screen}</td>
                </tr>
                <tr>
                  <td>Glass Type:</td>
                  <td>${invoice.itemsOverview.glassType}</td>
                  <td>Frame Style:</td>
                  <td>${invoice.itemsOverview.frameStyle}</td>
                  <td>BAL:</td>
                  <td>${invoice.itemsOverview.bushfireAttackLevel}</td>
                </tr>
                <tr>
                  <td>Wind Rating:</td>
                  <td>${invoice.itemsOverview.windRating}</td>
                  <td>Energy Rating:</td>
                  <td>${invoice.itemsOverview.energyRating}</td>
                  <td>Acoustic Rating:</td>
                  <td>${invoice.itemsOverview.acousticRating}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
        <section>
          <div class="container">
            <h2>Items</h2>
            <table>
              <thead>
                <tr>
                  <th style="text-align: left;">Code</th>
                  <th style="text-align: left;">Description</th>
                  <th style="text-align: right;">Quantity</th>
                  <th style="text-align: right;">Unit Price</th>
                  <th style="text-align: right;">Total</th>
                </tr>
              </thead>
              <tbody>
                ${getInvoiceItemTable(invoice)}
              </tbody>
              <tfoot>
                <tr>
                  <td colspan="3" />
                  <td style="text-align: right;"><b>Subtotal:</b></td>
                  <td style="text-align: right;">$${getInvoiceSubtotal(invoice)}</td>
                </tr>
                <tr>
                  <td colspan="3" />
                  <td style="text-align: right;"><b>Delivery:</b></td>
                  <td style="text-align: right;">$${parseFloat(invoice.deliveryMethod.price).toFixed(2)}</td>
                </tr>
                <tr>
                  <td colspan="3" />
                  <td style="text-align: right;"><b>GST (included):</b></td>
                  <td style="text-align: right;">$${getInvoiceGST(invoice)}</td>
                </tr>
                <tr>
                  <td></td>
                  <td></td>
                  <td style="border-top: 1px solid black;"></td>
                  <td style="text-align: right; border-top: 1px solid black;"><b>Total:</b></td>
                  <td style="text-align: right; border-top: 1px solid black;">$59.00</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </section>
        <section>
          <div class="container">
            <p>
              <b>Please see our Terms and Conditions on our website:</b>
              <a href="https://www.doorsandwindowsbrisbane.com.au/terms-and-conditions">www.doorsandwindowsbrisbane.com.au/terms-and-conditions</a><br>
              <b>I accept the above terms and conditions and acknowledge the above goods are received correctly.<br>
            </p>
            <p>
              Customer signature:<br>
            </p>
            <hr style="border: none; border-top: 1px solid black; margin: 30px 0; width: 25%;"> 
            <p>
              Date signed:<br>
            </p>
            <hr style="border: none; border-top: 1px solid black; margin: 30px 0; width: 25%;">
          </div>
        </section>
      </body>
    </html>
  `;
      
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setContent(htmlContent);
  const pdfBuffer = await page.pdf({ format: "A4", printBackground: true });
  await browser.close();

  res.setHeader("Content-Type", "application/pdf");
  res.send(pdfBuffer);
});

app.get("/api/items", (req, res) => {
  return res.json(items);
})