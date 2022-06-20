<template>
  <!-- 顶部面包屑导航 -->
  <el-breadcrumb separator-class="el-icon-arrow-right">
    <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item>商品管理</el-breadcrumb-item>
    <el-breadcrumb-item>商品列表</el-breadcrumb-item>
  </el-breadcrumb>

  <!--  卡片-->
  <el-card class="box-card">
    <el-alert title="添加商品信息" type="info" show-icon> </el-alert>
    <!-- 完成进度 -->
    <!-- active接受的参数为数字， activeIndex为字符串，-0之后会变成数字-->
    <el-steps
      :space="200"
      :active="activeIndex - 0"
      finish-status="success"
      align-center
    >
      <el-step title="基本信息"></el-step>
      <el-step title="商品参数"></el-step>
      <el-step title="商品属性"></el-step>
      <el-step title="商品图片"></el-step>
      <el-step title="商品内容"></el-step>
      <el-step title="完成"></el-step>
    </el-steps>

    <!-- 表单 -->
    <el-form
      :model="addForm"
      :rules="addFormRules"
      ref="addFormRef"
      label-width="100px"
      label-position="top"
    >
      <!-- 标签栏 -->
      <el-tabs
        tab-position="left"
        v-model="activeIndex"
        :before-leave="tabLeave"
        @tab-click="tabsChange"
      >
        <el-tab-pane label="基本信息" name="0">
          <el-form-item label="商品名称" prop="goods_name">
            <el-input v-model="addForm.goods_name"></el-input>
          </el-form-item>
          <el-form-item label="商品价格" prop="goods_price">
            <el-input v-model="addForm.goods_price" type="number"> </el-input>
          </el-form-item>
          <el-form-item label="商品重量" prop="goods_weight">
            <el-input v-model="addForm.goods_weight" type="number"></el-input>
          </el-form-item>
          <el-form-item label="商品数量" prop="goods_number">
            <el-input v-model="addForm.goods_number" type="number"></el-input>
          </el-form-item>
          <el-form-item label="商品分类">
            <el-cascader
              :options="cateList"
              v-model="addForm.goods_cat"
              :props="cateProps"
              @change="handleChange"
            >
            </el-cascader>
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane label="商品参数" name="1">
          <!-- 动态参数 -->
          <el-form-item
            :label="item.attr_name"
            v-for="item in manyTableData"
            :key="item.attr_id"
          >
            <!-- 复选框 -->
            <el-checkbox-group v-model="item.attr_vals">
              <el-checkbox
                :label="cb"
                v-for="(cb, i) in item.attr_vals"
                :key="i"
                border
              ></el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane label="商品属性" name="2">
          <!-- 静态属性 -->
          <el-form-item
            :label="item.attr_name"
            v-for="item in onlyTableData"
            :key="item.attr_id"
          >
            <el-input v-model="item.attr_vals"></el-input>
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane label="商品图片" name="3">
          <!-- 图片上传 -->
          <el-upload
            :action="uploadURL"
            :headers="headerObj"
            :on-preview="handlePreview"
            :on-remove="handleRemove"
            :on-success="handleSuccess"
            list-type="picture"
          >
            <el-button size="small" type="primary">点击上传</el-button>
          </el-upload>
        </el-tab-pane>
        <el-tab-pane label="商品内容" name="4">
          <!-- wangeditor文本输入框 -->

          <div ref="editor" class="wangeditor"></div>

          <el-button type="primary" @click="add">添加商品</el-button>
        </el-tab-pane>
      </el-tabs>
    </el-form>
  </el-card>

  <!-- 图片预览对话框 -->
  <el-dialog title="图片预览" v-model="dialogVisible" width="50%">
    <img :src="imgPath" class="previewImg" />
  </el-dialog>
</template>

<script>
import {
  defineComponent,
  getCurrentInstance,
  reactive,
  ref,
  toRefs,
  computed,
  onMounted,
  onBeforeUnmount
} from "vue";
import WangEditor from "wangeditor";

export default defineComponent({
  name: "App",
  setup() {
    const { proxy } = getCurrentInstance();

    // =============================================================================
    // 完成进度和标签栏位置
    const activeIndex = ref("0");

    // =============================================================================
    // 表单
    // 表单数据
    const addForm = reactive({
      goods_name: "",
      goods_cat: [],
      goods_price: "",
      goods_number: "",
      goods_weight: "",
      goods_introduce: "商品介绍",
      pics: [],
      attrs: []
    });
    // 表单填写规则
    const addFormRules = reactive({
      goods_name: [
        { required: true, message: "请输入商品名称", trigger: "blur" }
      ],
      goods_price: [
        { required: true, message: "请输入商品价格", trigger: "blur" }
      ],
      goods_weight: [
        { required: true, message: "请输入商品重量", trigger: "blur" }
      ],
      goods_number: [
        { required: true, message: "请输入商品数量", trigger: "blur" }
      ]
    });

    //  获取商品分类列表
    const getCateList = async () => {
      const { data: res } = await proxy.$http.get("categories");
      if (res.meta.status != 200)
        return proxy.$message.error("商品分类查询失败" + res.meta.msg);
      cateList.cateList = res.data;
    };
    getCateList();

    // 级联选择器选项,商品分类列表
    const cateList = reactive({
      cateList: []
    });
    // 级联选择器参数
    const cateProps = reactive({
      label: "cat_name",
      value: "cat_id",
      children: "children",
      expandTrigger: "hover"
    });
    // 选择器选择后,判断是否是选择第三级
    const handleChange = () => {
      if (addForm.goods_cat.length < 3) {
        addForm.goods_cat = [];
      }
    };
    // 离开标签页 判断是否选择了商品分类,没选择就不让他跳转
    const tabLeave = (act, old) => {
      if (addForm.goods_cat.length < 3) {
        proxy.$message.error("请先选择商品分类");
        return false;
      }
      return true;
    };

    // 动态参数
    const manyTableData = reactive({
      manyTableData: []
    });
    // 静态属性
    const onlyTableData = reactive({
      onlyTableData: []
    });

    // 获取动态参数
    const getManyTableData = async () => {
      const { data: res } = await proxy.$http.get(
        `categories/${cateId.value}/attributes`,
        {
          params: { sel: "many" }
        }
      );
      res.data.forEach(el => {
        el.attr_vals = el.attr_vals.length === 0 ? [] : el.attr_vals.split(",");
      });
      console.log(res);
      if (res.meta.status != 200)
        return proxy.$message.error("商品分类查询失败" + res.meta.msg);

      manyTableData.manyTableData = res.data;
    };
    // 获取静态属性
    const getOnlyTableData = async () => {
      const { data: res } = await proxy.$http.get(
        `categories/${cateId.value}/attributes`,
        {
          params: { sel: "only" }
        }
      );
      console.log(res);
      if (res.meta.status != 200)
        return proxy.$message.error("商品分类查询失败" + res.meta.msg);

      onlyTableData.onlyTableData = res.data;
    };

    // 切换标签页时，获取商品分类参数数据
    // 如果切换标签时没有切到1和2号，商品参数和属性就没被获取到
    const tabsChange = () => {
      if (addForm.goods_cat.length == 3) {
        if (activeIndex.value == 1) getManyTableData();
        else if (activeIndex.value == 2) getOnlyTableData();
      }
    };

    // 计算商品分类id
    const cateId = computed(() => addForm.goods_cat[2] + 0);

    // 图片上传
    const uploadURL = ref(proxy.$http.defaults.baseURL + "upload");
    // const uploadURL = ref("http://127.0.0.1:8888/api/private/v1/upload");
    // 预览图片地址
    const imgPath = ref("");
    // 预览图片对话框
    const dialogVisible = ref(false);
    // 图片上传头
    const headerObj = reactive({
      Authorization: window.sessionStorage.getItem("token")
    });
    // 图片上传成功 添加到addForm里
    const handleSuccess = res => {
      const pic = { pic: res.data.tmp_path };
      addForm.pics.push(pic);
      console.log(addForm.pics);
    };
    // 图片预览，获取地址，打开对话框
    const handlePreview = f => {
      imgPath.value = f.response.data.url;
      dialogVisible.value = true;
    };
    // 图片移除
    const handleRemove = f => {
      const filePath = f.response.data.tmp_path;
      addForm.pics.splice(
        addForm.pics.findIndex(el => el.pic == filePath),
        1
      );
      console.log(addForm.pics);
    };

    // 表单引用
    const addFormRef = ref(null);
    // 商品添加
    const add = () => {
      addFormRef.value.validate(async val => {
        if (!val) {
          return proxy.$message.error("请填写完整表单项");
        }

        addForm.goods_cat = addForm.goods_cat.join(",");
        console.log(manyTableData.manyTableData);
        console.log(onlyTableData.onlyTableData);

        // 添加动态参数和静态属性
        manyTableData.manyTableData.forEach(el => {
          const newInfo = {
            attr_id: el.attr_id,
            attr_value: el.attr_vals.join(" ")
          };
          addForm.attrs.push(newInfo);
        });
        onlyTableData.onlyTableData.forEach(el => {
          const newInfo = {
            attr_id: el.attr_id,
            attr_value: el.attr_vals
          };
          addForm.attrs.push(newInfo);
        });

        const { data: res } = await proxy.$http.post("goods", addForm);
        console.log(res);
        if (res.meta.status != 201)
          return proxy.$message.error("商品分类查询失败" + res.meta.msg);

        proxy.$message.success("添加成功");
        proxy.$router.push("/goods");
      });
    };

    // =============================================================================
    // wangeitor
    const editor = ref();
    // 创建
    let instance;
    onMounted(() => {
      instance = new WangEditor(editor.value);
      // Object.assign(target,source)
      // 将所有可枚举属性的值从一个或多个源对象分配到目标对象
      // 相当于editor.config.onchange =...
      Object.assign(instance.config, {
        onchange() {
          addForm.goods_introduce = instance.txt.text();
          console.log("change");
        }
      });
      // 设置延迟 并没什么用
      // instance.config.onchangeTimeout = 500; // 修改为 500 ms
      instance.create();
    });
    // 销毁
    onBeforeUnmount(() => {
      instance.destroy();
      instance = null;
    });

    return {
      activeIndex,
      addForm,
      addFormRules,
      cateProps,
      uploadURL,
      headerObj,
      imgPath,
      dialogVisible,
      addFormRef,
      editor,
      ...toRefs(cateList),
      ...toRefs(manyTableData),
      ...toRefs(onlyTableData),
      handleChange,
      tabLeave,
      tabsChange,
      handlePreview,
      handleRemove,
      handleSuccess,
      add
    };
  }
});
</script>

<style scoped>
.el-checkbox {
  margin: 0 8px 0 0 !important;
}
.previewImg {
  width: 100%;
}
.wangeditor {
  margin-bottom: 20px;
}
</style>
