import { Layout, LegacyCard } from '@shopify/polaris';
import React, { useEffect, useState } from 'react';
import { Chart as ChartJS } from 'chart.js/auto';
import { Line, Bar, Doughnut } from 'react-chartjs-2';

export function Ordersgraphs({ orders = [], fullFilled, remains }) {
  const [orderRevenueChart, setOrderRevenueChart] = useState({
    labels: [],
    datasets: [
      {
        label: 'Order Revenue (INR)',
        data: [],
        backgroundColor: '#008170',
        borderColor: '#008170',
        fill: false,
      },
    ],
  });

  const [completionChart, setCompletionChart] = useState({
    labels: ['Completed', 'Remaining'],
    datasets: [
      {
        label: 'Orders Status',
        data: [0, 0],
        backgroundColor: ['#81BF37', '#FF6B6B'],
      },
    ],
  });

  const [remainingChart, setRemainingChart] = useState({
    labels: ['Remaining Orders'],
    datasets: [
      {
        label: 'Remaining Orders Count',
        data: [0],
        backgroundColor: '#FF6B6B',
      },
    ],
  });

  useEffect(() => {
    if (orders?.length > 0) {
      const sortedOrders = [...orders].sort((a, b) => new Date(a.created_at) - new Date(b.created_at));

      // const labels = sortedOrders.map((order) => {
      //   const date = new Date(order.created_at);
      //   return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`; // "2025-06"
      // });
      const labels = sortedOrders.map((order) => {
        const date = new Date(order.created_at);
        return date.toLocaleDateString('en-GB', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
        });
      });
      const dataPoints = sortedOrders.map((order) => parseFloat(order.total_price) || 0);

      setOrderRevenueChart({
        labels,
        datasets: [
          {
            label: 'Order Revenue (INR)',
            data: dataPoints,
            backgroundColor: '#008170',
            borderColor: '#008170',
            fill: false,
          },
        ],
      });

      setCompletionChart({
        labels: ['Completed', 'Remaining'],
        datasets: [
          {
            label: 'Orders Status',
            data: [fullFilled, remains],
            backgroundColor: ['#81BF37', '#FF6B6B'],
          },
        ],
      });

      setRemainingChart({
        labels: ['Remaining Orders'],
        datasets: [
          {
            label: 'Remaining Orders Count',
            data: [remains],
            backgroundColor: '#FF6B6B',
          },
        ],
      });
    }
  }, [orders, fullFilled, remains]);

  return (
    <Layout>
      <Layout.Section oneHalf>
        <LegacyCard title="Total Orders Revenue" sectioned>
          <Line data={orderRevenueChart} options={{ responsive: true, maintainAspectRatio: false }} />
        </LegacyCard>
      </Layout.Section>

      <Layout.Section oneThird>
        <LegacyCard title="Completed vs Remaining Orders" sectioned>
          <Doughnut data={completionChart} options={{ responsive: true, maintainAspectRatio: false }} />
        </LegacyCard>
      </Layout.Section>

      <Layout.Section oneThird>
        <LegacyCard title="Remaining Orders Count" sectioned>
          <Bar data={remainingChart} options={{ responsive: true, maintainAspectRatio: false }} />
        </LegacyCard>
      </Layout.Section>
    </Layout>
  );
}
