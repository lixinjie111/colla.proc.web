const Util = {
    obj: {
        copy(item) {
            if (!item) return;
            return JSON.parse(JSON.stringify(item));
        },
        prop(item,key){
            if(!item || !item.hasOwnProperty(key)) return null;

            return item[key];
        }
    },
    list: {
        getItemByKey( arr = [], keyValue='', key='key') {
            
            let temp;
            if (!key || !keyValue || arr.length < 1) return null;
            for (let i = 0; i < arr.length; i++) {
                temp = arr[i];
                if (temp[key] == keyValue) {
                    return temp;
                }
            }
            return null;
        },
        hasItemByKey( arr = [], keyValue='', key='key') {
            let bool = false;
            if (!key || !keyValue || arr.length < 1) return bool;
            for (let i = 0; i < arr.length; i++) {
                let temp = arr[i];
                if (temp[key] == keyValue) {
                    bool = true;
                    break;
                }
            }
            return bool;
        },
        
        hasItemById(item = {}, arr = []) {
            let bool = false;
            if (!item || !item.id) return bool;
            for (let i = 0; i < arr.length; i++) {
                let temp = arr[i];
                if (temp.id == item.id) {
                    bool = true;
                    break;
                }
            }
            return bool;
        },
        updateItemById(item = {}, arr = []) {
            if (!item || !item.id) return;
            for (let i = 0; i < arr.length; i++) {
                let temp = arr[i];
                if (item.id == temp.id) { 
                    arr.splice(i, 1, item);
                }
            }
            return arr;
        },
        deleteItemById(item = {}, arr = []) {
            if (!item || !item.id) return;
            for (let i = 0; i < arr.length; i++) {
                let temp = arr[i];
                if (item.id == temp.id) {
                    arr = arr.splice(i, 1);
                    break;
                }
            }
            return arr;
        },
        deleteItemsByIds(arr1 = [], arr2 = []) {
            if (!arr1 || arr1.length == 0 || !arr2 || arr2.length == 0) return;

            for (let i = 0; i < arr1.length; i++) {
                const temp1 = arr1[i];
                for (let j = 0; j < arr2.length; j++) {
                    const temp2 = arr2[j];
                    if (temp2.id == temp1.id) {

                        arr2.splice(j, 1);
                        // break;
                    }
                }
            }
        },
        setAtt(arr = [], att = null, attVal = null) {
            
            if (!arr || arr.length == 0 || !att) return;
            for (let i = 0; i < arr.length; i++) {
                let temp = arr[i];
                if (temp.hasOwnProperty(att)) {
                    temp[att] = attVal;                    
                }
            }
        },
        addChildById(item = {}, arr = [], child = {}) {
            if (!item || !item.id) return;
            for (let i = 0; i < arr.length; i++) {
                const temp = arr[i];
                if (item.id == temp.id) {
                    temp.children.push(child);
                    break;
                }
            }
        }
    }

};
export default Util;