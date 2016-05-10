/**
 * Created by Lich on 10.05.2016.
 */
$(document).ready(function(e){
   $('#create_invoice').on('submit', function(e){
       e.preventDefault();
       e.stopPropagation();
       var $form = $(this);
       console.log('000', $form)
       console.log('444444444444444444444', $form.serialize())
       var method = $form.attr("method");
       $.ajax({
           url: $form.attr("action"),
           method: $form.attr("method"),
           data: $form.serialize(),
           dataType: "json",
           success: function(data) {
              console.log(data)
           }
       })
   })
});