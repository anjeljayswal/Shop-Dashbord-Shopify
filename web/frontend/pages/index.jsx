import {
  Layout,
  LegacyCard,
  Page,
} from "@shopify/polaris";
import { Card, OrderDetails, Ordersgraphs } from "../components";
import { useEffect, useState } from "react";

export default function HomePage() {
  const [product, setProduct] = useState(0);
  const [collection, setCollection] = useState(0);
  const [orders, setOrders] = useState(0);
  const [fullFilled, setFullFilled] = useState(0);
  const [remains, setRemains] = useState(0);
  const [orderDetails, setOrderDetails] = useState([]);

  async function fetchProduct() {
    // Fetch data or perform side effects here
    try {
      const request = await fetch("/api/product/count");
      let response = await request.json();
      setProduct(response.count);
      console.log("Product count:", response.count);
    } catch (error) {
      console.error("Error fetching product count:", error);
    }
  }

  async function fetchCollection() {
    // Fetch data or perform side effects here
    try {
      const request = await fetch("/api/collections/count");
      let response = await request.json();
      setCollection(response.count);
      console.log("Collection count:", response.count);
    } catch (error) {
      console.error("Error fetching collection count:", error);
    }
  }
  // async function fetchOrders() {
  //   // Fetch data or perform side effects here
  //   try {
  //     const request = await fetch("/api/orders/all");
  //     let response = await request.json();
  //     console.log("Orders response:", response);
  //     setOrders( response.data.length);
  //     let fulfillOrders = response.data.filter(order => order.fulfillment_status === 'fulfilled');
  //     setFullFilled(fulfillOrders.length);
  //     setRemains(response.data.length - fulfillOrders.length);
  //   } catch (error) {
  //     console.error("Error fetching order count:", error);
  //   }
  // }
  async function fetchOrders() {
    try {
      const request = await fetch("/api/orders/all");
      let response = await request.json();
      console.log("Orders response:", response);

      const allOrders = response.data.data || []; // Fallback to empty array
      setOrderDetails(allOrders);
      setOrders(allOrders.length);

      const fulfillOrders = allOrders.filter(order => order.fulfillment_status === 'fulfilled');
      setFullFilled(fulfillOrders.length);
      setRemains(allOrders.length - fulfillOrders.length);
    } catch (error) {
      console.error("Error fetching order count:", error);
    }
  }
  console.log("Product count:", product);
  console.log("Collection count:", collection);
  console.log("Order count:", orders);
  console.log("Fulfilled count:", fullFilled);
  console.log("Remains count:", remains);

  useEffect(() => {
  const fetchData = async () => {
    await fetchProduct();
    await fetchCollection();
    await fetchOrders();
  };

  fetchData();
}, []);
  return (
    <Page fullWidth>
      <div className="home-section">
        <div className="graphs-section">
          {/* <Ordersgraphs /> */}
        </div>
        <div className="cards-section">
          <Layout>
            <Card title="Total Order" data={orders} orderCard />
            <Card title="Fulfilled Order" data={fullFilled} fulfillCard />
            <Card title="Remains Order" data={remains} remainCard />
            <Card title="Total Product" data={product} productsCard />
            <Card title="Total Collection" data={collection.count} collectionCard />
          </Layout>
        </div>
        <div className="order-details-section">
          <OrderDetails
            orders={orderDetails}
           
          />
        </div>
      </div>
    </Page>
  );
}






{/* <TitleBar title={t("HomePage.title")} /> */ }
// <Layout>
//   <Layout.Section>
//     <Card sectioned>
//       <Stack
//         wrap={false}
//         spacing="extraTight"
//         distribution="trailing"
//         alignment="center"
//       >
//         <Stack.Item fill>
//           <TextContainer spacing="loose">
//             <Text as="h2" variant="headingMd">
//               {t("HomePage.heading")}
//             </Text>
//             <p>
//               <Trans
//                 i18nKey="HomePage.yourAppIsReadyToExplore"
//                 components={{
//                   PolarisLink: (
//                     <Link url="https://polaris.shopify.com/" external />
//                   ),
//                   AdminApiLink: (
//                     <Link
//                       url="https://shopify.dev/api/admin-graphql"
//                       external
//                     />
//                   ),
//                   AppBridgeLink: (
//                     <Link
//                       url="https://shopify.dev/apps/tools/app-bridge"
//                       external
//                     />
//                   ),
//                 }}
//               />
//             </p>
//             <p>{t("HomePage.startPopulatingYourApp")}</p>
//             <p>
//               <Trans
//                 i18nKey="HomePage.learnMore"
//                 components={{
//                   ShopifyTutorialLink: (
//                     <Link
//                       url="https://shopify.dev/apps/getting-started/add-functionality"
//                       external
//                     />
//                   ),
//                 }}
//               />
//             </p>
//           </TextContainer>
//         </Stack.Item>
//         <Stack.Item>
//           <div style={{ padding: "0 20px" }}>
//             <Image
//               source={trophyImage}
//               alt={t("HomePage.trophyAltText")}
//               width={120}
//             />
//           </div>
//         </Stack.Item>
//       </Stack>
//     </Card>
//   </Layout.Section>
//   <Layout.Section>
//     <ProductsCard />
//   </Layout.Section>
// </Layout>