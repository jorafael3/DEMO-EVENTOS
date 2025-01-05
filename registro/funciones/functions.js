
function Mensaje(title, text, icon) {
    Swal.fire({
        title: title,
        text: text,
        icon: icon
    });
}

function AjaxSendReceiveData(url, data, callback) {
    var xmlhttp = new XMLHttpRequest();
    $.blockUI({
        message: '<div class="d-flex justify-content-center align-items-center"><p class="mr-50 mb-0">Cargando ...</p> <div class="spinner-grow spinner-grow-sm text-white" role="status"></div> </div>',
        css: {
            backgroundColor: 'transparent',
            color: '#fff',
            border: '0'
        },
        overlayCSS: {
            opacity: 0.5
        }
    });

    xmlhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            var data = this.responseText;
            data = JSON.parse(data);
            callback(data);
        }
    }
    xmlhttp.onload = () => {
        $.unblockUI();
        // 
    };
    xmlhttp.onerror = function () {
        $.unblockUI();
    };
    data = JSON.stringify(data);
    xmlhttp.open("POST", url, true);
    xmlhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xmlhttp.send(data);
}