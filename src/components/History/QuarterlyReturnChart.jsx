import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Paper, Typography } from '@mui/material';
import { blue, grey } from '@mui/material/colors';
import 'chartjs-plugin-datalabels';

const QuarterlyReturnChart = ({ quarterlyData }) => {
  return (
    <Paper elevation={3} sx={{ padding: 2, marginBottom: 6, minWidth: 300, maxWidth: 600 }}>
      <Typography variant="h6" gutterBottom>
        Quarterly Return
      </Typography>
      <div style={{ height: 250 }}>
        <Bar
          data={{
            labels: quarterlyData.map((data) => data.label),
            datasets: [
              {
                label: "Quarterly Return",
                data: quarterlyData.map((data) => data.value),
                backgroundColor: quarterlyData.map((data, index) =>
                  index === quarterlyData.length - 1 ? blue[300] : grey[500]
                ),
                borderColor: quarterlyData.map((data, index) =>
                  index === quarterlyData.length - 1 ? blue[500] : grey[700]
                ),
                borderWidth: 1,
                hoverBackgroundColor: quarterlyData.map((data, index) =>
                  index === quarterlyData.length - 1 ? blue[100] : grey[300]
                ),
                hoverBorderColor: quarterlyData.map((data, index) =>
                  index === quarterlyData.length - 1 ? blue[300] : grey[500]
                ),
                datalabels: {
                  anchor: 'end',
                  align: 'top',
                  formatter: (value) => value.toLocaleString(),
                  color: grey[700],
                  font: {
                    size: 10,
                    weight: 'bold',
                  },
                },
                barThickness: 40, // Increase the bar width
              },
            ],
          }}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              x: {
                display: true,
                grid: {
                  display: false,
                },
              },
              y: {
                display: false,
                max: Math.max(...quarterlyData.map((data) => data.value)) * 1.5, 
                grid: {
                  display: false,
                },
              },
            },
            plugins: {
              datalabels: {
                display: true,
              },
              legend: {
                display: false,
              },
            },
            animation: {
              duration: 1000,
            },
          }}
        />
      </div>
    </Paper>
  );
};

export default QuarterlyReturnChart;
