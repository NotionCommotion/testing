(function($){
    //Doesn't support being able to use editable callback functions, and only autocomplete
    $.fn.editableAutocomplete = function(options) {
        // options is standard x-editable options (i.e. type, url, params, placement, send, ajaxOptions, etc)
        // PLUS an extra "autocomplete" property which is like:
        // {select: function(e, ui){},source: function(e, ui){}, params:{term:null, fields:['id','name']}, url: "/endpoint"}
        // params.fields is to tell server what to return
        // Note that select is only used currently for common chart points and source isn't used at all.

        console.log('on.init','this is the selected collection',this)
        var url=options.autocomplete.url;
        delete(options.autocomplete.url);
        var params=options.autocomplete.params;
        delete(options.autocomplete.params);
        var autocomplete=Object.assign({}, {
            source: function( request, response ) {
                params.term=request.term;
                $.getJSON( url, params, function(json) {
                    var data=[];
                    for (var j = 0; j < json.length; j++) {
                        data.push({id:json[j].id,label:json[j].name});
                    }
                    response(data);
                } );
            },
            minLength: 2,
            position: { my : "left top+20", at: "left bottom" },
            select: function(e, ui) {
                console.log('on.select','this is input.autocomplete',this)
                console.log('ui',ui)
                var $this=$(this);
                var editable=$this.data("editable");    //How to do this without using jQuery data()?
                $this.blur().parent().next().find('button.editable-submit').css('opacity', 1).off('click.prevent');
                editable.option('params', {value:ui.item.id, name:editable.options.params.name});
            }
            },options.autocomplete);
        delete(options.autocomplete);
        console.log('options editable',options, 'options autocomplete',autocomplete)


        //this.each(function () {
        this.editable(options)
        .on('shown', function(e, editable) {
            console.log('on.show','this is a.editable',this)
            console.log('editable',editable)
            var $input=editable.input.$input.val('').data('editable',editable); //What is the correct way to allow select to access editable?
            var $button=$input.parent().next().find('button.editable-submit').css('opacity', 0.3)
            .on('click.prevent', function() {return false;});
            //this.editable=editable;
            //var elem=this;    //Needed only for rare case such as common chart where integer PK isn't only used but column/row labels are also needed.
            //autocomplete.select.bind($input);
            //autocomplete.select.bind(this);
            console.log('input and button', $input, $button)
            $input.focus(function() {
                $button.css('opacity', 0.3).on('click.prevent', function() {return false;});
            })
            .autocomplete(autocomplete)
            .autocomplete('widget').click(function() {return false;});
        });
        //});
    };
    }(jQuery)
);

