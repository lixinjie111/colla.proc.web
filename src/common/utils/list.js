/**
 * 列表 数组操作
 */
class TList{
    constructor(){

    }
    
    /**
     * 复制item
     * @param {*} item 
     */
    static copyItem(item){
        return JSON.parse(JSON.stringify(item));
    }
    /**
     * 复制列表
     * @param {*} list 
     */
    static copyList(list){
        return JSON.parse(JSON.stringify(list));
    }

    /**
     * 根据id获取列表项
     * @param {*} list 
     * @param {*} id 
     */
    static getItemById(list,id){
        for(let i=0;i<list.length;i++){
            const temp = list[i];
            if(id == temp.id){
                return temp;
            }
        }
        return null;
    }
    /**
     * 根据列表项的prop属性获取列表项
     * @param {*} list 
     * @param {*} prop 
     * @param {*} value 
     */
    static getItemByProp(list,prop,value){
        for(let i=0;i<list.length;i++){
            const temp = list[i];
            if(temp.hasOwnProperty(prop) && temp[prop] == value){
                return temp;
            }
        }
        return null;
    }

    /**
     * 根据id删除数组项
     * @param {} list 
     * @param {*} id 
     */
    static deleteItemById(list,id){        

        let index = list.findIndex(item => {            
            return item.id == id;
        });        
        
        if( index < 0 ) return null;
        
        return list.splice(index,1);;
    }

    /**
     * 设置数组项的prop属性
     * @param {*} list 
     * @param {*} prop 
     * @param {*} value 
     */
    static setListProp(list,prop,value,prop2,value2){
        for(let i of list){
            i[prop] = value;
            i[prop2] = value2;
        }
    }

    /**
     * 根据id设置数组项prop属性
     * @param {*} list 
     * @param {*} id 
     * @param {*} prop 
     * @param {*} value 
     */
    static setListPropById(list,id,prop,value){
        let item = this.getItemById(list,id);
        item[prop] = value;
    }
}
export default TList;