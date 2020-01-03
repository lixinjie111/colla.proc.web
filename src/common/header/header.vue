<template>
<div id="header">
    <div class="logo">
        <img src="static/images/logo.png" class="logo-img"/>
        <em class="name">信息协同中心</em>
    </div>
    <div class="userinfo">
        <el-dropdown trigger="hover">
            <span class="el-dropdown-link userinfo-inner">
                <i class="icon iconfont el-icon-mc-yonghuzhongxin_f c-vertical-middle"></i>
                <em class="name c-vertical-middle">{{sysAdminName}}</em>
            </span>
            <el-dropdown-menu slot="dropdown" class="c-header-dropdown">
                <el-dropdown-item divided>版本V{{version}}</el-dropdown-item>
                <el-dropdown-item divided @click.native="logout">退出</el-dropdown-item>
            </el-dropdown-menu>
        </el-dropdown>
    </div>

</div>
</template>
<script>
import { mapActions } from 'vuex';
import { removeAuthInfo } from '@/session/index';
export default {
    name: "HeaderBar",
    data() {
        return {
            sysAdminName: this.$store.state.admin.adminName,
            version: window.config.version,
        }
    },
    methods: {
         ...mapActions(['goLogOut']),
        //退出登录
        logout: function() {
            this.$confirm('确认退出吗?', '提示', {
            }).then(() => {
                let _params = {
                    token: JSON.parse(localStorage.getItem("yk-token")).data
                };
                this.goLogOut(_params).then(res => {
                    removeAuthInfo();
                    localStorage.removeItem("yk-token");
                    this.$router.push({ path: '/login' });
                });
            }).catch(err => {
                console.log("取消退出！");
            });
        },
    }
}
</script>
<style lang="scss" scoped>
@import "@/assets/scss/theme.scss";
#header {
    background: #1a1d20;
    position: relative;
    padding: 11px 20px;
    height: 28px;
    @include layoutMode(between);
    .userinfo {
        .userinfo-inner {
            cursor: pointer;
            color: #999;
            .icon {
                font-size: 28px;
                line-height: 28px;
                margin-right: 10px;
            }
        }
    }
    .logo {
        @include layoutMode(align);
        .logo-img {
            height: 26px;
            margin-right: 10px;
        }
        .name {
            font-size: 24px;
            line-height: 28px;
            color: #fff;
            letter-spacing: 3px;
        }
    }
}
</style>
