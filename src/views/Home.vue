<template>
  <div class="home">
    <loading :active.sync="isLoading"></loading>
    <!-- <Navbar /> -->
    <div class="container-fluid">
      <div class="mt-1">
        <div class="jumbotron">
          <h1 class="display-4">合成酚廠製程異常條件自轉OA異常單</h1>
          <hr class="my-4" />
          <p>
            異常等級說明<br />第一級：偏離管制值連續超過4小時即開立異常單<br />第二級：偏離管制值連續超過8小時即開立異常單<br />第三級：偏離管制值連續超過24小時即開立異常單
          </p>
        </div>
        <button
          type="button"
          class="btn btn-success"
          @click="openUpdateModal(true)"
        >
          新增Tag
        </button>
        <br />
        <br />
        <div class="card text-center">
          <div class="card-header">
            <ul class="nav nav-tabs card-header-tabs">
              <li class="nav-item">
                <a
                  class="nav-link"
                  :class="{ active: visibility == 'all' }"
                  @click.prevent="
                    visibility = 'all';
                    currentPage = 1;
                  "
                  href="#"
                  >全部</a
                >
              </li>
              <li class="nav-item">
                <a
                  class="nav-link"
                  :class="{ active: visibility == 'active' }"
                  @click.prevent="
                    visibility = 'active';
                    currentPage = 1;
                  "
                  href="#"
                  >啟用</a
                >
              </li>
              <li class="nav-item">
                <a
                  class="nav-link"
                  :class="{ active: visibility == 'inactive' }"
                  @click.prevent="
                    visibility = 'inactive';
                    currentPage = 1;
                  "
                  href="#"
                  >未啟用</a
                >
              </li>
            </ul>
          </div>
          <table class="table table-hover">
            <thead>
              <tr>
                <th scope="col">啟用</th>
                <th scope="col">Tag</th>
                <th scope="col">中文敘述</th>
                <th scope="col">當前值</th>
                <th scope="col">HI管制值</th>
                <th scope="col">LO管制值</th>
                <th scope="col">立案部門</th>
                <th scope="col">通知人員</th>
                <th scope="col">核決權限</th>
                <th scope="col">異常等級</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in filteredTagItems" :key="index">
                <td>
                  <input
                    v-model="item.啟用"
                    type="checkbox"
                    @click="activeTag(item.Name)"
                    key="item.Name"
                  />
                </td>
                <td>{{ item.piTag }}</td>
                <td>{{ item.Name }}</td>
                <td>{{ item.value }}</td>
                <td>{{ item.H }}</td>
                <td>{{ item.L }}</td>
                <td>{{ item.立案部門 }}</td>
                <td>{{ item.通知人員 }}</td>
                <td>{{ item.核決權限 }}</td>
                <td>{{ item.異常等級 }}</td>
                <td>
                  <button
                    type="button"
                    class="btn btn-warning btn-sm"
                    @click="openUpdateModal(false, item)"
                  >
                    編輯
                  </button>
                  <button
                    type="button"
                    class="btn btn-danger btn-sm"
                    @click="openDeleteModal(item)"
                  >
                    刪除
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <br />
        <nav aria-label="Page navigation example" v-show="pageTotal != 0">
          <ul class="pagination justify-content-center">
            <li class="page-item" :class="{ disabled: currentPage == 1 }">
              <a
                class="page-link"
                href="#"
                aria-label="Previous"
                @click.prevent="currentPage = currentPage - 1"
              >
                <span aria-hidden="true">&laquo;</span>
              </a>
            </li>
            <li
              class="page-item"
              v-for="(page, index) in pageTotal"
              :key="index"
              :class="{ active: currentPage == page }"
            >
              <a
                class="page-link"
                href="#"
                @click.prevent="currentPage = page"
                >{{ page }}</a
              >
            </li>
            <li
              class="page-item"
              :class="{ disabled: currentPage == pageTotal }"
            >
              <a
                class="page-link"
                href="#"
                aria-label="Next"
                @click.prevent="currentPage = currentPage + 1"
              >
                <span aria-hidden="true">&raquo;</span>
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </div>

    <!-- updateModal -->
    <div
      class="modal fade"
      id="updateModal"
      tabindex="-1"
      aria-labelledby="updateModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 v-if="isNew" class="modal-title" id="updateModalLabel">
              新增Tag
            </h5>
            <h5 v-else class="modal-title" id="updateModalLabel">編輯Tag</h5>
            <button
              type="button"
              class="close"
              data-dismiss="modal"
              aria-label="Close"
            >
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <form>
              <div class="form-group">
                <label for="tag-name" class="col-form-label">PI Tag</label>
                <input
                  type="text"
                  class="form-control"
                  name="PITag"
                  id="tag-name"
                  v-validate="'required'"
                  :class="{
                    'is-invalid': errors.has('PITag'),
                    'is-invalid': piTagError,
                  }"
                  v-model="tempTag.piTag"
                  placeholder="請輸入PI Tag"
                />
                <span class="text-danger" v-if="errors.has('PITag')">{{
                  errors.first("PITag")
                }}</span>
              </div>

              <div class="form-group">
                <label for="description" class="col-form-label">中文敘述</label>
                <input
                  type="text"
                  class="form-control"
                  name="中文敘述"
                  id="description"
                  v-validate="'required'"
                  :disabled="!isNew"
                  :class="{ 'is-invalid': errors.has('中文敘述') }"
                  v-model="tempTag.Name"
                  placeholder="請輸入中文敘述"
                />
                <span class="text-danger" v-if="errors.has('中文敘述')">{{
                  errors.first("中文敘述")
                }}</span>
              </div>

              <div class="row">
                <div class="form-group col-md-6">
                  <label for="H" class="col-form-label">HI管制值</label>
                  <input
                    type="text"
                    class="form-control"
                    name="HI管制值"
                    id="H"
                    v-validate="'required'"
                    :class="{ 'is-invalid': errors.has('HI管制值') }"
                    v-model="tempTag.H"
                    placeholder="請輸入HI管制值"
                  />
                  <span class="text-danger" v-if="errors.has('HI管制值')">{{
                    errors.first("HI管制值")
                  }}</span>
                </div>
                <div class="form-group col-md-6">
                  <label for="L" class="col-form-label">LO管制值</label>
                  <input
                    type="text"
                    class="form-control"
                    name="LO管制值"
                    id="L"
                    v-validate="'required'"
                    :class="{ 'is-invalid': errors.has('LO管制值') }"
                    v-model="tempTag.L"
                    placeholder="請輸入LO管制值"
                  />
                  <span class="text-danger" v-if="errors.has('LO管制值')">{{
                    errors.first("LO管制值")
                  }}</span>
                </div>
              </div>

              <div class="form-group">
                <label for="department" class="col-form-label">立案部門</label>
                <!-- v-validate="{ required: true }" -->
                <input
                  type="text"
                  class="form-control"
                  name="立案部門"
                  id="department"
                  v-validate="{ required: true, regex: /^4PH\d{2}$/ }"
                  :class="{ 'is-invalid': errors.has('立案部門') }"
                  v-model="tempTag.立案部門"
                  placeholder="請輸入部門代號"
                />
                <span class="text-danger" v-if="errors.has('立案部門')">{{
                  errors.first("立案部門")
                }}</span>
              </div>

              <div class="form-group">
                <label for="notes" class="col-form-label">通知人員</label>
                <input
                  type="text"
                  class="form-control"
                  name="通知人員"
                  id="notes"
                  v-validate="{ required: true, regex: /^[N]\d{9}$/ }"
                  :class="{ 'is-invalid': errors.has('通知人員') }"
                  v-model="tempTag.通知人員"
                  placeholder="請輸入Notes ID"
                />
                <span class="text-danger" v-if="errors.has('通知人員')">{{
                  errors.first("通知人員")
                }}</span>
              </div>

              <div class="form-group">
                <label for="decision" class="col-form-label">核決權限</label>
                <select
                  id="decision"
                  class="form-control"
                  v-model="tempTag.核決權限"
                  v-validate="'required'"
                  name="核決權限"
                  :class="{ 'is-invalid': errors.has('核決權限') }"
                >
                  <option disabled value>請選擇</option>
                  <option value="一級主管">一級主管</option>
                  <option value="二級主管">二級主管</option>
                </select>
                <span class="text-danger" v-if="errors.has('核決權限')">{{
                  errors.first("核決權限")
                }}</span>
              </div>

              <div class="form-group">
                <label for="lv" class="col-form-label">異常等級</label>
                <select
                  id="lv"
                  class="form-control"
                  v-model="tempTag.異常等級"
                  v-validate="'required'"
                  name="異常等級"
                  :class="{ 'is-invalid': errors.has('異常等級') }"
                >
                  <option disabled value>請選擇</option>
                  <option value="第一級">第一級</option>
                  <option value="第二級">第二級</option>
                  <option value="第三級">第三級</option>
                </select>
                <span class="text-danger" v-if="errors.has('異常等級')">{{
                  errors.first("異常等級")
                }}</span>
              </div>
            </form>
            <span class="text-danger" v-if="piTagError">找不到PI Tag</span>
            <span class="text-danger" v-if="elemError">中文敘述重複</span>
          </div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-secondary"
              data-dismiss="modal"
            >
              關閉
            </button>
            <button type="button" class="btn btn-primary" @click="updateTag">
              確認
            </button>
          </div>
        </div>
      </div>
    </div>
    <!-- deleteModal -->
    <div
      class="modal fade"
      id="deleteModal"
      tabindex="-1"
      aria-labelledby="deleteModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="deleteModalLabel">提示</h5>
            <button
              type="button"
              class="close"
              data-dismiss="modal"
              aria-label="Close"
            >
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">確認要刪除 {{ tempTag.Name }} ?</div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-secondary"
              data-dismiss="modal"
            >
              關閉
            </button>
            <button type="button" class="btn btn-primary" @click="deleteTag">
              確認
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import axios from "axios";
import $ from "jquery";
// import Navbar from "@/components/Navbar.vue";

axios.defaults.headers.common["Access-Control-Allow-Origin"] = "*";

export default {
  name: "Home",
  data() {
    return {
      tagItems: [],
      isLoading: false,
      piTagError: false,
      elemError: false,
      isNew: false,
      tempTag: {},
      visibility: "all",
      pageTotal: 0,
      currentPage: 1,
    };
  },
  methods: {
    openUpdateModal(isNew, item) {
      if (isNew) {
        this.tempTag = {};
        this.isNew = true;
      } else {
        this.tempTag = Object.assign({}, item);
        this.isNew = false;
      }
      $("#updateModal").modal("show");
    },
    openDeleteModal(item) {
      this.tempTag = Object.assign({}, item);
      $("#deleteModal").modal("show");
    },

    updateTag() {
      this.isLoading = true;
      const basicAuth = this.basicAuth;
      this.$validator.validate().then((result) => {
        if (result) {
          let url = `/api/api/getpitag?pitag=${this.tempTag.piTag}`;
          axios
            .get(url, basicAuth)
            .then((response) => {
              console.log(response);
              console.log("找到PI點");
              this.piTagError = false;
              if (this.isNew) {
                axios
                  .post("/api/api/addelem", this.tempTag)
                  .then((response) => {
                    console.log(response.data);
                    $("#updateModal").modal("hide");
                    this.getTag();
                    this.elemError = false;
                    this.isLoading = false;
                  })
                  .catch(() => {
                    this.elemError = true;
                    this.isLoading = false;
                  });
              } else {
                axios
                  .post("/api/api/updateelem", this.tempTag)
                  .then((response) => {
                    console.log(response.data);
                    $("#updateModal").modal("hide");
                    this.getTag();
                    this.elemError = false;
                    this.isLoading = false;
                  })
                  .catch(() => {
                    this.elemError = true;
                    this.isLoading = false;
                  });
              }
            })
            .catch((error) => {
              console.log(error);
              this.piTagError = true;
              this.isLoading = false;
            });
        } else {
          console.log("欄位不完整");
          this.isLoading = false;
        }
      });
    },
    deleteTag() {
      this.isLoading = true;
      axios.post("/api/api/deleteelem", this.tempTag).then((response) => {
        console.log(response.data);
        this.tempTag = {};
        $("#deleteModal").modal("hide");
        this.getTag();
      });
      this.isLoading = false;
    },
    activeTag(name) {
      this.isLoading = true;
      let tempTag = this.tagItems.find((item) => item.Name == name);
      let data = {
        Name: name,
        啟用: !tempTag["啟用"],
      };
      console.log(name);
      axios.post("/api/api/activeelem", data).then((response) => {
        console.log(response);
      });
      this.getTag();
      this.isLoading = false;
    },
    getTag() {
      this.isLoading = true;
      axios.get("/api/api/getelem").then((response) => {
        this.tagItems = response.data.data;
      });
      this.isLoading = false;
    },
    setPageTotal(page) {
      this.pageTotal = page;
    },
    setCurrentPage(page) {
      this.currentPage = page;
    },
  },
  computed: {
    filteredTagItems: function () {
      if (this.visibility == "all") {
        this.setPageTotal(0);
        var newTagItems = [];
        this.tagItems.forEach((item, index) => {
          var page = Math.ceil((index + 1) / 3);
          item["page"] = page;
          if (item["page"] == this.currentPage) {
            newTagItems.push(item);
          }
          this.setPageTotal(page);
        });
        return newTagItems;
      } else if (this.visibility == "active") {
        this.setPageTotal(0);
        var tempTagItems = [];
        newTagItems = [];
        this.tagItems.forEach((item) => {
          if (item["啟用"]) {
            tempTagItems.push(item);
          }
        });
        tempTagItems.forEach((item, index) => {
          var page = Math.ceil((index + 1) / 3);
          item["page"] = Math.page
          if (item["page"] == this.currentPage) {
            newTagItems.push(item);
          }
          this.setPageTotal(page);
        });
        return newTagItems;
      } else if (this.visibility == "inactive") {
        this.setPageTotal(0);
        tempTagItems = [];
        newTagItems = [];
        this.tagItems.forEach((item) => {
          if (!item["啟用"]) {
            tempTagItems.push(item);
          }
        });
        tempTagItems.forEach((item, index) => {
          var page = Math.ceil((index + 1) / 3);
          item["page"] = page;
          if (item["page"] == this.currentPage) {
            newTagItems.push(item);
          }
          this.setPageTotal(page);
        });
        return newTagItems;
      }
      return [];
    },
  },

  created() {
    this.getTag();
    setInterval(() => {
      this.getTag();
    }, 30000);
  },
  components: {
    // Navbar,
  },
};
</script>