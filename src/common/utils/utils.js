/**
 * 工具类，简化页面逻辑处理，提取公共方法放在这个工具类中
 */
import MenuList from '@/assets/menu.json'

class Utils{

    constructor(){

    }

    /**
     * 复制数据
     * @param {*} item 
     */
    static copyItem(item){
        return JSON.parse(JSON.stringify(item));
    }

    /**
     * 获取当前时间
     * @param {*} value 
     * @param {*} type  时间格式，默认：yy-mm-dd hh:mm:ss
     */
    static formatTime(value=null,type='yy-mm-dd hh:mm:ss'){
        return TDate.formatTime(value,type);
    }

    
    /**
     * 获取菜单中文名，只操作三级树，这个后面再修改为递归方式
     * @param {*} url 
     */
    static getMenuCnName(url){
        let menu = {
            name: null,
            child: null,
            grandChild: null,
        }
        for( let item of MenuList ){
            
            if(item.path == url){
                menu.name = item.name;                
                return menu;
            }else{
                if(item.children && item.children.length > 0){
                    for( let sub of item.children ){
                        
                        if(sub.path == url){
                            menu.name = item.name;
                            menu.child = sub.name;
                            return menu;
                        }
                        if(sub.children && sub.children.length > 0){
                            for(let ssub of sub.children){                                
                                if(ssub.path == url){
                                    menu.name = item.name;
                                    menu.child = sub.name;
                                    menu.grandChild = ssub.name;
                                    return menu;
                                }
                            }
                        }
                    }
                }
            }
        }
        return menu;
    }

    /**
     * 获取菜单项，只操作三级树，这个后面再修改为递归方式
     * @param {*} url 
     */
    static getMenuItem(url){
        let menu = {
            data: null,
            child: null,
            grandChild: null,
        };

        let arr = [];

        for( let item of MenuList ){
            
            if(item.path == url){
                let temp = {id: item.name , name: item.name, path: item.path };
                menu.data = temp;    
                arr.push(temp);            
                return menu;
            }else{
                if(item.children && item.children.length > 0){
                    for( let sub of item.children ){
                        
                        if(sub.path == url){
                            let temp = {id: item.name , name: item.name, path: item.path };    
                            let temp2 = {id: sub.name , name: sub.name, path: sub.path }
                            menu.data = item;
                            menu.child = sub;
                            arr.push(temp2);
                            return menu;
                        }
                        if(sub.children && sub.children.length > 0){
                            for(let ssub of sub.children){                                
                                if(ssub.path == url){
                                    menu.data = item;
                                    menu.child = sub;
                                    menu.grandChild = ssub;
                                    arr.push({id: ssub.name , name: ssub.name, path: ssub.path });
                                    return menu;
                                }
                            }
                        }
                    }
                }
            }
        }
        return {
            menu: menu,
            list: arr
        };
    }

    /**
     * 根据路由path设置菜单选中状态，只操作三级树，这个后面再修改为递归方式
     * @param {*} url 
     */
    static setMenuByPath(url){
        let arr = [];
        for( let item of MenuList ){
            item.isCheck = false;
            item.css = 'yk-tree-li';
            if(item.path == url){
                item.isCheck = true;
                item.css = 'yk-tree-li-selected';                
            }else{
                if(item.children && item.children.length > 0){

                    for( let sub of item.children ){
                        sub.isCheck = false;
                        sub.css = 'yk-tree-li';
                        if(sub.path == url){
                            sub.isCheck = true;
                            sub.css = 'yk-tree-li-selected';
                            item.isCheck = true;                            
                        }
                        if(sub.children && sub.children.length > 0){

                            for(let ssub of sub.children){
                                ssub.isCheck = false;
                                ssub.css = 'yk-tree-li';
                                if(ssub.path == url){
                                    ssub.isCheck = true;
                                    ssub.css = 'yk-tree-li-selected';
                                    sub.isCheck = true;
                                    item.isCheck = true;                                    
                                }
                            }
                        }
                    }
                }
            }
            
            // 登录进主页面，默认选中 home
            if( (item.path == '/home') && (url == '/main') ){
                item.css = 'yk-tree-li-selected'; 
            }

            arr.push(item);
        }
        return arr;
    }

    /**
     * 设置面包屑
     * @param {*} url 
     */
    static setBreadCrumbs(url){
        let tMenu = Utils.getMenuCnName(url);   
        let str = '';
        if(tMenu.name){
            str = tMenu.name;
        }
        if(tMenu.child){
            
            str = str + ' > ' + tMenu.child;
            // str = str + ' / ' + tMenu.child;
        }
        if(tMenu.grandChild){
            str = str + ' > ' +tMenu.grandChild;
            // str = str + ' / ' +tMenu.grandChild;
        }
        return str;
    }
    /**
     * 根据按钮编码判断是否有权限操作此按钮
     */
    static isPermission(value,arr){
        let isPermis = false;
        let isMatch = arr.find(item => {
            return value === item;
        })
        if(isMatch){
            isPermis = true;
        }else{
            isPermis = false;
        }
        return isPermis;
    }
}
export { Utils }

// export default new Utils();