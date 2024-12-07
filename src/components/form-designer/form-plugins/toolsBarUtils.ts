export const exportJson  = (jsonData:any)=>{
    const jsonString = jsonData.value;
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'data.json' // 设置下载文件名
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

export const importJson = (event:any,callback:any )=>{
    const file = event.target.files[0];
    const data = {
        success:false,
        message:'',
        data:'',
        type:''
    }
    if (file) {
        const reader = new FileReader();
        reader.onload = (e:any) => {
            try {
                // 处理导入的 JSON 数据
                data['data'] = JSON.parse(e.target.result);
                data['success'] = true;
                data['message'] = '导入数据成功！';
                data['type'] = 'success';
                callback(data)
            } catch (error) {
                console.error('文件内容不是有效的 JSON:', error);
                data['success'] = false;
                data['message'] = '不是一个有效的json！';
                data['type'] = 'error';
                callback(data)
            }
        };
        reader.readAsText(file); // 读取文件内容
    }
}

export const fullScreen = ()=>{
    const doc = document.documentElement;
    if (!document.fullscreenElement) {
        doc.requestFullscreen();
    } else {
        document.exitFullscreen();
    }
}