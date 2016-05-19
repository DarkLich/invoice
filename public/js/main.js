/**
 * Created by Lich on 10.05.2016.
 */

function convertToNumber(val){
    return isNaN(parseFloat(val)) ? 0 : parseFloat(val)
}

$(document).ready(function(e){
    $('#create_invoice').on('submit', function(e){
        e.preventDefault();
        e.stopPropagation();
        var $form = $(this);
        var method = $form.attr("method");
        $.ajax({
            url: $form.attr("action"),
            method: $form.attr("method"),
            data: $form.serialize(),
            dataType: "json",
            success: function(data) {
                console.log(data)
                if (data.state == "ok") {
                    window.location = '/invoice/create';
                } else {
                    $(".error-container").text(JSON.stringify(data));
                }
            }
        })
    });
    calculateSum();
    $("input.category-title").change(function(e){
       calculateSum();
    })
});

function calculateSum() {
    var gas_cost = ( convertToNumber($("input[name='bill.gas.counter_next']").val()) - convertToNumber($("input[name='bill.gas.counter_prev']").val()) ) * convertToNumber($("input[name='bill.gas.tariff_rate']").val());
    var water_cost = ( convertToNumber($("input[name='bill.water.counter_next']").val()) - convertToNumber($("input[name='bill.water.counter_prev']").val()) ) * convertToNumber($("input[name='bill.water.tariff_rate']").val());
    var el_counter_diff = convertToNumber($("input[name='bill.electricity.counter_next']").val()) - convertToNumber($("input[name='bill.electricity.counter_prev']").val());
    var el_cost = 0;
    var tarif2_value = el_counter_diff - convertToNumber($("input[name='bill.electricity.tariff_value']").val());
    if (tarif2_value > 0) {
        el_counter_diff -= tarif2_value;
        el_cost += tarif2_value * convertToNumber($("input[name='bill.electricity.tariff2_rate']").val());
    }
    el_cost += convertToNumber($("input[name='bill.electricity.tariff_rate']").val()) * el_counter_diff;
    var communal_cost = convertToNumber($("input[name='bill.communal.tariff_rate']").val());
    var heat_cost = convertToNumber($("input[name='bill.heat.tariff_rate']").val());
    var internet_cost = convertToNumber($("input[name='bill.internet.tariff_rate']").val());
    var garage_cost = convertToNumber($("input[name='bill.garage.tariff_rate']").val());

    $("input[name='bill.gas.cost']").val(gas_cost);
    $("input[name='bill.water.cost']").val(water_cost);
    $("input[name='bill.electricity.cost']").val(el_cost);
    $("input[name='bill.communal.cost']").val(communal_cost);
    $("input[name='bill.heat.cost']").val(heat_cost);
    $("input[name='bill.internet.cost']").val(internet_cost);
    $("input[name='bill.garage.cost']").val(garage_cost);

    $("input.total-comunal").val(gas_cost + water_cost + el_cost + communal_cost + heat_cost);
    $("input[name='invoice.total']").val(gas_cost + water_cost + el_cost + communal_cost + heat_cost + internet_cost + garage_cost);
}