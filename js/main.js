/**
 * Created by sbierti on 05/06/17.
 */
$(document).ready(function() {
    var lines = 1;

    function getFormData($form){
        var unindexed_array = $form.serializeArray();
        var indexed_array = {};

        $.map(unindexed_array, function(n, i){
            indexed_array[n['name']] = n['value'];
        });

        return indexed_array;
    }

    $('#first-banner').on('click',function(){
        $('#application-tiers').toggleClass('hidden');
    });

    $("#droppable").droppable({
        drop: function(event, ui) {
            var stack = ui.draggable.prop('id').split('_')[1];
            $('#droppable').html($('#'+stack).html());
            $('#droppable').prop('data-environment','--env='+stack);
            $('#finalCommand').text('');
            $('#application-tiers').toggleClass('hidden');
        }
    });
    $( ".draggable" ).draggable({ helper: "clone" });

    $('#aggiungi-proprieta').on('click', function(){
        $('#entity-form table tbody').append('<tr id="line_'+lines+'">'+
            '<td><span class="form-group"><input type="text" name="entity[property'+lines+'][name]" class="form-control" placeholder="nome, civico, data di nascita"></span></td>'+
            '<td><span class="form-group"><select name="entity[property'+lines+'][type]" class="form-control">'+
            '<option>String</option>'+
            '<option>Integer</option>'+
            '<option>Long</option>'+
            '<option>Double</option>'+
            '<option>Date</option>'+
            '</select>'+
            '</span></td>'+
            '<td class="amenities-pk"><span class="form-group"><input id="cb_'+lines+'" name="entity[property'+lines+'][pk]" class="pk-indicator" type="checkbox"></span></td>'+
            '<td class="amenities-x"><span id="lr_'+lines+'" class="glyphicon glyphicon-remove line-remover"></span></td>');
        $('#counterProps').addClass(''+lines+'');
        lines ++;
    });

    $('#entity-form table tbody').on('click','tr .line-remover',function(){
        var r = $(this).prop('id').split('_')[1];
        $(this).parent().parent().remove();
        $('#counterProps').removeClass(r);
    });

    $('#entity-form table tbody').on('click','input[type="checkbox"].pk-indicator',function(e) {
        var _this = $(this);
        var a = $('form table tbody tr input[type="checkbox"].pk-indicator:checked');
        for(var i=0;i<a.length;i++){
            var _item = $(a[i]);
            if(_item.prop('id') != _this.prop('id')){
                _item.prop('checked', false);
            }
        }
    });

    $('#entity-form-reset').on('click',resetForm);

    function resetForm(){
        $('#entity-form')[0].reset();
        var ep = $('#counterProps').prop('class').split(' ').slice(1);
        for(var i=0; i<ep.length;i++){
            $('#line_'+ep[i]).remove();
            $('#counterProps').removeClass(ep[i]);
        }
    }


    $('#entity-form-confirm').on('click',function(){
        if(getEnvironment() != undefined && produceEntityOutput() != undefined){
            var str = "sboot g " + getEnvironment() + " " + produceEntityOutput();
            $('#finalCommand').text(str);
            $('#myModal').modal('hide');
        } else {
            if(produceEntityOutput() == undefined){
                $('#finalCommand').text('Definisci in maniera completa l\'entita\', prima!!!');
            }
            if(getEnvironment() == undefined){
                $('#finalCommand').text('Definisci il layer di tecnologie, prima!!!');
                $('#myModal').modal('hide');
            }
        }
    });

    function getEnvironment(){
        return $('#droppable').prop('data-environment');
    }

    function checkEmptiness(prop){
        var formObj = getFormData($('#entity-form'));
        return !formObj[prop].trim();
    }

    function produceEntityOutput() {

        var formObj = getFormData($('#entity-form'));
        if (!checkEmptiness("entity[name]")) {
            var str = "";
            str += formObj['entity[name]'];
            if (!checkEmptiness('entity[collection]')) {
                str += ":" + formObj['entity[collection]'];
            }


            var properties = $('#counterProps').prop('class').split(' ');

            for (var i = 0; i < properties.length; i++) {
                if (!checkEmptiness('entity[property' + properties[i] + '][name]')) {

                    str += " " + formObj['entity[property' + properties[i] + '][name]'] + ":" + formObj['entity[property' + properties[i] + '][type]'];
                    if (formObj['entity[property' + properties[i] + '][pk]'] == "on") {
                        str += ":pk";
                    }
                }
            }
        }

        return str;
    }


});