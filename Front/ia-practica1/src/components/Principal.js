import { useState,useEffect,useContext, useRef} from "react";
import axios from 'axios';
import { Grid, Typography } from '@mui/material';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Alert } from '@mui/material';
import 'bootstrap/dist/css/bootstrap.min.css';
import Swal from 'sweetalert2'



const TableComponent = ({Info, Porcen}) => {
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
          {Object.keys(Info).map((category, index) => (
            <TableRow key={index}>
              <TableCell>{category}</TableCell>
              <TableCell>{Info[category]}</TableCell>
              <TableCell>{Porcen[category]}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );

};




function Principal() {
  const [porcen,setPorcen] = useState({
    adult: 0,
    medical: 0,
    racy: 0,
    spoof: 0,
    violence: 0
    });

    //Variables de estado.
    const [showAlert,setShowAlert]=useState(false) 
    const [showAlertV,setShowAlertV]=useState(false)  
    const [infoImage, setInfoImage] = useState({
        adult: "",
        medical: "",
        racy: "",
        spoof: "",
        violence: ""
    });
    
    const valueTicket = {// posibles valores segun la etica de google
        VERY_UNLIKELY: 0,//15
        UNLIKELY: 20,//45
        POSSIBLE: 35,//65
        LIKELY: 60,//85
        VERY_LIKELY: 80//100
    };

    const [nCaras, setNCaras] = useState("...")
    const [image, setImage] = useState('https://cdn.pixabay.com/photo/2015/10/01/21/57/wallpaper-967836_1280.png');
    const fileInputRef = useRef(null); // Crear una referencia al input de tipo file
    // con el useRef se puede jalar el valor de un input creado en otra clase y colocarlo adentro de otra variable desada

    const handleCargarClick = () => {
        setPorcen({
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
                
                const porcenAux = {};

                console.log("Proceso de analisis de imagen")
                Object.keys(datos["safeSearchAnnotation"]).forEach(key => {
                  const stringValue = datos["safeSearchAnnotation"][key];
                  console.log(stringValue)
                  porcenAux[key] = valueTicket[stringValue];
                });
                console.log("El procentaje")
                console.log(porcenAux)
                setPorcen(porcenAux)


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

        const totalPercentage = parseInt(porcen.violence) + parseInt(porcen.racy) + parseInt(porcen.adult);
        
        setShowAlertV(false)
        setShowAlert(false)
        if (parseInt(porcen.violence) + parseInt(porcen.racy) + parseInt(porcen.adult) > 45) {
          document.getElementById('ImagenAnalizada').style.filter = 'blur(5px)';
          setShowAlert(true)
        }else if (parseInt(porcen.violence) >= 60) {
          document.getElementById('ImagenAnalizada').style.filter = 'blur(5px)';
        } else if (parseInt(porcen.racy) >=50) {
          document.getElementById('ImagenAnalizada').style.filter = 'blur(5px)';
        } else if (parseInt(porcen.adult) >= 40) {
          document.getElementById('ImagenAnalizada').style.filter = 'blur(5px)';
        }  else if (Object.values(porcen).every(value => value === 0)) {
          document.getElementById('ImagenAnalizada').style.filter = 'none';
          
        }
        else {
          document.getElementById('ImagenAnalizada').style.filter = 'none';
          setShowAlertV(true)
        }
      }, [porcen]);


  return (
    <div >
        <Grid container sx={{ display: "flex", fontFamily: "Arial" }}>
            <Grid container justifyContent={"left"}>
                
                <Typography variant="h3" component="h2"  align="right">
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
                <button type="button" className="btn btn-primary" onClick={handleCargarClick} style={{ marginTop: 2 }}>
                            Importar
                        </button>
                </Grid>
                <Grid item xs={2}>
                  {/* Modificar button a un button estándar de HTML */}
                  <button type="button" className="btn btn-success" onClick={handleProcesarClick} style={{ marginTop: 2 }}>
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
                
                <TableComponent Info={infoImage} Porcen={porcen}/>
                </Grid>
                <Grid item xs={1} />
            </Grid>
    </Grid>
    </div>
  );
}

export default Principal;
