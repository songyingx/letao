$(function () {
    /*
     // 开启进度条
     NProgress.start() ;
     // 结束进度条
     NProgress.done();
     */


    $(document).ajaxStart(function () {
        NProgress.start();
    })

    $(document).ajaxStop(function () {
        NProgress.done();
    })


    // 公用功能
    // 1左侧二级切换功能
    $('#category').click(function () {
        $(this).next().stop().slideToggle();
    })

    // 2.左边菜单切换功能
    $('.lt_topbar .icon_left').click(function () {
        $('.lt_aside').toggleClass('hidemenu');
        $('.lt_topbar').toggleClass('hidemenu');
        $('.lt_main').toggleClass('hidemenu');
    })

    // 3.公共退出功能
    $('.lt_topbar .icon_right').click(function () {
        $('#logoutModal').modal('show');
    });
    $('#logoutBtn').click(function () {
        // 调用接口，
        $.ajax({
            type: "get",
            url: "/employee/employeeLogout",
            dataType: "json",
            success: function (info) {
                console.log(info);
                if (info.success) {
                    location.href = "login.html";
                }
            }
        })
    })
})