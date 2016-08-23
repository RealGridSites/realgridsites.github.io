$(document).ready(function () {
    var basecampUrl = "https://basecamp.wrw.kr";
    var wapiUrl = basecampUrl + "/api";

    $.support.cors = true; //ajax - cross domain support

    getActiveCourses();

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

    function createEnrollment() {
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
            console.log(data);
        }).fail(function(err) {
            console.log(err);
        });
    }

    $("#send").click(function(e) {
        createEnrollment();
    });
});

//a7Q2HZRxgEyxqP5tlBybJH0pY3G0lg1E2fsrme9KXYtjzMa6J5pkvTJc6A1GtF5OLqoCEHKkpzT4wB_KMQdBhK80YlYdfh0Qu0AzrRh2GrE1
//m1pDCAQSYhrrYNbaqXuvnQmw-qVk6kcHKGwCiXgeLaQmuarHsKTAWJQL1Jt87H74zeYhoffFugNXZu0XBl1gS_VICoY7eI-zQhZcc0L3jKo1
