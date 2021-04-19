import React from "react"
import {
    Button,
    FormLabel,
    Card,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Divider,
    CardContent
} from "@material-ui/core"
import QrReader from 'react-qr-reader'
import FileSaver from 'file-saver'

import MenuInferior from "../components/MenuInferior"
import firebase from "../firebase"

import '../styles/inscricoes.css'

class Inscricoes extends React.Component {

    state = {
        confirmados: 0,
        naoConfirmados: 0,
        openInscrito: false,
        leitor: false,
        inscrito: {
            nome: '',
            cpf: '',
            telefone: '',
            email: '',
            camiseta: ''
        },
        inscritos: []
    }

    handleScan = value => {
        try {
            if (value !== null) {
                this.setState({inscrito: JSON.parse(value), openInscrito: true})
            }
        } catch (e) {

        }
    }

    onClickQrCode = () => {
        let {leitor} = this.state
        this.setState({leitor: !leitor})
    }

    confirmarIncricao = () => {
        let {inscrito} = this.state
        inscrito.confirmado = true
        this.setState({openInscrito: false, leitor: false})
        firebase
            .database()
            .ref(`Inscritos/${this.clearText(inscrito.cpf)}`)
            .set(inscrito)
            .then((data) => {

            }).catch((error) => {
            console.log('error ', error)
        })
    }

    clearText = text => {
        text = text.replace(/[^\d]+/g, '')
        return text.trim()
    }

    inscritos = () => {
        let context = this
        firebase.database().ref('Inscritos/')
            .on('value', snap => {
                if (snap.val() !== null) {
                    let s = Object.values(snap.val())
                    context.setState({inscritos: s})
                    context.confirmados(s)
                }
            })
    }

    onListar = () => {
        const {inscritos} = this.state
        let lista = []
        inscritos.forEach(i => {
            let inscrito = `Nome: ${i.nome}\nCPF: ${i.cpf}\nTelefone: ${i.telefone}\nemail: ${i.email}`
            lista.push(inscrito)
        })
        var blob = new Blob(lista, {type: "text/plain;charset=utf-8"});
        FileSaver.saveAs(blob, "inscritos.txt")
    }

    confirmados = inscritos => {
        let contConfirmados = 0
        let contNaoConfirmados = 0
        inscritos.forEach(i => {
            if (i.confirmado) {
                contConfirmados++
            } else {
                contNaoConfirmados++
            }
        })
        this.setState({confirmados: contConfirmados, naoConfirmados: contNaoConfirmados})
    }

    componentDidMount() {
        this.inscritos()

    }

    render() {
        const {
            leitor,
            openInscrito,
            confirmados,
            naoConfirmados,
            inscrito: {
                nome,
                cpf,
                telefone,
                email,
                camiseta
            },
            inscritos
        } = this.state
        return (
            <div id="main">
                <div id="content">
                    <FormLabel id="titulos-paginas">Inscrições</FormLabel>
                    <div id="inscricoes">
                        <div id="div-qrcode">
                            {
                                leitor &&
                                <QrReader
                                    delay={300}
                                    onError={this.handleError}
                                    onScan={this.handleScan}
                                    style={{width: '100%'}}
                                />
                            }
                            <Button style={{margin: 8}} variant="outlined" onClick={this.onClickQrCode}>Ler Qr
                                Code</Button>
                            <Button style={{margin: 8}} variant="outlined" onClick={this.onListar}>Arquivo de
                                inscritos</Button>

                            <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                                <FormLabel style={{margin: 8}}>{`Confirmados: ${confirmados}`}</FormLabel>
                                <FormLabel style={{margin: 8}}>{`Não confirmados: ${naoConfirmados}`}</FormLabel>
                            </div>

                        </div>
                        <Divider/>
                        <div>
                            {
                                inscritos.map(i => (
                                    <Card style={{margin: 8}}>
                                        <CardContent style={{display: "flex", flexDirection: "column"}}>
                                            <FormLabel id="texto">{`Nome: ${i.nome}`}</FormLabel>
                                            <FormLabel id="texto">{`CPF: ${i.cpf}`}</FormLabel>
                                            <FormLabel id="texto">{`Telefone: ${i.telefone}`}</FormLabel>
                                            <FormLabel id="texto">{`E-mail: ${i.email}`}</FormLabel>
                                            <FormLabel
                                                id="texto"
                                                style={i.confirmado ? {color: 'green'} : {color: 'red'}}>{i.confirmado ? 'Confirmado' : 'Não confirmado'}</FormLabel>
                                        </CardContent>
                                    </Card>
                                ))
                            }
                        </div>
                    </div>
                </div>

                <Dialog open={openInscrito} onClose={() => this.setState({openInscrito: false})}
                        aria-labelledby="form-dialog-title">
                    <DialogTitle id="form-dialog-title">Dados</DialogTitle>
                    <DialogContent style={{display: "flex", flexDirection: "column"}}>
                        <FormLabel id="texto">{`Nome: ${nome}`}</FormLabel>
                        <FormLabel id="texto">{`CPF: ${cpf}`}</FormLabel>
                        <FormLabel id="texto">{`Telefone: ${telefone}`}</FormLabel>
                        <FormLabel id="texto">{`E-mail: ${email}`}</FormLabel>
                        <FormLabel id="texto">{camiseta}</FormLabel>
                    </DialogContent>
                    <DialogActions>
                        <Button color="primary" onClick={() => this.setState({openInscrito: false})}>Cancelar</Button>
                        <Button color="primary" onClick={this.confirmarIncricao}>Confirmar</Button>
                    </DialogActions>
                </Dialog>

                <MenuInferior pagina="inscricoes"/>
            </div>
        )
    }
}

export default Inscricoes
