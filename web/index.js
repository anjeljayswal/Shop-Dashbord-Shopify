// @ts-check
import { join } from "path";
import { readFileSync } from "fs";
import express from "express";
import serveStatic from "serve-static";
import multer from "multer";

import shopify from "./shopify.js";
import productCreator from "./product-creator.js";
import PrivacyWebhookHandlers from "./privacy.js";
import mongoose from "mongoose";
import { esES } from "@mui/material/locale";

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
app.use(express.json());
// const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });

// 1. connection to mongodb
// 2 create a schema 
// 3 models
// 4 crud operations  

mongoose.connect("mongodb://localhost:27017/shopify")
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err);
  });

let userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  useremail: { type: String, required: true, unique: true },

});
let User = mongoose.model("userData", userSchema);


async function authenticateUser(req, res, next) {
  let shop = req.query.shop;
  let storeName = await shopify.config.sessionStorage.findSessionsByShop(shop);
  console.log('storeName: ', storeName);
  if (shop === storeName[0].shop) {
    next();
  } else {
    res.send("User not authenticated");
  }

}

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
  // console.log('Received user data:', userData);
  try {
    let createdUser = await User.create({
      username: userData[0],
      useremail: userData[1],
    });
    console.log("User created successfully:", createdUser);
    res.status(201).json({ message: "User created successfully", data: createdUser });
  } catch (error) {
    if (error.code === 11000) {
      // Duplicate key error
      res.status(400).json({ message: "User already exists" });
    } else {
      console.error("Error creating user:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
});

app.get("/api/getusers", async(req, res) => {
  try {
    let users = await User.find({});
    // console.log('users: ', users);
    res.status(200).send(users);
  }catch(error) {
    console.log(error)
  }
});


// ..read shop information
app.get("/api/store/info", async (req, res) => {
  let storeInfo = await shopify.api.rest.Shop.all({
    session: res.locals.shopify.session,
  })
  res.status(200).send(storeInfo);
});




app.get("/api/product/count", async (_req, res) => {
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




// READ ALL PRODUCTS
app.get("/api/products/all", async(req, res) => {
  let allProducts = await shopify.api.rest.Product.all({
    session: res.locals.shopify.session,
  });
  res.status(200).send(allProducts);
});

// UPDATE A PRODUCT
app.put("/api/product/update", async(req, res) => {
  let getProduct = req.body;
  let updateProduct = new shopify.api.rest.Product({
    session: res.locals.shopify.session,
  });
  updateProduct.id = getProduct.id;
  updateProduct.title = getProduct.title;
  await updateProduct.save({
    update: true,
  });
  res.status(200).send({Message: "Product Updated Successfully"})
});

// CREATE A NEW PRODUCT
// app.post("/api/product/create", async(req, res) => {
//   let newProduct = new shopify.api.rest.Product({
//     session: res.locals.shopify.session,
//   });
//   newProduct.title = "Men New Style Shoe";
//   newProduct.body_html = "Men new style show latest design";
//   newProduct.varndor = "al-janat-demo";
//   newProduct.images = [{
//     src: "https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
//   }];
//   await newProduct.save({
//     update: true,
//   });
//   res.status(200).send({Message: "Product created Successfully"});
// });
// const upload = multer({ storage: multer.memoryStorage() });

app.post("/api/upload-image", upload.single("image"), async (req, res) => {
  try {
    if (!req.file || !req.file.buffer) {
      res.status(400).send({ error: "No image file uploaded" });
      return;
    }
    const imageBuffer = req.file.buffer;

    const image = new shopify.api.rest.Image({ session: res.locals.shopify.session });
    image.product_id = null; // Optional if not attached to a product yet
    image.attachment = imageBuffer.toString('base64');

    await image.save();

    res.status(200).json({ imageUrl: image.src });
  } catch (err) {
    console.error("Image Upload Error:", err);
    res.status(500).send({ error: "Failed to upload image" });
  }
});

app.post("/api/product/create", async (req, res) => {
  const data = req.body;

  const newProduct = new shopify.api.rest.Product({
    session: res.locals.shopify.session,
  });

  newProduct.title = data.title;
  newProduct.body_html = data.body_html;
  newProduct.handle = data.handle;
  newProduct.vendor = "al-janat-demo"; // optional or pass via body
  newProduct.images = [{ src: data.image?.src }];
  newProduct.variants = [{ price: data.variants[0].price }];

  await newProduct.save({ update: true });
  res.status(200).send({ message: "Product created successfully" });
});
// DELETE A PRODUCT
app.delete("/api/product/delete", async(req, res) => {
  await shopify.api.rest.Product.delete({
    session: res.locals.shopify.session,
    id: 7281843077180,
  });
  res.status(200).send({Message: "Product Deleted Successfully"})
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
