import Api from '@/api/index.js'

class DyDictionary{
    constructor(){
        this.url = '/common/dictionary/query/parentCode';
        this.list = [];
    }

    static getDictionaryByType(type){
              
        let params = {                
            parentCode: 'communType'
        };

        Api.post( this.url,params,
            response => {
                if (response.status >= 200 && response.status < 300) {                   

                    this.list = response.data;

                    let temp =  {id: 1, name: '请选择',key: ''};
                    this.list.unshift(temp);     
                    
                    return this.list;
                    
                } else {     
                    this.list = [];                    
                }
            }
        );

        return this.list;
    }
    static getNameByTypeAndKey(type,key){
    }
}
export default DyDictionary;