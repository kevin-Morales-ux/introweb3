const form = document.getElementById("formulario");

form.addEventListener("submit", function (e) {
  e.preventDefault(); //evita que se recargue la pagina
  var nombres = document.getElementById("txtNombre").value;
  var apellido = document.getElementById("txtApellido").value;
  var correo = document.getElementById("txtCorreo").value;
  var edad = document.getElementById("txtEdad").value;

  var html =
    "<table border='1'>" +
    "<tr>" +
    "<td> Nombres:<td/> " +
    " <td>" +
    nombres +
    " </tr> " +
    "<tr>" +
    "<td> Apellido:<td/> " +
    " <td>" +
    apellido +
    " </tr>" +
    "<tr>" +
    "<td> correo:<td/> " +
    " <td>" +
    correo +
    " </tr>" +
    "<tr>" +
    "<td> edad:<td/> " +
    " <td>" +
    edad +
    " </tr>" +
    "<table>";

  document.getElementById("resultado").innerHTML = html;
  //"Nombres: "+nombres +"<br/>"+
  //"Apellidos: "+apellido +"<br/>"
});
 document.getElementById('btnTabla').addEventListener('click' ,function(){

      console.log("estoy aqui ");
      const num =3;

      let cadena =""; 

      for (let i = 1;i <= 10 ; i++) {
        //let res = num *i;
        //cadena += num + " * "+ i + " = " + res + "<br/>";
      
        cadena += "<input type ='text' value = 'Hola'> <br/>"
      }
      document.getElementById("resultado").innerHTML = cadena;
      
    }
    );