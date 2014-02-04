(function(){
    var $ajaxSubmitBtn = $("#J_ajax-submit");
    var $ajaxSubmitForm = $("#J_submit-form");

    var url = "/ajax/checkdata";
    var data = {};
    $ajaxSubmitBtn.on("click", function(){
        var date = $ajaxSubmitForm[0].date.value;
        var team = $ajaxSubmitForm[0].team.value;
        var not_home = $ajaxSubmitForm[0].not_home.value;
        $.extend(data,{
            date: date,
            team: team,
            not_home: not_home
        });
        $.get(url, data, function(response){
            console.log(response);
        });
    });
})();



