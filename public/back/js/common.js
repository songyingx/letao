$(function() {
   /*
    // 开启进度条
    NProgress.start() ;
    // 结束进度条
    NProgress.done();
    */


    $(document).ajaxStart(function() {
        NProgress.start();
    })

    $(document).ajaxStop(function() {
        NProgress.done();
    })
})