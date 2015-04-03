 $("#dialog-modal").dialog(
    {
        width: 600,
        height: 400,
        open: function(event, ui)
        {
            var textarea = $('<textarea style="height: 276px;">');
            $(textarea).redactor({
                focus: true,
                maxHeight: 300,
                initCallback: function()
                {
                    this.code.set('<p>Lorem...</p>');
                }
            });
        }
     });