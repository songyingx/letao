$(function () {
    var picArr = [];
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

        $('#form').data("bootstrapValidator").updateStatus("brandId", "VALID");
    });

    // 上传图片
    $('#fileupload').fileupload({
        dataType: "json",
        done: function (e, data) {
            var picObj = data.result;

            picArr.unshift(picObj);

            var picUrl = picObj.picAddr;
            $('#imgBox').prepend('<img src="' + picUrl + '" style="width:100px">');

            if (picArr.length > 3) {
                picArr.pop();
                $('#imgBox img:last-of-type').remove();
            }
            console.log(picArr);

            if (picArr.length === 3) {
                $('#form').data("bootstrapValidator").updateStatus("picStatus", "VALID");
            }

        }
    })

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
                    },
                    regexp: {
                        regexp: /^[1-9]\d*$/,
                        message: '商品库存必须是非零开头的数字'
                    }
                }
            },
            size: {
                validators: {
                    notEmpty: {
                        message: "请输入商品尺码"
                    },
                    regexp: {
                        regexp: /^\d{2}-\d{2}$/,
                        message: '必须是xx-xx的格式，xx是两位数字，列如：33-44'
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
            picStatus: {
                validators: {
                    notEmpty: {
                        message: "请上传3张图片"
                    }
                }
            }
        }
    });

    // 注册表单校验
    $('#form').on("success.form.bv", function (e) {
        e.preventDefault();

        var paramsStr = $('#form').serialize();

        paramsStr += "&picName1=" + picArr[0].picName + "&picAdd1=" + picArr[0].picAddr;
        paramsStr += "&picName2=" + picArr[1].picName + "&picAdd2=" + picArr[1].picAddr;
        paramsStr += "&picName3=" + picArr[2].picName + "&picAdd3=" + picArr[2].picAddr;


        $.ajax({
            type: "post",
            url: "/product/addProduct",
            data: paramsStr,
            dataType: "json",
            success: function (info) {
                console.log(info);
                if (info.success) {
                    $('#addModal').modal("hide");
                    currentPage = 1;
                    render();

                    $('#form').data("bootstrapValidator").resetForm(true);
                    $('#dropdaowText').text("请选择二级分类");
                    $('#imgBox img').remove();
                    picArr = [];

                }
            }
        })
    })
})