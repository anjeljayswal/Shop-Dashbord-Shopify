// @ts-check
import { join } from "path";
import { readFileSync } from "fs";
import express from "express";
import serveStatic from "serve-static";

import shopify from "./shopify.js";
import productCreator from "./product-creator.js";
import PrivacyWebhookHandlers from "./privacy.js";

const PORT = parseInt(
  process.env.BACKEND_PORT || process.env.PORT || "3000",
  10
);

const STATIC_PATH =
  process.env.NODE_ENV === "production"
    ? `${process.cwd()}/frontend/dist`
    : `${process.cwd()}/frontend/`;

const app = express();

// Set up Shopify authentication and webhook handling
app.get(shopify.config.auth.path, shopify.auth.begin());
app.get(
  shopify.config.auth.callbackPath,
  shopify.auth.callback(),
  shopify.redirectToShopifyOrAppRoot()
);
app.post(
  shopify.config.webhooks.path,
  shopify.processWebhooks({ webhookHandlers: PrivacyWebhookHandlers })
);

// If you are adding routes outside of the /api path, remember to
// also add a proxy rule for them in web/frontend/vite.config.js

app.use("/api/*", shopify.validateAuthenticatedSession());
app.use("/userdata/*", authenticateUser);
async function authenticateUser(req, res, next) {
  let shop = req.query.shop;
  let storeName= await shopify.config.sessionStorage.findSessionsByShop(shop);
  console.log('storeName: ', storeName);
  if(shop === storeName[0].shop) {    
    next();
  }else{
    res.send("User not authenticated"); 
  }

}

app.use(express.json());
//getting storefront data
// app.get("/userdata/userinfo", async (req, res) => {
//   // ..read user information
//   // const userData = req.body;
//   // console.log('Received user data:', userData);

//   // You can add your logic here
//   // res.status(200).json({ message: "Store data received", data: userData });
//     res.status(200).send("Store data received" );

// });
app.post("/userdata/userinfo", async (req, res) => {
  // ..read user information
  const userData = req.body;
  console.log('Received user data:', userData);

  // You can add your logic here
  res.status(200).json({ message: "Store data received", data: userData });

});
// ..read shop information
app.get("/api/store/info", async (req, res) => {
  let storeInfo = await shopify.api.rest.Shop.all({
    session: res.locals.shopify.session,
  })
  res.status(200).send(storeInfo);
});




app.get("/api/products/count", async (_req, res) => {
  const client = new shopify.api.clients.Graphql({
    session: res.locals.shopify.session,
  });

  const countData = await client.request(`
    query shopifyProductCount {
      productsCount {
        count
      }
    }
  `);

  res.status(200).send({ count: countData.data.productsCount.count });
});

//read collection information
app.get("/api/collections/count", async (_req, res) => {
  const countData = await shopify.api.rest.CustomCollection.count({
    session: res.locals.shopify.session,
  });
  res.status(200).send({ count: countData });
});
//reading orders  data
app.get("/api/orders/all", async (_req, res) => {
  const countData = await shopify.api.rest.Order.count({
    session: res.locals.shopify.session,
    status: "any",
  });
  res.status(200).send({ count: countData });
});


app.post("/api/products", async (_req, res) => {
  let status = 200;
  let error = null;

  try {
    await productCreator(res.locals.shopify.session);
  } catch (e) {
    console.log(`Failed to process products/create: ${e.message}`);
    status = 500;
    error = e.message;
  }
  res.status(status).send({ success: status === 200, error });
});

app.use(shopify.cspHeaders());
app.use(serveStatic(STATIC_PATH, { index: false }));

app.use("/*", shopify.ensureInstalledOnShop(), async (_req, res, _next) => {
  res
    .status(200)
    .set("Content-Type", "text/html")
    .send(
      readFileSync(join(STATIC_PATH, "index.html"))
        .toString()
        .replace("%VITE_SHOPIFY_API_KEY%", process.env.SHOPIFY_API_KEY || "")
    );
});

app.listen(PORT);
