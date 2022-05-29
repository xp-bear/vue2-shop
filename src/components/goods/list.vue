<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!--卡片视图区域-->
    <el-card>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear='getGoodsList'>
            <el-button slot="append" icon="el-icon-search" @click="getGoodsList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="goAddpage">添加商品</el-button>
        </el-col>
      </el-row>
      <!-- 表格区域 -->
      <el-table :data="goodslist" border stripe>
        <el-table-column type="index" label='#'></el-table-column>
        <el-table-column label='商品名称' prop='goods_name'></el-table-column>
        <el-table-column label='商品价格(元)' prop='goods_price' width='105px'></el-table-column>
        <el-table-column label='商品重量(kg)' prop='goods_weight' width='110px'></el-table-column>
        <el-table-column label='创建时间' prop='time' width='165px'>
          <template slot-scope="scope">
            {{scope.row.time|dateFormat}}
          </template>
        </el-table-column>
        <el-table-column label='操作' width='130px'>
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" size="mini"></el-button>
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeById(scope.row.goods_id)">
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum" :page-sizes="[5, 10, 15, 20]" :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper" :total="total" background>
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
  export default {
    name: "VueList",
    data() {
      return {
        // 请求参数
        queryInfo: {
          query: "",
          pagenum: 1,
          pagesize: 10
        },
        //商品列表
        goodslist: [],
        // 总数据条数
        total: 0
      };
    },
    created() {
      this.getGoodsList();
    },

    methods: {
      //根据分页获取对应的商品列表
      async getGoodsList() {
        const {
          data: res
        } = await this.$http.get("goods", {
          params: this.queryInfo
        });

        if (res.meta.status !== 200) {
          return this.Smessage.error("获取商品列表失败！");
        }
        // this.$message.success("获取商品列表成功！");
        res.data.goods.forEach(item => {
          item.time = Date.now()
        })
        // console.log(res.data.goods);
        this.goodslist = res.data.goods;
        this.total = res.data.total;
      },
      // 分页改变事件(每页显示多少条数据)
      handleSizeChange(newSize) {
        this.queryInfo.pagesize = newSize
        this.getGoodsList();
      },
      // 显示第几页
      handleCurrentChange(newPage) {
        this.queryInfo.pagenum = newPage
        this.getGoodsList();
      },
      // 删除按钮点击事件
      async removeById(id) {
        const result = await this.$confirm('此操作将永久该商品, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(e => e)
        if (result !== 'confirm') {
          return this.$message.info('已经取消删除！')
        }
        // 发请求删除商品
        const {
          data: res
        } = await this.$http.delete(`goods/${id}`)

        if (res.meta.status !== 200) {
          return this.$message.error('删除失败！')
        }
        this.$message.success('删除成功！')
        this.getGoodsList();
      },
      // 添加商品
      goAddpage() {
        this.$router.push('/goods/add')
      }
    }
  };

</script>

<style lang="less" scoped></style>
