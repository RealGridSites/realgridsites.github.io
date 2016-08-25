function stickyNavBar() {
    var scrollh = $(this).scrollTop();
    if (scrollh == 0) {
        $(".navbar").removeClass("navbar-sticky");
    } else {
        $(".navbar").addClass("navbar-sticky");
    }
}

$(window).scroll(function () {
    stickyNavBar();
});

$(document).ready(function () {
    var basecampUrl = "http://basecamp.wrw.kr";
    var wapiUrl = basecampUrl + "/api";

    //ie에서 교육신청 오류 해결
    if (!window.console) console = { log: function () { } };
    stickyNavBar();
    getActiveCourses();


    $.support.cors = true; //ajax - cross domain support
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
                    required: "이메일을 입력하세요.",
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

    // 교육과정 가져오기
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

    function clearForm(form) {
        var formName = "#" + form;

        $(':input',formName)
          .not(':button, :submit, :reset, :hidden, #courseList')
          .not(':input[readonly]')
          .val('');
    }

    // 수강신청 등록하기
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
            $("#enrollmentMessage").html("교육신청중 오류가 발생했습니다.:<br/>"+err.statusText);
            $("#enrollmentModal").modal();
            console.log(err);
        });
    }

    $("#send").click(function(e) {
        createEnrollment();
    });
});

//a7Q2HZRxgEyxqP5tlBybJH0pY3G0lg1E2fsrme9KXYtjzMa6J5pkvTJc6A1GtF5OLqoCEHKkpzT4wB_KMQdBhK80YlYdfh0Qu0AzrRh2GrE1
//m1pDCAQSYhrrYNbaqXuvnQmw-qVk6kcHKGwCiXgeLaQmuarHsKTAWJQL1Jt87H74zeYhoffFugNXZu0XBl1gS_VICoY7eI-zQhZcc0L3jKo1
