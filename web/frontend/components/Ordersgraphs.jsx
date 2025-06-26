import { Layout, LegacyCard } from '@shopify/polaris'
import React, { useState } from 'react'
import {storeData} from "../data";
import { Chart as ChartJS } from 'chart.js/auto';
import { Line,Bar, Doughnut } from 'react-chartjs-2';

export function Ordersgraphs() {
    console.log(storeData);
    let [data, setData] = useState({
        labels: storeData.map((item) => item.year),
        datasets: [{
            label:"Order Details",
            data: storeData.map((item) => item.order),
            backgroundColor: ['#008170','#000000','#8e8e8e','#81BF37'],
        }]
    });
    return (
        <>
            <Layout>
                <Layout.Section oneHalf>
                    <LegacyCard title="Total Orders" sectioned>
                        <Line data={data} options={{responsive:true, maintainAspectRatio:false}}  />
                        {/* <Pie data={data} /> */}
                    </LegacyCard>
                </Layout.Section>
                <Layout.Section oneThird>
                    <LegacyCard title="Completed Orders" sectioned>
                        <Doughnut data={data} options={{responsive:true, maintainAspectRatio:false}} />

                    </LegacyCard>
                </Layout.Section>
                <Layout.Section oneThird>
                    <LegacyCard title="Remaining Orders" sectioned>
                        <Bar data={data} options={{responsive:true, maintainAspectRatio:false}} />
                    </LegacyCard>
                </Layout.Section>
            </Layout>
        </>
    )
}

// export default Ordersgraphs
