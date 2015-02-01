$(document).ready(function () {

    $('#saveBtn').click(function () {

        var company_name = $('#company_name').val();

        if (!company_name || company_name.length == 0) {
            sweetAlert("Oops...", "A field is missing", "error");
        }
        else {

            $.post('/api/saveCompanyName', {
                company_name: company_name
            }, function (response) {
                sweetAlert("Saved...", "Company name saved !", "success");
            });

        }

        return false;

    });
});