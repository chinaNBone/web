export default {
  option: {
    legend: {
      top: "0",
      textStyle: {
        fontSize: 12,
        color: "#303133"
      }
    },
    xAxis: {
      name: "分类",
      // boundaryGap: false,
      type: "category",
      data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      axisTick: {
        show: false,
        lineStyle: {
          width: 10,
          type: "solid"
        }
      },
      axisLine: {
        lineStyle: { color: "#303133" }
      },
      axisLabel: {
        color: "#303133"
      }
    },
    yAxis: {
      type: "value",
      name: "课程数/科",
      axisTick: {
        show: false
      },
      axisLine: {
        show: false
      },
      axisLabel: {
        color: "#303133"
      }
    },
    tooltip: {
      show: true,
      trigger: "axis"
      // formatter: "分类：{b}<br />课程：{c} 科"
    },
    series: [
      {
        name: "课程数",
        data: [820, 932, 901, 934, 1290, 1330, 1320],
        type: "line",
        itemStyle: {
          normal: {
            color: "#4E9AFF",
            lineStyle: {
              color: "#4E9AFF"
            }
          }
        }
      }
      // {
      //   name: "访问数",
      //   data: [30, 450, 330, 800, 100, 550, 1000],
      //   type: "line",
      //   itemStyle: {
      //     normal: {
      //       color: "#00BE6E",
      //       lineStyle: {
      //         color: "#00BE6E"
      //       }
      //     }
      //   }
      // }
    ]
  },

  option1: {
    legend: {
      top: "0",
      textStyle: {
        fontSize: 12,
        color: "#303133"
      }
    },
    tooltip: {
      show: true,
      trigger: "axis"
    },
    color: ["#3398DB"],
    dataZoom: [
      {
        type: "slider",
        show: true
      }
    ],
    xAxis: {
      name: "日期",
      type: "category",
      data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      axisTick: {
        show: false,
        lineStyle: {
          width: 10,
          type: "solid"
        }
      },
      axisLine: {
        lineStyle: { color: "#303133" }
      },
      axisLabel: {
        color: "#303133"
      }
    },
    yAxis: {
      type: "value",
      name: "用户数/人",
      axisTick: {
        show: false
      },
      axisLine: {
        show: true
      },
      axisLabel: {
        color: "#303133"
      }
    },
    series: [
      {
        name: "总用户数",
        data: [820, 932, 901, 934, 1290, 1330, 1320],
        type: "bar",
        barWidth: 25, //柱子宽度
        itemStyle: {
          normal: {
            color: "#4E9AFF",
            lineStyle: {
              color: "#4E9AFF"
            }
          }
        }
      },
      {
        name: "新增用户数",
        data: [30, 450, 330, 800, 100, 550, 1000],
        type: "line",
        itemStyle: {
          normal: {
            color: "#FEC400",
            lineStyle: {
              color: "#FEC400"
            }
          }
        }
      }
    ]
  }
};
