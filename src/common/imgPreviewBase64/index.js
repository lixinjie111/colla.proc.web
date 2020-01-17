function imgPreviewBase64(obj, file, callback){
    let fileName = file.name;
    let regex = /(.png)$/;
    if (!regex.test(fileName.toLowerCase())) {
        obj.$message({
            type: 'error',
            duration: '1500',
            message: "请选择png的图片文件",
            showClose: true
        });
        return false;
    }

    const isLt2M = file.size / 1024 / 1024 <= 0.5;
    if (!isLt2M) {
        obj.$message({
            type: 'error',
            duration: '1500',
            message: "上传图片大小不能超过500kB",
            showClose: true
        });
        return false;
    }
    
    // if(window.URL.createObjectURL) {
    //     let src = window.URL.createObjectURL(file);
    //     if(callback && typeof callback == "function") callback(src);
    // } else { // 降级处理
    //     if(callback && typeof callback == "function") callback(file.value);
    // }

    if (window.FileReader) { // html5方案
        var fr = new FileReader();
        fr.onload = function(e) {
            var src = e.target.result;
            // 模拟数据-------------------------------------------------
            // src = "http://jjcm2018.com/upload/15406317593.png";
            if(callback && typeof callback == "function") callback(src);
        }
        fr.readAsDataURL(file);
    } else { // 降级处理
        if(callback && typeof callback == "function") callback(file.value);
    }
}

function getImgSize(obj, url) {
      return new Promise((resolve, reject) => {
        let img = new Image();
        img.src = url;
        img.onload = function () {
          resolve({
            width: img.width,
            height: img.height
          });
        };
        img.onerror = function () {
          obj.$message({
            type: 'error',
            duration: '1500',
            message: "图片加载错误！",
            showClose: true
          });
          reject();
        }
      });
    }
export {
    imgPreviewBase64,
    getImgSize
};