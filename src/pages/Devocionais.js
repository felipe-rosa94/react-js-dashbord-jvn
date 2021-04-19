import React from "react"
import MenuInferior from "../components/MenuInferior"
import {Card, TextField, Input, Button, FormLabel, CardMedia, Snackbar, CircularProgress} from '@material-ui/core'
import {Edit, Delete} from "@material-ui/icons"
import firebase from "../firebase"
import '../styles/style.css'

class Devocionais extends React.Component {

    state = {
        devocionais: [],
        openSnackBar: false,
        progress: false,
        messageSnackBar: '',
        titulo: '',
        subTitulo: '',
        texto: '',
        links: '',
        imagem: ''
    }

    handleInputs = e => {
        this.setState({[e.target.name]: e.target.value})
    }

    handleImage = e => {
        const {key} = this.state
        if (e.target.files[0]) {
            const image = e.target.files[0]
            this.uploadImage(key, image, this)
        }
    }

    uploadImage(key, image, context) {
        context.setState({progress: true})
        firebase.storage().ref('image/' + key)
            .put(image)
            .then(function (snapshot) {
                if (snapshot.state === 'success') {
                    firebase.storage().ref('image/' + key)
                        .getDownloadURL()
                        .then(url => {
                            context.setState({progress: false, imagem: url})
                        })
                }
            });
    }

    salvar = () => {
        let {titulo, subtitulo, texto, imagem, links, key} = this.state

        if (titulo === '') {
            this.setState({openSnackBar: true, messageSnackBar: 'Título não pode ficar vazio'})
            return
        } else if (texto === '') {
            this.setState({openSnackBar: true, messageSnackBar: 'Texto não pode ficar vazio'})
            return
        } else if (imagem === '') {
            this.setState({openSnackBar: true, messageSnackBar: 'Escolha uma imagem'})
            return
        }

        let json = {
            key: key,
            titulo: titulo,
            subTitulo: subtitulo !== undefined ? subtitulo : '',
            texto: texto,
            links: links !== undefined ? links : '',
            imagem: imagem
        }

        firebase
            .database()
            .ref(`Devocional/${key}`)
            .set(json)
            .then((data) => {
                console.log(data)
                this.limpa()
            }).catch((error) => {
            console.log('error ', error)
        })
    }

    editar = objeto => {
        const {titulo, subtitulo, texto, links, imagem, key} = objeto
        this.setState({
            key: key,
            titulo: titulo,
            subTitulo: subtitulo,
            texto: texto,
            links: links,
            imagem: imagem
        })
    }

    deletar = objeto => {
        firebase.database().ref(`Devocional/${objeto.key}`).remove()
        this.limpa()
    }

    limpa = () => {
        this.setState({
            titulo: '',
            subtitulo: '',
            texto: '',
            links: '',
            imagem: ''
        })
        this.key()
    }

    devocionais = () => {
        let context = this
        firebase.database().ref('Devocional/')
            .on('value', snap => {
                if (snap.val() !== null) {
                    context.setState({devocionais: Object.values(snap.val())})
                }
            })
    }

    key = () => {
        let hora = new Date()
        this.setState({key: hora.getTime()})
    }

    componentDidMount() {
        this.key()
        this.devocionais()
    }

    render() {
        const {devocionais, openSnackBar, messageSnackBar, titulo, subtitulo, texto, links, progress, imagem} = this.state
        return (
            <div id="main">
                <div id="content">

                    <FormLabel id="titulos-paginas">Devocionais</FormLabel>

                    <div id="formulario">
                        <div className="main-div">
                            <TextField id="" color="secondary" name="titulo" label="Título" value={titulo}
                                       variant="outlined" fullWidth={true} onChange={this.handleInputs}/>
                        </div>

                        <div className="main-div">
                            <TextField id="" color="secondary" name="subtitulo" label="Sub Título" value={subtitulo}
                                       variant="outlined" fullWidth={true} onChange={this.handleInputs}/>
                        </div>

                        <div className="main-div">
                            <TextField id="" color="secondary" name="texto" label="Texto" variant="outlined"
                                       value={texto}
                                       multiline={true} fullWidth={true} onChange={this.handleInputs}/>
                        </div>

                        <div className="main-div">
                            <TextField id="" color="secondary" name="links" label="Links" variant="outlined"
                                       value={links}
                                       multiline={true} fullWidth={true} onChange={this.handleInputs}/>
                        </div>

                        <div className="main-div">
                            <Input type="file" fullWidth={true} onChange={this.handleImage}/>
                            <div id="div-progress">
                                {
                                    progress &&
                                    <CircularProgress style={{margin: 4}}/>
                                }
                                <FormLabel
                                    style={{margin: 4}}>{progress ? 'Carregando imagem aguarde ...' : imagem === '' ? '' : 'Imagem carregada'}</FormLabel>
                            </div>
                        </div>

                        <div id="div-salvar-cancelar">
                            <Button variant="outlined" id="botoes" onClick={this.salvar}>Salvar</Button>
                            <Button variant="outlined" id="botoes" onClick={this.limpa}>Cancelar</Button>
                        </div>
                    </div>

                    <div id="lista">
                        {
                            devocionais.map(i => (
                                <Card id="card">
                                    <CardMedia image={i.imagem} id="card-media"/>
                                    <div id="div-acoes">
                                        <FormLabel id="titulo">{i.titulo}</FormLabel>
                                        <div>
                                            <Edit id="botoes" onClick={() => this.editar(i)}/>
                                            <Delete id="botoes" onClick={() => this.deletar(i)}/>
                                        </div>
                                    </div>
                                </Card>
                            ))
                        }
                    </div>
                </div>

                <Snackbar
                    anchorOrigin={{vertical: 'bottom', horizontal: 'center'}}
                    open={openSnackBar}
                    autoHideDuration={2000}
                    onClose={() => this.setState({openSnackBar: false})}
                    message={messageSnackBar}
                />

                <MenuInferior pagina="devocionais"/>
            </div>
        )
    }
}

export default Devocionais