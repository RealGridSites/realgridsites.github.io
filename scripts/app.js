/*
    www.realgrid.com 전용 스크립트

*/

var basecampUrl = "http://basecamp.wrw.kr";
var wapiUrl = basecampUrl + "/api";

$(window).scroll(function () {
    stickyNavBar();
});

$(document).ready(function () {
    stickyNavBar();

    //ie에서 교육신청 오류 해결
    if (!window.console) console = { log: function () { } };
    //ajax - cross domain support
    $.support.cors = true;

    getActiveCourses();
    setFormValidations();

    $("#send").click(function(e) {
        createEnrollment();
    });

    $("#reqLicense").click(function(e) {
        showModalReqLicense();
    });

    $("#btnRequestLicense").click(function(e) {
        requestLicense();
    });

});


/*****************************************************************************/

/*--------------------------------------
  폼정보 지우기
---------------------------------------*/
function clearForm(form) {
    var formName = "#" + form;

    $(':input',formName)
      .not(':button, :submit, :reset, :hidden, #courseList')
      .not(':input[readonly]')
      .val('');
}

/*--------------------------------------
  교육과정 가져오기
---------------------------------------*/
function getActiveCourses() {
    $.ajax({
        type: "get",
        crossDomain: true,
        url: wapiUrl + "/ActiveCourses",
    }).done(function(data) {
        $("#courseList").find("option").remove().end();
        $.each(data, function (index, course) {
            $("#courseList")
                .append($("<option></option>")
                    .attr("value", course.Id)
                    .attr("disabled", function () {
                        if (course.Status != "접수중")
                            return "disabled";
                    })
                    .text(course.Title + "(" + course.Status + ")")
                    );
        })
    }).fail(function(err) {
        console.log(err);
    });
}

/*--------------------------------------
  수강신청 등록하기
---------------------------------------*/
function createEnrollment() {

    if (!$("#enrollmentForm").valid()) return;

    $.ajax({
        type: "post",
        crossDomain: true,
        data: {
            "Id": 0,
            "Student": {
                "Name": $("input#name").val(),
                "EMail": $("input#email").val(),
                "PhoneNumber": $("input#phone").val(),
                "Customer": {
                    "CompanyName": $("input#company").val()
                },
            },
            "CourseId": $("#courseList option:selected").val(),
            "Status": "신청완료"
        },
        url: wapiUrl + "/Enrollments",
    }).done(function(data) {
        $("#enrollmentMessage").html("교육신청이 완료되었습니다.<br/> 교육진행 일주일전 안내 메일이 발송됩니다.");
        $("#enrollmentModal").modal();
        clearForm("enrollmentForm");
    }).fail(function(err) {
        $("#enrollmentMessage").html("교육신청중 오류가 발생했습니다. 0505-325-8080(9102)로 전화주세요.");
        $("#enrollmentModal").modal();
        console.log(err);
    });
}

/*--------------------------------------
  scroll top - navbar 높이 조정
---------------------------------------*/
function stickyNavBar() {
    var scrollh = $(this).scrollTop();
    if (scrollh == 0) {
        $(".navbar").removeClass("navbar-sticky");
    } else {
        $(".navbar").addClass("navbar-sticky");
    }
}

/*--------------------------------------
  form validations
  scripts/plugins/jquery.validate.min.js
---------------------------------------*/
function setFormValidations() {
    $("#enrollmentForm").validate({
        rules: {
            company: {
                required: true
            },
            name: {
                required: true
            },
            email: {
                required: true,
                email: true
            },
            password: {
                required: true
            },
            studentPasswordConfirm: {
                required: true,
                equalTo: "#studentPassword"
            },
            phone: {
                required: true,
                //number: true
            },
            courseList: {
                required: true
            }
        },
        messages: {
            company: {
                /*required: function (element) {
                    alert("이름은 필수 입력 사항 입니다.");
                }*/
                required: "회사명을 입력하세요."
            },
            name: {
                required: "이름은 반드시 입력해야 합니다."
            },
            email: {
                required: "이메일은 꼭 입력하세요.",
                email: "이메일 형식이 잘못되었습니다. 예) id@domain.com"
            },
            password: {
                required: ""
            },
            studentPasswordConfirm: {
                required: "",
                equalTo: ""
            },
            phone: {
                required: "전화번호는 반드시 입력해야 합니다. 예) 010-1111-2222"
            },
            courseList: {
                required: "교육과정을 선택하세요."
            }
        },
        errorClass: "error",
        errorElement: "div"
    });

    $("#product_form").validate({
        rules: {
            lic_req_username: {
                required: true
            },
            lic_req_companyname: {
                required: true
            },
            lic_req_project: {
                required: true
            },
            lic_req_phonenumber: {
                required: true
            },
            lic_req_email: {
                required: true,
                email: true
            },
            lic_req_server: {
                required: true,
            }
        },
        messages: {
            lic_req_username: {
                /*required: function (element) {
                    alert("이름은 필수 입력 사항 입니다.");
                }*/
                required: "이름은 반드시 입력해야 합니다."
            },
            lic_req_companyname: {
                required: "회사명은 반드시 입력해야 합니다."
            },
            lic_req_project: {
                required: "원활한 기술지원을 위해 사업명이 필요합니다. 단순 테스트인 경우 '내부테스트용'과 같이 입력해 주세요."
            },
            lic_req_phonenumber: {
                required: "연락처는 반드시 입력해야 합니다."
            },
            lic_req_email: {
                required: "이메일은 꼭 필요합니다.",
                email: "이메일 형식이 잘못되었습니다. 예) id@domain.com"
            },
            lic_req_server: {
                required: "도메인이 없으면 라이선스키를 생성할 수 없습니다.",
            }
        },
        errorClass: "error",
        errorElement: "div"
    });
}


/*--------------------------------------
  라이선스 요청 Modal 창 생성
---------------------------------------*/
function showModalReqLicense() {
    $("#licenseModal").modal();
}

/*--------------------------------------
  라이선스 요청 보내기
---------------------------------------*/
function requestLicense() {
    var lic_name = $("input#lic_req_username");
    var lic_company = $("input#lic_req_companyname");
    var lic_phone = $("input#lic_req_phonenumber");
    var lic_email = $("input#lic_req_email");
    var lic_product = $("input#lic_req_product");
    var lic_server = $("input#lic_req_server");
    var lic_project = $("input#lic_req_project");
    var lic_memo = $("input#lic_req_memo");
    var lic_type = $("input[name=lic_req_type]:checked");

    if (!$("#product_form").valid()) return;

    // $("#req_ing").addClass("hidden");
    // $("#btnRequestLicense").removeClass("hidden");

    if ($("#selectJs")[0].checked) {
         $(lic_product).val("RealGridJs");
    } else if ($("#selectPlus")[0].checked) {
        $(lic_product).val("RealGridPlus");
    } else {
        $("#enrollmentMessage").html("제품선택에 오류가 발생했습니다. 0505-325-8080(9102)로 전화주세요.");
        $("#enrollmentModal").modal();
        return;
    }

    var data = {
        //반드시 공백으로 두어야 합니다.
        "Id": "",
        //이름(필수)
        "UserName": $(lic_name).val(),
        //회사(선택)
        "CompanyName": $(lic_company).val() +
            " / " + $(lic_project).val() +
            " / " + $(lic_memo).val(),
        //전화(필수)
        "PhoneNumber": $(lic_phone).val(),
        //이메일(필수)
        "Email": $(lic_email).val(),
        //제품:RealGridPlus, RealGridJs
        "Product": $(lic_product).val(),
        //판매처:wooritech 로 고정
        "Vender": "wooritech",
        //도메인(필수)
        "Server": $(lic_server).val(),
        //라이선스: Evaluation 으로 고정
        "LicenseType": $(lic_type).val(),
        "SendMail": true
    };

    // // DEBUG
    // console.log(data);
    // return;

    $.ajax({
        type: "POST",
        url: wapiUrl + "/LicenseRequests",
        contentType: 'application/json',
        dataType: "json",
        data: JSON.stringify(data)
    }).done(function (data) {
        //콘솔에 Id에 숫자가 들어 있는 license객체가 찍히면 정상 입력된 것.
        if (data && (data.id != "")) {
            $("#enrollmentMessage").html("평가판 라이선스 요청서가 정상적으로 등록 되었습니다. 업무시간이면 10분 이내에 메일로 라이선스가 발송됩니다.");
            $("#enrollmentModal").modal();
            $("#lic_close").click();
            clearForm("product_form");

            // $("#req_ing").css("display","none");
            // $("#btnRequestLicense").css("display","inline");
        }
    }).error(function (jqXHR, textStatus, errorThrown) {
        //에러나면 여기로 들어옴.
        $("#enrollmentMessage").html("전송에 실패 했습니다. 계속 오류가 발생할 경우 0505-325-8080(9102)로 전화주세요.");
        $("#enrollmentModal").modal();
        $("#lic_close").click();

        // console.log(jqXHR.responseText || textStatus);
        // $("#req_ing").css("display","none");
        // $("#btnRequestLicense").css("display", "inline");
        // alert("전송에 실패 했습니다. 다시 시도해 주세요. IE9에서는 정상적으로 동작하지 않습니다. IE10이상을 사용하시거나 크롬브라우저를 사용하세요.");
    });
}
