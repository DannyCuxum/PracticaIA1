import { useState,useEffect,useContext, useRef} from "react";
import axios from 'axios';
import { Grid, Typography } from '@mui/material';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Alert } from '@mui/material';
import 'bootstrap/dist/css/bootstrap.min.css';
import Swal from 'sweetalert2'



const TableComponent = ({Data, Percentage}) => {
  return (
    <TableContainer sx={{marginTop:5}} component={Paper}>
      <Table sx={{}}>
        <TableHead>
          <TableRow sx={{backgroundColor:"#8dff33"}}>
            <TableCell sx={{color:"white"}}>Categoria</TableCell>
            <TableCell sx={{color:"white"}}>Valor</TableCell>
            <TableCell sx={{color:"white"}}>procentaje</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {Object.keys(Data).map((category, index) => (
            <TableRow key={index}>
              <TableCell>{category}</TableCell>
              <TableCell>{Data[category]}</TableCell>
              <TableCell>{Percentage[category]}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );

};




function Principal() {


    //Variables de estado.
    const [showAlert,setShowAlert]=useState(false)  // si no es apta para la institucion
    const [showAlertV,setShowAlertV]=useState(false)  // si es valida
    const [percentage,setPercentage] = useState({// me sirve para categorizar el valor de la etiqueta
        adult: 0,
        medical: 0,
        racy: 0,
        spoof: 0,
        violence: 0
        });
    const [infoImage, setInfoImage] = useState({
        adult: "",
        medical: "",
        racy: "",
        spoof: "",
        violence: ""
    });
    
    const valueTicket = {// posibles valores segun la etica de google
        VERY_UNLIKELY: 15,//15
        UNLIKELY: 45,//45
        POSSIBLE: 65,//65
        LIKELY: 85,//85
        VERY_LIKELY: 100//100
    };

    const [nCaras, setNCaras] = useState("...")
    const [image, setImage] = useState('https://cdn.pixabay.com/photo/2015/10/01/21/57/wallpaper-967836_1280.png');
    const fileInputRef = useRef(null); // Crear una referencia al input de tipo file
    // con el useRef se puede jalar el valor de un input creado en otra clase y colocarlo adentro de otra variable desada

    const handleCargarClick = () => {
        setPercentage({
          adult: 0,
          medical: 0,
          racy: 0,
          spoof: 0,
          violence: 0
        })
        const file = fileInputRef.current.files[0]; // Obtener el archivo seleccionado
        if (file) {
          // Leer el contenido del archivo seleccionado
          const reader = new FileReader();
          reader.onload = (event) => {
            setImage(event.target.result)
            
            //console.log('Contenido del archivo:', event.target.result); //formato 64bit
          };
          // Aquí mostramos la alerta de éxito utilizando SweetAlert
            Swal.fire({
              icon: 'success',
              title: 'Imagen cargada correctamente',
              showConfirmButton: false,
              timer: 1500 // El tiempo en milisegundos que quieres que se muestre la alerta
            });
      
          reader.readAsDataURL(file);
        } else {
          console.log('No se ha seleccionado ningún archivo.');
        }
      };
    
      //proceso para analizar la imagen conb la API
      const handleProcesarClick = () => {
        const file = fileInputRef.current.files[0]; // Obtener el archivo seleccionado
        if (file) {
          const formData = new FormData();
          formData.append('file', file);
    
          axios.post('http://localhost:8080/analyze-image', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })
              .then(response => {
                // Aquí mostramos la alerta de éxito utilizando SweetAlert
                Swal.fire({
                  icon: 'success',
                  title: 'Imagen Analizada correctamente',
                  showConfirmButton: false,
                  timer: 2500 // El tiempo en milisegundos que quieres que se muestre la alerta
                });
      
                console.log('Respuesta del servidor:', response.data);
                let trueJson = (response.data)
                //console.log(trueJson)
                let datos = trueJson["responses"][0]
                console.log(datos)
                //***************************************************************** */

                if(datos.hasOwnProperty('faceAnnotations')){// aqui confirmo si trae la propiedad faceAnnotations para saber si trae rostros
                  setNCaras(datos["faceAnnotations"].length)
                }else{// si no trae la propiedad faceAnnotations entonces no trae rostros
                  setNCaras("Rostros, No Detectados")
                }
                setInfoImage(datos["safeSearchAnnotation"])// aqui se guardan los datos de la imagen y las propiedades para difuminar
                
                const percentageAux = {};

                console.log("Proceso de analisis de imagen")
                Object.keys(datos["safeSearchAnnotation"]).forEach(key => {
                  const stringValue = datos["safeSearchAnnotation"][key];
                  console.log(stringValue)
                  percentageAux[key] = valueTicket[stringValue];
                });
                console.log("El procentaje")
                console.log(percentageAux)
                setPercentage(percentageAux)


                //***************************************************************** */
              })
              .catch(error => {
                  console.error('Error al enviar el archivo:', error);
              });
            } else {
              console.log('No se ha seleccionado ningún archivo.');
            }
      };
    
      useEffect(() => {
        // Check if 'violence' percentage is greater than or equal to 60
        setShowAlertV(false)
        setShowAlert(false)
        if (parseInt(percentage.violence) >= 45 && parseInt(percentage.racy) >= 45 && parseInt(percentage.adult) > 15) {
          // If true, apply blur to the image
          document.getElementById('ImagenAnalizada').style.filter = 'blur(5px)';
          setShowAlert(true)
        }else if (parseInt(percentage.violence) >= 65) {
          // If true, apply blur to the image
          document.getElementById('ImagenAnalizada').style.filter = 'blur(5px)';
        } else if (parseInt(percentage.racy) > 45) {
          // If true, apply blur to the image
          document.getElementById('ImagenAnalizada').style.filter = 'blur(5px)';
        } else if (parseInt(percentage.adult) >= 45) {
          // If true, apply blur to the image
          document.getElementById('ImagenAnalizada').style.filter = 'blur(5px)';
        } else  if (parseInt(percentage.violence) >0){ // si no es ninguna de las condiciones pero tan siquiera tiene valores (por que si 
                                                      //  se escogio la opcion cargar todo sera 0 pues no se evaluara nada solo se pondra
                                                      // la imagen)
          document.getElementById('ImagenAnalizada').style.filter = 'none';
          setShowAlertV(true) // si la imagen es valida, si no en cualquier cambio desaparecera esta opcion
        }
        else {
          // Otherwise, remove blur
          document.getElementById('ImagenAnalizada').style.filter = 'none';
        }
      }, [percentage]);


  return (
    <div >
        <Grid container sx={{ display: "flex", fontFamily: "Arial" }}>
            <Grid container justifyContent={"left"}>
                
                <Typography variant="h3" component="h2"  align="">
                    Practica 1
                </Typography>
                
            </Grid>
            <Grid container>
                <Grid item xs={7}>
                <input
                            type="file"
                            accept=".jpg, .png,.jpeg"
                            style={{ width: "80%", marginTop: 1, marginLeft: 5 }}
                            ref={fileInputRef}
                        />
                </Grid>
                <Grid item xs={2}>
                {/* Modificar button a un button estándar de HTML */}
                <button type="button" class="btn btn-primary" onClick={handleCargarClick} style={{ marginTop: 2 }}>
                            Importar
                        </button>
                </Grid>
                <Grid item xs={2}>
                  {/* Modificar button a un button estándar de HTML */}
                  <button type="button" class="btn btn-success" onClick={handleProcesarClick} style={{ marginTop: 2 }}>
                            Analizar
                        </button>
                  </Grid>
            </Grid>
            <Grid container>
                <Grid item xs={1} />
                <Grid item xs={4}>
                {/*APARTADO PARA IMAGEN*/}
                <img  id="ImagenAnalizada" src={image} alt="Imagen" style={{ maxWidth: '100%', maxHeight: '100%' }} />
                {showAlert && <Alert variant="filled" severity="error" sx={{ marginTop: 2 }}>Imagen no apta para la institución</Alert>}
                {showAlertV && <Alert variant="filled" severity="success" sx={{ marginTop: 2 }}>Imagen Valida</Alert>}
                </Grid>
                <Grid item xs={2} />
                <Grid item xs={4}>
                {/*APARTADO PARA INFO IMAGEN
                    Este textarea no se puede modificar manualmente a menos que se agrege un onChange={handleInputChange}
                    donde handleInputChange seria una funcion cualquiera que cambia los valores de la variable a través
                    del uso de setVariable declarado en el useEffect, el handleInputChange deberia de ser handleInputChange(event){event.target.value}
                */}
                <Grid container>
                <input
                                type="text"
                                style={{ width: "80%", marginTop: 5, marginLeft: 5 }}
                                value={String(nCaras)}
                                readOnly // Para hacer el input de solo lectura
                            />
                </Grid>
                
                <TableComponent Data={infoImage} Percentage={percentage}/>
                </Grid>
                <Grid item xs={1} />
            </Grid>
    </Grid>
    </div>
  );
}

export default Principal;
