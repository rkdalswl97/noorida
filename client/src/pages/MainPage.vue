<template>
  <div>
    <a-layout>
      <a-layout-header :style="{
                          position: 'fixed',
                          background: '#fff',
                          width: '100%',
                          padding: 0,
                          height: '50px',
                          boxShadow: '0 1px 5px rgba(57, 63, 72, 0.3)',
                          zIndex: 100,
                       }"
                       size="small">
        <div class="flex-container flex-between-sort flex-row">
          <router-link :to="{ name: 'LocalNewsTab' }"
                       tag="div"
                       active-class="active"
                       class="tab-pane text-center">{{ tab.pane1 }}</router-link>
          <router-link :to="{ name: 'SubscribeNewsTab' }"
                       tag="div"
                       active-class="active"
                       class="tab-pane text-center">{{ tab.pane2 }}</router-link>
          <router-link :to="{ name: 'HotNewsTab' }"
                       tag="div"
                       active-class="active"
                       class="tab-pane text-center">{{ tab.pane3 }}</router-link>
        </div>
      </a-layout-header>
      <a-layout-content class="content-wrap">
        <router-view></router-view>
      </a-layout-content>
      <a-layout-footer :style="{
                          width: '100%',
                          height: '70px',
                          padding: '0',
                       }">
        <div class="flex-container flex-between-sort flex-row footer">
          <a-button class="button-common"
                    shape="circle"
                    size="large">
            <a-icon type="search" />
          </a-button>
          <a-button class="button-primary"
                    type="primary"
                    shape="circle"
                    size="large"
                    @click="routeWritePage()">
            <a-icon type="edit" />
          </a-button>
          <a-button class="button-common"
                    shape="circle"
                    size="large"
                    @click="openSidebar">
            <a-icon type="ellipsis" />
          </a-button>
        </div>
      </a-layout-footer>
      <a-drawer title="메뉴"
                placement="right"
                width="250"
                :closable="false"
                @close="closeSidebar"
                :visible="sidebarVisible">
        <!-- menu content -->
        <div>
          <router-link :to="{name : ' '}"
                       tag= "p">프로필 페이지</router-link>
          <router-link :to="{name : ' '}"
                       tag= "p">설정</router-link>
          <router-link :to="{name : ' '}"
                       tag= "p">로그아웃</router-link>
        </div>
        <!-- menu content -->
        <div
          :style="{
          position: 'absolute',
          left: 0,
          bottom: 0,
          width: '100%',
          borderTop: '1px solid #e9e9e9',
          padding: '10px 16px',
          background: '#fff',
          textAlign: 'right',
        }">
          <a-button type="default" @click="closeSidebar">닫기</a-button>
        </div>
      </a-drawer>
    </a-layout>
  </div>
</template>

<script>
export default {
  name: 'MainPage',
  data() {
    return {
      sidebarVisible: false,
      tab: {
        pane1: '지역소식',
        pane2: '구독게시물',
        pane3: '지역핫토픽',
      },
    };
  },
  methods: {
    callback() {
    },
    openSidebar() {
      this.sidebarVisible = true;
    },
    closeSidebar() {
      this.sidebarVisible = false;
    },
    routeWritePage() {
      this.$router.replace({ name: 'WritePage' });
    },
  },
};
</script>

<style lang="scss" scoped>
  @import './../assets/scss/mixin/typography';
  $header-height: 50px;
  $footer-height: 70px;

  .content-wrap {
    width: 100%;
    height: calc(100vh - 70px);
    padding-top: $header-height;
    /*overflow-y: scroll;*/
  }

  .tab-pane {
    @include v-text-align($header-height);
    @include font-size-small;
    width: 80px;
    cursor: pointer;
    color: #0d1a26;
  }

  .active {
    color: #1890ff;
    background-color: #e6f7ff;
  }

  .footer {
    padding: 0 10px;

    .button-primary {
      width: 60px;
      height: 60px;
    }

    .button-common {
      width: 50px;
      height: 50px;
    }
  }

</style>
