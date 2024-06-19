import React from "react";
import { Bar } from "react-chartjs-2";
import { Paper, Typography } from "@mui/material";
import { green, grey } from "@mui/material/colors";

import "chartjs-plugin-datalabels";

const AnnualReturnChart = ({ annualData }) => {
  return (
    <Paper
      elevation={3}
      sx={{ padding: 2, marginBottom: 6, minWidth: 300, maxWidth: 600 }}
    >
      <Typography variant="h6" gutterBottom>
        Annual Return
      </Typography>
      <div style={{ height: 250 }}>
        <Bar
          data={{
            labels: annualData.map((data) => data.label),
            datasets: [
              {
                label: "Annual Return",
                data: annualData.map((data) => data.value),
                backgroundColor: annualData.map((data, index) =>
                  index === annualData.length - 1 ? green[300] : grey[500]
                ),
                borderColor: annualData.map((data, index) =>
                  index === annualData.length - 1 ? green[500] : grey[700]
                ),
                borderWidth: 1,
                hoverBackgroundColor: annualData.map((data, index) =>
                  index === annualData.length - 1 ? green[100] : grey[300]
                ),
                hoverBorderColor: annualData.map((data, index) =>
                  index === annualData.length - 1 ? green[300] : grey[500]
                ),
                datalabels: {
                  anchor: "end",
                  align: "top",
                  formatter: (value) => value.toLocaleString(),
                  color: grey[700],
                  font: {
                    size: 10,
                    weight: "bold",
                  },
                },
                barThickness: 50, // Increase the bar width
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
                max: Math.max(...annualData.map((data) => data.value)) * 1.5,
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

export default AnnualReturnChart;
