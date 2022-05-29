<template>
  <div>
    <h1 class="title site__title">崽崽熊后台数据可视化</h1>
    <div id="main" style="width:100%; height:500px;"></div>
  </div>
</template>

<script>
import echarts from "echarts";

export default {
  name: "VueWelcome",

  data() {
    return {
      option: {
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b}: {c} ({d}%)"
        },
        legend: {
          data: [
            "大家电",
            "热门推荐",
            "海外购",
            "苏宁房产",
            "手机相机",
            "电脑办公",
            "厨卫电器",
            "食品酒水",
            "生活电器",
            "其他"
          ]
        },
        series: [
          {
            name: "浏览数量",
            type: "pie",
            selectedMode: "single",
            radius: [0, "30%"],
            label: {
              position: "inner",
              fontSize: 14
            },
            labelLine: {
              show: false
            },
            data: [
              { value: 1548, name: "大家电" },
              { value: 775, name: "热门推荐" },
              { value: 679, name: "海外购", selected: true }
            ]
          },
          {
            name: "浏览数量",
            type: "pie",
            radius: ["45%", "60%"],
            labelLine: {
              length: 30
            },
            label: {
              formatter: "{a|{a}}{abg|}\n{hr|}\n  {b|{b}：}{c}  {per|{d}%}  ",
              backgroundColor: "#F6F8FC",
              borderColor: "#8C8D8E",
              borderWidth: 1,
              borderRadius: 4,

              rich: {
                a: {
                  color: "#6E7079",
                  lineHeight: 22,
                  align: "center"
                },
                hr: {
                  borderColor: "#8C8D8E",
                  width: "100%",
                  borderWidth: 1,
                  height: 0
                },
                b: {
                  color: "#4C5058",
                  fontSize: 14,
                  fontWeight: "bold",
                  lineHeight: 33
                },
                per: {
                  color: "#fff",
                  backgroundColor: "#4C5058",
                  padding: [3, 4],
                  borderRadius: 4
                }
              }
            },
            data: [
              { value: 1048, name: "大家电" },
              { value: 335, name: "苏宁房产" },
              { value: 310, name: "海外购" },
              { value: 251, name: "热门推荐" },
              { value: 234, name: "手机相机" },
              { value: 147, name: "电脑办公" },
              { value: 135, name: "食品酒水" },
              { value: 102, name: "其他" }
            ]
          }
        ]
      }
    };
  },

  mounted() {
    var myChart = echarts.init(document.getElementById("main"));
    myChart.setOption(this.option);
  },

  methods: {}
};
</script>

<style lang="less" scoped>
.title {
  text-align: center;
  font-size: 30px;
}
.site__title {
  color: #f35626;
  background-image: -webkit-linear-gradient(92deg, #f35626, #feab3a);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  -webkit-animation: hue 10s infinite linear;
}
@-webkit-keyframes hue {
  from {
    -webkit-filter: hue-rotate(0deg);
  }
  to {
    -webkit-filter: hue-rotate(-360deg);
  }
}
</style>
