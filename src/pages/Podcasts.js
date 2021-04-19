import React from "react"
import {Button, Card, CardMedia, CircularProgress, FormLabel, Input, Snackbar, TextField} from "@material-ui/core";
import {Delete, Edit} from "@material-ui/icons"
import MenuInferior from "../components/MenuInferior"
import firebase from "../firebase"
import '../styles/style.css'

class Podcasts extends React.Component {

    state = {
        podcasts: [],
        key: '',
        titulo: '',
        data: '',
        descricao: '',
        duracao: '',
        audio: '',
        imagem: '',
        porcentagem: '',
        progress: false,
        openSnackBar: false,
        messageSnackBar: ''
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

    handlePodcast = e => {
        const {key} = this.state
        if (e.target.files[0]) {
            const arquivo = e.target.files[0]
            let {name, type} = e.target.files[0]
            type = type.substring(0, type.lastIndexOf('/'))
            this.uploadPodcast(key, arquivo, type, name, this)
        }
    }

    uploadPodcast(key, arquivo, tipo, nome, context) {
        context.setState({progress: true})
        let uploadTask = firebase.storage().ref(`${tipo}/${key}-${nome}`).put(arquivo)
        uploadTask.on('state_changed', function (snapshot) {
            var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
            let porcentagem = `${progress.toFixed(0)}%`
            context.setState({porcentagem: porcentagem})
        }, function (error) {
            alert(error)
        }, function () {
            uploadTask.snapshot.ref.getDownloadURL().then(function (downloadURL) {
                context.setState({[tipo]: downloadURL, porcentagem: 'Pronto'})
            })
        })
    }

    podcasts = () => {
        let context = this
        firebase.database().ref('Podcasts/')
            .on('value', snap => {
                if (snap.val() !== null) {
                    context.setState({podcasts: Object.values(snap.val())})
                }
            })
    }

    salvar = () => {
        let {titulo, descricao, data, duracao, imagem, audio, key} = this.state

        if (titulo === '') {
            this.setState({openSnackBar: true, messageSnackBar: 'Título não pode ficar vazio'})
            return
        } else if (descricao === '') {
            this.setState({openSnackBar: true, messageSnackBar: 'Descrição não pode ficar vazio'})
            return
        } else if (data === '') {
            this.setState({openSnackBar: true, messageSnackBar: 'Data não pode ficar vazia'})
            return
        } else if (duracao === '') {
            this.setState({openSnackBar: true, messageSnackBar: 'Duração não pode ficar vazia'})
            return
        } else if (audio === '') {
            this.setState({openSnackBar: true, messageSnackBar: 'Escolha um audio'})
            return
        } else if (imagem === '') {
            this.setState({openSnackBar: true, messageSnackBar: 'Escolha uma imagem'})
            return
        }

        let json = {
            key: key,
            titulo: titulo,
            descricao: descricao,
            data: data,
            duracao: duracao,
            audio: audio,
            imagem: imagem
        }

        firebase
            .database()
            .ref(`Podcasts/${key}`)
            .set(json)
            .then((data) => {
                console.log(data)
                this.limpa()
            }).catch((error) => {
            console.log('error ', error)
        })
    }

    editar = objeto => {
        const {titulo, descricao, data, duracao, imagem, audio, key} = objeto
        this.setState({
            key: key,
            titulo: titulo,
            descricao: descricao,
            data: data,
            duracao: duracao,
            audio: audio,
            imagem: imagem
        })
    }

    deletar = objeto => {
        firebase.database().ref(`Podcasts/${objeto.key}`).remove()
        this.limpa()
    }

    limpa = () => {
        this.setState({
            key: '',
            titulo: '',
            descricao: '',
            data: '',
            duracao: '',
            audio: '',
            imagem: ''
        })
        this.key()
    }

    key = () => {
        let hora = new Date()
        this.setState({key: hora.getTime()})
    }

    componentDidMount() {
        this.key()
        this.podcasts()
    }

    render() {
        const {podcasts, titulo, descricao, data, duracao, progress, porcentagem, audio, imagem, openSnackBar, messageSnackBar} = this.state
        return (
            <div id="main">
                <div id="content">

                    <FormLabel id="titulos-paginas">Podcasts</FormLabel>

                    <div id="formulario">
                        <div className="main-div">
                            <TextField id="" color="secondary" name="titulo" label="Título" value={titulo}
                                       variant="outlined" fullWidth={true} onChange={this.handleInputs}/>
                        </div>

                        <div className="main-div">
                            <TextField id="" color="secondary" name="descricao" label="Descrição" value={descricao}
                                       variant="outlined" fullWidth={true} onChange={this.handleInputs}/>
                        </div>

                        <div className="main-div">
                            <TextField id="" color="secondary" name="data" label="Data" value={data}
                                       variant="outlined" fullWidth={true} onChange={this.handleInputs}/>
                        </div>

                        <div className="main-div">
                            <TextField id="" color="secondary" name="duracao" label="Duração" value={duracao}
                                       variant="outlined" fullWidth={true} onChange={this.handleInputs}/>
                        </div>

                        <div className="main-div">
                            <FormLabel>Imagem</FormLabel>
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

                        <div className="main-div">
                            <FormLabel>Audio</FormLabel>
                            <Input type="file" fullWidth={true} onChange={this.handlePodcast}/>
                            <div id="div-progress">
                                {
                                    porcentagem !== '' &&
                                    <CircularProgress style={{margin: 4}}/>
                                }
                                <FormLabel
                                    style={{margin: 4}}>{porcentagem !== '' ? porcentagem : audio === '' ? '' : 'Audio carregado'}</FormLabel>
                            </div>
                        </div>

                        <div id="div-salvar-cancelar">
                            <Button variant="outlined" id="botoes" onClick={this.salvar}>Salvar</Button>
                            <Button variant="outlined" id="botoes" onClick={this.limpa}>Cancelar</Button>
                        </div>
                    </div>

                    <div id="lista">
                        {
                            podcasts.map(i => (
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

                <MenuInferior pagina="podcasts"/>
            </div>
        )
    }
}

export default Podcasts