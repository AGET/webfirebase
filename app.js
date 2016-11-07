
$(document).ready(function() {
    var config = {
      apiKey: "AIzaSyD8hpaZc0CbFT_v2213sWo43W0gifLBddI",
      authDomain: "fmc-test-f01c4.firebaseapp.com",
      databaseURL: "https://fmc-test-f01c4.firebaseio.com"
    };
    firebase.initializeApp(config);
    var rootRef = firebase.database().ref();

    rootRef.on("value", function(snapshot) {
        //console.log(snapshot.val());

        var data = snapshot.val();

        $("#playersTable tbody").empty();

        var row = "";

        for (player in snapshot.val()) {
            //console.log(player, ',', data[player]);

            row += "<tr>" +
                "<td class=\"playerName\">" + player + "</td>" +
                "<td class=\"mail\">" + data[player].mail + "</td>" +
                "<td class=\"number\">" + data[player].number + "</td>" +
                "<td class=\"position\">" + data[player].position + "</td>" +
                "<td> <div class=\"btnEdit btn btn-warning glyphicon glyphicon-edit\"></div</td>"+
                "<td> <div class=\"btnDelete btn btn-danger glyphicon glyphicon-remove\"   ></div> </td>" +
                "</tr>"
        }

        // console.log(row)

        $("#playersTable tbody").append(row);
        row = "";

        //*** Delete record from firebase
        $(".btnDelete").click(function() {
            console.log('clicked')
            var selectedPlayer = $(this).closest("tr")
                .find(".playerName")
                .text();

            // Si dejas .remove() son parametros se borra toda la base de datos ¡CUIDADO!
            console.log(selectedPlayer)
            rootRef.child(selectedPlayer).remove();
            
        })

        // Editar dato de firebase
        $(".btnEdit").click(function(){
            console.log("clicked");
            var selectedPlayer = $(this).closest("tr")
            .find(".playerName")
            .text();

            // console.log(selectedPlayer)

            // signacion de datos a los campos de formulario
            $("#nombreCompleto").val($(this).closest("tr").find(".playerName").text());
            $("#mail").val($(this).closest("tr").find(".mail").text());
            $("#number").val($(this).closest("tr").find(".number").text());
            $("#position").val($(this).closest("tr").find(".position").text());
            $("#btnSend").text("Actualizar").removeClass("btn-primary").addClass("btn-warning").unbind("click").click(function(){
                rootRef.child(selectedPlayer).update({
                    mail : $("#mail").val(),
                    number : $("#number").val(),
                    position : $("#position option:selected").text()
                }, function(){
                    $("#nombreCompleto").val("");
                    $("#mail").val("");
                    $("#number").val("");
                    $("#position").val("");
                    $("#btnSend").text("Enviar").removeClass("btn-warning").addClass("btn-primary").unbind("click").click(sendData);

                })
            });

        })
    
    $("#btnSend").click(sendData);

    }, function(errorObject) {
        console.log("The read failed: " + errorObject.code);
    });


    //*** Sending data to firebase
    

    function sendData() {
        var fullName = $("#nombreCompleto").val();

        var dataPlayer = {
            name: fullName,
            mail: $("#mail").val(),
            number: $("#number").val(),
            position: $("#position option:selected").text()
        }

        var onComplete = function(error) {
            if (error) {
                console.log(error, 'La sincronización fallo');
            } else {
                console.log(error, 'La sincronización ha sido exitosa');
                $("#nombreCompleto").val("");
                $("#mail").val("");
                $("#number").val("");
                $("#position").val("");
                $("#myModalInsertado").modal("show");
            }
        }

        rootRef.once('value', function(snapshot) {
            if (snapshot.hasChild(fullName)) {

                $('#myModal').modal('show');
            } else {
                rootRef.child(fullName).set(dataPlayer, onComplete);
            }
        })
    }


});
