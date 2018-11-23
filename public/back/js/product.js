$(function () {
    var currentPage = 1;
    var pageSize = 2;

    render();

    // 页面进入渲染
    function render() {
        $.ajax({
            type: "get",
            url: "/product/queryProductDetailList",
            data: {
                page: currentPage,
                pageSize: pageSize
            },
            dataType: "json",
            success: function (info) {
                console.log(info);
                var htmlStr = template('productTpl', info);
                $('tbody').html(htmlStr);

                // 分页
                $('#paginator').bootstrapPaginator({
                    bootstrapMajorVersion: 3,
                    currentPage: info.page,
                    totalPages: Math.ceil(info.total / info.size),
                    onPageClicked: function (a, b, c, page) {
                        currentPage = page;
                        render();
                    }
                })
            }
        })
    };

    // 添加商品按钮
    $('#addBtn').click(function () {
        $('#addModal').modal("show");

        $.ajax({
            type: "get",
            url: "/category/querySecondCategoryPaging",
            data: {
                page: 1,
                pageSize: 100
            },
            dataType: "json",
            success: function (info) {
                console.log(info);
                var htmlStr = template("dropdownTpl", info);
                $('.dropdown-menu').html(htmlStr);
            }
        })
    });

    // 给下拉菜单添加选中功能
    $('.dropdown-menu').on("click", "a", function () {
        var txt = $(this).text();
        $('#dropdownText').text(txt);
        var id = $(this).data("id");
        $('[name="brandId"]').val(id);

        $('#form').data("bootst    rapValidator").updateStatus("brandId", "VALID");
    });

    // 上传图片
    // $('#fileupload').fileupload({
    //     dataType: "json",
    //     done:function(e, data){
    //         console.log(data);
    //         var result = data.result;
    //         var picUrl = reault.picAddr;

    //     }
    // })

    // 表单验证
    $('#form').bootstrapValidator({
        excluded: [],
        feedbackIcons: {
            valid: 'glyphicon glyphicon-ok', // 校验成功
            invalid: 'glyphicon glyphicon-remove', // 校验失败
            validating: 'glyphicon glyphicon-refresh' // 校验中
        },

        fields: {
            brandId: {
                validators: {
                    notEmpty: {
                        message: "请选择二级分类"
                    }
                }
            },
            proName: {
                validators: {
                    notEmpty: {
                        message: "请输入商品名称"
                    }
                }
            },
            proDesc: {
                validators: {
                    notEmpty: {
                        message: "请输入商品描述"
                    }
                }
            },
            num: {
                validators: {
                    notEmpty: {
                        message: "请输入商品库存"
                    }
                }
            },
            size: {
                validators: {
                    notEmpty: {
                        message: "请输入商品尺码"
                    }
                }
            },
            oldPrice: {
                validators: {
                    notEmpty: {
                        message: "请输入商品原价"
                    }
                }
            },
            price: {
                validators: {
                    notEmpty: {
                        message: "请输入商品现价"
                    }
                }
            },
            picStarus: {
                validators: {
                    notEmpty: {
                        message: "请上传3张图片"
                    }
                }
            }
        }
    });
})