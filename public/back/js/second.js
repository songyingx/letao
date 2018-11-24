$(function () {
    var currentPage = 1;
    var pageSize = 5;

    render();

    function render() {
        $.ajax({
            type: "get",
            url: "/category/querySecondCategoryPaging",
            data: {
                page: currentPage,
                pageSize: pageSize
            },
            dataType: "json",
            success: function (info) {
                console.log(info);
                var htmlStr = template('secondTpl', info)
                $('tbody').html(htmlStr);

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


    $('#addBtn').click(function () {
        $('#addModal').modal("show");

        $.ajax({
            type: "get",
            url: "/category/queryTopCategoryPaging",
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


    $('.dropdown-menu').on("click", "a", function () {
        var txt = $(this).text();
        $('#dropdownText').text(txt);

        var id = $(this).data("id");
        $('[name = "categoryId"]').val(id);
        $('#form').data("bootstrapValidator").updateStatus("categoryId", "VALID");

    });

    $("#fileupload").fileupload({
        dataType: "json",
        //e：事件对象
        //data：图片上传后的对象，通过data.result.picAddr可以获取上传后的图片地址
        done: function (e, data) {
            console.log(data);
            var result = data.result;
            var picUrl = result.picAddr;
            $('#imgBox img').attr("src", picUrl);

            $('[name="brandLogo"]').val(picUrl);

            $('#form').data("bootstrapValidator").updateStatus("brandLogo", "VALID");
        }
    });

    $('#form').bootstrapValidator({

        excluded: [],
        // 小图标
        feedbackIcons: {
            valid: 'glyphicon glyphicon-ok',
            invalid: 'glyphicon glyphicon-remove',
            validating: 'glyphicon glyphicon-refresh'
        },

        fields: {
            categoryId: {
                validators: {
                    notEmpty: {
                        message: "请选择一级分类"
                    }
                }
            },
            brandName: {
                validators: {
                    notEmpty: {
                        message: "请输入二级分类"
                    }
                }
            },
            brandLogo: {
                validators: {
                    notEmpty: {
                        message: "请选择图片"
                    }
                }
            }
        }

    });

    $("#form").on("success.form.bv", function (e) {
        e.preventDefault();

        $.ajax({
            type: "post",
            url: "/category/addSecondCategory",
            data: $('#form').serialize(),
            dataType: "json",
            success: function (info) {
                console.log(info);
                if (info.success) {
                    $('#addModal').modal("hide");
                    currentPage = 1;
                    render();
                    $('#form').data("bootstrapValidator").resetForm(true);
                    $('#dropdownText').text("请选择一级分类");
                    $('#imgBox img').attr("src", "./images/none.png");
                }

            }
        })
    })

})