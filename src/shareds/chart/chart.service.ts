import { Injectable } from '@nestjs/common';
// import QuickChart from 'quickchart-js';
const QuickChart = require('quickchart-js');

@Injectable()
export class ChartService {
  async renderBarChart(owner: string, topicsSizePer: { name: string, percentage: number }[], topicRestData: { name: string, topicRepoPer: number, topicRepoFrac: string }[]): Promise<Buffer> {
    const top25 = topicsSizePer
      .sort((a, b) => b.percentage - a.percentage)
      .slice(0, 25);
    const merged = topicsSizePer.map(topic => {
      const rest = topicRestData.find(r => r.name === topic.name);
      if (!rest) console.warn(`No matching data found for topic: ${topic.name}`);
      return {
        ...topic,
        ...rest,
        topicImportanceScore: (topic.percentage * rest!.topicRepoPer) / 20,
      };
    });


    const labels = top25.map(d => d.name);
    const topicSizePer = top25.map(d => d.percentage);
    const bubbleData = merged.map((d, i) => ({
      x: i,
      y: d.topicRepoPer,
      r: Math.max(1, d.topicRepoPer! * 0.2), // radio proporcional a topicRepoPer, mínimo 6
    })); const topicRepoFrac = merged.map(d => d.topicRepoFrac);
    const topicImportanceScore = merged.map(d => d.topicImportanceScore);



    const backgroundColor = [
      // Azul oscuro (7)
      'rgba(0, 51, 102, 0.8)',    // #003366
      'rgba(0, 76, 153, 0.8)',    // #004c99
      'rgba(0, 102, 153, 0.8)',   // #0066cc
      'rgba(51, 102, 153, 0.8)',  // #336699
      'rgba(51, 122, 183, 0.8)',  // #337ab7
      'rgba(66, 139, 202, 0.8)',  // #428bca
      'rgba(91, 154, 214, 0.8)',  // #5b9ad6

      // Azul oscuro a azul claro (6)
      'rgba(102, 178, 255, 0.8)', // #66b2ff
      'rgba(128, 191, 255, 0.8)', // #80bfff
      'rgba(153, 204, 255, 0.8)', // #99ccff
      'rgba(179, 217, 255, 0.8)', // #b3d9ff
      'rgba(204, 229, 255, 0.8)', // #cce5ff
      'rgba(230, 242, 255, 0.8)', // #e6f2ff

      // Rojo claro a rojo medio (6)
      'rgba(255, 204, 204, 0.8)', // #ffcccc
      'rgba(255, 179, 179, 0.8)', // #ffb3b3
      'rgba(255, 153, 153, 0.8)', // #ff9999
      'rgba(255, 128, 128, 0.8)', // #ff8080
      'rgba(255, 102, 102, 0.8)', // #ff6666
      'rgba(255, 77, 77, 0.8)',   // #ff4d4d

      // Rojo medio a rojo oscuro (6)
      'rgba(255, 51, 51, 0.8)',   // #ff3333
      'rgba(255, 26, 26, 0.8)',   // #ff1a1a
      'rgba(255, 0, 0, 0.8)',     // #ff0000
      'rgba(229, 0, 0, 0.8)',     // #e50000
      'rgba(204, 0, 0, 0.8)',     // #cc0000
      'rgba(179, 0, 0, 0.8)',     // #b30000
    ];
    const chart = new QuickChart();
    chart.setWidth(700);
    chart.setHeight(220);
    chart.setVersion('2');
    chart.setBackgroundColor('transparent');
    chart.setConfig({
      type: 'bar',
      data: {
        labels,
        datasets: [
          {
            //   label: `${owner} - Top 25 Technologies - by topics`,
            label: "Topic Size Percentage",
            data: topicSizePer,
            backgroundColor,
            borderColor: backgroundColor.map(color => color.replace('0.8', '1')),
            borderWidth: 2,
            fill: false,
            spanGaps: false,
            lineTransition: 0.4,
            pointRadius: 3,
            pointHoverRadius: 3,
            pointStyle: "circle",
            borderDash: [
              0,
              0
            ],
            barPercentage: 0.9,
            categoryPercentage: 0.8,
            type: "bar",
            hidden: false,
            borderRadius: 12,
            borderSkipped: false,
          },
          {
            type: 'bubble',
            label: 'Topic Repo Percentage',
            data: bubbleData,
            backgroundColor: "rgba(0, 0, 0, 0.8)",
            borderColor: backgroundColor.map(color => color.replace('0.8', '1')),

          },
          {
            "type": "line",
            "label": "Topic Importance Score",
            "backgroundColor": "rgba(0, 32, 32, 0.5)",
            "borderColor": "rgb(26, 0, 50)",
            "fill": false,
            "data": topicImportanceScore,
            pointRadius: 0,        // Oculta los puntos
            pointHoverRadius: 0
          }
        ]
      },
      options: {
        indexAxis: 'y',
        "title": {
          "display": true,
          "position": "top",
          "fontSize": 12,
          "fontFamily": "sans-serif",
          "fontColor": "#666666",
          "fontStyle": "bold",
          "padding": 10,
          "lineHeight": 0,
          "text": `${owner} - Top 25 Techs - by topics`
        },
        "layout": {
          "padding": {},
          "left": 0,
          "right": 0,
          "top": 0,
          "bottom": 0
        },
        "legend": {
          "display": false,
          "position": "top",
          "align": "center",
          "fullWidth": true,
          "reverse": false,
          "labels": {
            "fontSize": 12,
            "fontFamily": "sans-serif",
            "fontColor": "#666666",
            "fontStyle": "normal",
            "padding": 10
          }
        },
        scales: {
          x: {
            ticks: { color: '#fff', font: { size: 16 } },
            grid: { display: false }
          },
          y: {
            ticks: { color: '#fff', font: { size: 22 }, padding: 8 }, // Títulos más grandes
            grid: { display: false }
          }
        }
      }
    });
    chart.setFormat("svg")

    // Devuelve el buffer de la imagen
    return await chart.toBinary();
  }
}