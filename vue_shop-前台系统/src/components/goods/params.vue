<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>分类参数</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <el-alert show-icon title="注意：只允许为第三级分类设置相关参数!" type="warning" :closable="false">
      </el-alert>
      <!-- 选择商品分类区域 -->
      <el-row class="cat-opt">
        <el-col>
          <span>选择商品分类：</span>
          <!--选择商品分类的级联选择框-->
          <el-cascader v-model="selectedCatekeys" :options="catelist" :props="cateProps" @change="handleChange"
            style="min-width:250px" placeholder="请先选择商品"></el-cascader>
        </el-col>
      </el-row>
      <!-- tab标签页 -->
      <el-tabs v-model="activeName" @tab-click="handleTabClick">
        <!--  动态参数 面板-->
        <el-tab-pane label="动态参数" name="many">
          <el-button type="primary" size="mini" :disabled="isBtnDisabled" @click="addDialogvisible = true">
            添加参数
          </el-button>
          <!-- 动态参数表格 -->
          <el-table :data="manyTableData" border stripe>
            <!-- 展开行 -->
            <el-table-column type="expand">
              <template slot-scope="scope">
                <!-- tag标签 -->
                <el-tag closable v-for="(item, i) in scope.row.attr_vals" :key="i" @close="handleClose(i, scope.row)">
                  {{ item }}</el-tag>
                <el-input class="input-new-tag" v-if="scope.row.inputVisible" v-model="scope.row.inputValue"
                  ref="saveTagInput" size="small" @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)">
                </el-input>
                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag
                </el-button>
              </template>
            </el-table-column>
            <el-table-column type="index"></el-table-column>
            <el-table-column label="参数名称" prop="attr_name"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row.attr_id)">编辑
                </el-button>
                <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeParams(scope.row.attr_id)">删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <!--  静态属性 面板-->
        <el-tab-pane label="静态属性" name="only">
          <el-button type="primary" size="mini" :disabled="isBtnDisabled" @click="addDialogvisible = true">
            添加属性
          </el-button>
          <!-- 静态参数表格 -->
          <el-table :data="onlyTableData" border stripe>
            <!-- 展开行 -->
            <el-table-column type="expand">
              <template slot-scope="scope">
                <!-- tag标签 -->
                <el-tag closable v-for="(item, i) in scope.row.attr_vals" :key="i" @close="handleClose(i, scope.row)">
                  {{ item }}</el-tag>
                <el-input class="input-new-tag" v-if="scope.row.inputVisible" v-model="scope.row.inputValue"
                  ref="saveTagInput" size="small" @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)">
                </el-input>
                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag
                </el-button>
              </template>
            </el-table-column>
            <el-table-column type="index"></el-table-column>
            <el-table-column label="属性名称" prop="attr_name"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row.attr_id)">编辑
                </el-button>
                <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeParams(scope.row.attr_id)">删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>
    <!-- 添加 对话框 -->
    <el-dialog @close="addDialogclosed" :title="'添加' + titleText" :visible.sync="addDialogvisible" width="50%">
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px">
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="addForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogvisible = false">取 消</el-button>
        <el-button type="primary" @click="addParams">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改按钮对话框 -->
    <el-dialog @close="editDialogclosed" :title="'修改' + titleText" :visible.sync="editDialogvisible" width="50%">
      <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="100px">
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="editForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogvisible = false">取 消</el-button>
        <el-button type="primary" @click="editParams">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    name: "VueParams",

    components: {},

    directives: {},

    data() {
      return {
        //商品分类列表
        catelist: [],
        //   级联选择框的配置对象
        cateProps: {
          value: "cat_id",
          label: "cat_name",
          children: "children",
          expandTrigger: "hover"
        },
        //级联选择框双向绑定到的数组
        selectedCatekeys: [],
        //被激活的页签的名称
        activeName: "many",
        //   静态参数数据
        onlyTableData: [],
        //   动态参数数据
        manyTableData: [],
        // 控制添加对话框的显示与隐藏
        addDialogvisible: false,
        addForm: {
          attr_name: ""
        },
        addFormRules: {
          attr_name: [{
            required: true,
            message: "请输入参数名称",
            trigger: "blur"
          }]
        },
        // 修改按钮的相关属性
        editDialogvisible: false,
        editForm: {
          attr_name: ""
        },
        editFormRules: {
          attr_name: [{
            required: true,
            message: "请输入参数名称",
            trigger: "blur"
          }]
        }
      };
    },
    created() {
      this.getCatelist();
    },
    mounted() {},
    computed: {
      //如果按钮需要被禁用，则返回true，否则返回false
      isBtnDisabled() {
        if (this.selectedCatekeys.length !== 3) {
          return true;
        }
        return false;
      },
      //当前选中的三级分类的Id
      cateId() {
        if (this.selectedCatekeys.length === 3) {
          return this.selectedCatekeys[2];
        }
        return null;
      },
      //动态计算标题的文本
      titleText() {
        if (this.activeName === "many") {
          return "动态参数";
        }
        return "静态属性";
      }
    },
    methods: {
      //获取所有的商品分类列表
      async getCatelist() {
        const {
          data: res
        } = await this.$http.get("categories");
        if (res.meta.status !== 200) {
          return this.$message.error("获取商品分类失败!");
        }

        this.catelist = res.data;
        //   console.log(this.catelist);
      },
      //级联选择框选中项变化，会触发这个函数
      async handleChange() {
        this.getParamsData();
      },
      // tab页签点击事件的处理函数
      handleTabClick() {
        //   console.log(this.activeName);
        this.getParamsData();
      },
      //获取参数的列表数据
      async getParamsData() {
        //   console.log(this.selectedCatekeys);
        //证明选中的不是三级分类
        if (this.selectedCatekeys.length !== 3) {
          this.selectedCatekeys = [];
          this.$message.info("请先选择商品!");
          this.manyTableData = [];
          this.onlyTableData = [];
          return;
        }
        //证明选中是三级分类
        //根据所选分类的Id，和当前所处的面板，获取对应的参数
        const {
          data: res
        } = await this.$http.get(
          `categories/${this.cateId}/attributes`, {
            params: {
              sel: this.activeName
            }
          }
        );
        if (res.meta.status !== 200) {
          return this.$message.error("获取参数列表失败!");
        }
        // 将字符串转换为一个数组
        res.data.forEach(item => {
          item.attr_vals = item.attr_vals ? item.attr_vals.split(" ") : [];
          //控制文本框的显示与隐藏
          item.inputVisible = false;
          //文本框中输入的值
          item.inputValue = "";
        });
        // console.log(res.data);

        if (this.activeName === "many") {
          this.manyTableData = res.data;
          // console.log(this.manyTableData);
        } else {
          this.onlyTableData = res.data;
        }
      },
      //   监听对话框,关闭事件
      addDialogclosed() {
        this.$refs.addFormRef.resetFields();
      },
      //   对话框点击确认按钮
      addParams() {
        //   表单预验证
        this.$refs.addFormRef.validate(async valid => {
          if (!valid) {
            return this.$message.error("请正确填写表单");
          }
          // 发起请求,拿到数据
          const {
            data: res
          } = await this.$http.post(
            `categories/${this.cateId}/attributes`, {
              attr_name: this.addForm.attr_name,
              attr_sel: this.activeName
            }
          );

          if (res.meta.status !== 201) {
            return this.$message.error("添加参数失败！");
          }
          this.$message.success("添加参数成功！");
          this.addDialogvisible = false;
          this.getParamsData();
        });
      },
      //   点击编辑按钮,修改的对话框
      async showEditDialog(attr_id) {
        const {
          data: res
        } = await this.$http.get(
          `categories/${this.cateId}/attributes/${attr_id}`, {
            params: {
              attr_sel: this.activeName
            }
          }
        );
        if (res.meta.status !== 200) {
          return this.$message.error("获取参数信息失败!");
        }
        this.editForm = res.data;
        this.editDialogvisible = true;
      },
      //   修改对话框关闭,重置修改表单
      editDialogclosed() {
        this.$refs.editFormRef.resetFields();
      },
      //   修改对话框,点击确认按钮
      editParams() {
        this.$refs.editFormRef.validate(async valid => {
          if (!valid) {
            return;
          }
          const {
            data: res
          } = await this.$http.put(
            `categories/${this.cateId}/attributes/${this.editForm.attr_id}`, {
              attr_name: this.editForm.attr_name,
              attr_sel: this.activeName
            }
          );
          if (res.meta.status !== 200)
            return this.$message.error("修改参数失败!");
          this.$message.success("修改参数成功!");
          this.getParamsData();
          this.editDialogvisible = false;
        });
      },
      //   对话框的删除事件
      async removeParams(attr_id) {
        const confirmResult = await this.$confirm(
          "此操作将永久删除该参数, 是否继续?",
          "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          }
        ).catch(err => err);
        // 取消删除选择
        if (confirmResult !== "confirm") {
          return this.$message.info("已取消删除！");
        }
        const {
          data: res
        } = await this.$http.delete(
          `categories/${this.cateId}/attributes/${attr_id}`
        );

        if (res.meta.status !== 200) {
          return this.$imessage.error("删除参数失败!");
        }
        this.$message.success("删除参数成功!");
        this.getParamsData();
      },
      //文本框失去焦点，或想下了 Enter都会触发
      handleInputConfirm(row) {
        if (row.inputValue.trim().length === 0) {
          row.inputValue = "";
          row.inputVisible = false;
          return;
        }
        // 真实内容,后续处理
        row.attr_vals.push(row.inputValue.trim());
        row.inputValue = "";
        row.inputVisible = false;
        // 需要发起请求，保存这次操作
        this.saveAttrVals(row);
      },
      // 封装出来
      async saveAttrVals(row) {
        // 需要发起请求，保存这次操作
        const {
          data: res
        } = await this.$http.put(
          `categories/${this.cateId}/attributes/${row.attr_id}`, {
            attr_name: row.attr_name,
            attr_sel: row.attr_sel,
            attr_vals: row.attr_vals.join(" ")
          }
        );
        if (res.meta.status !== 200) {
          return this.$message.error("修改参数项失败！");
        }
        this.$message.success("修改参数项成功！");
      },
      // 点击了 tag 按钮
      showInput(row) {
        row.inputVisible = true;
        // 本文框自动获得焦点
        //$nextTick方法的作用，就是当页面上元素被重新渲染之后，才会指定回调函数中的代码
        this.$nextTick(_ => {
          this.$refs.saveTagInput.$refs.input.focus();
        });
      },
      // tag删除事件
      handleClose(i, row) {
        row.attr_vals.splice(i, 1);
        this.saveAttrVals(row);
      }
    }
  };

</script>

<style lang="less" scoped>
  .cat-opt {
    margin: 15px 0;
  }

  .el-tag {
    margin: 5px;
  }

  .input-new-tag {
    width: 150px;
    margin: 5px;
  }

</style>
