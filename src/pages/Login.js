import React from 'react'
import {withRouter} from 'react-router-dom'
import {TextField, Button, FormLabel} from '@material-ui/core'
import {createMuiTheme, MuiThemeProvider} from '@material-ui/core/styles'
import firebase from '../firebase'

import '../styles/login.css'

class Login extends React.Component {

    state = {}

    handleInputs = e => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    entrar = () => {
        const {email, senha} = this.state
        let ctx = this
        firebase.auth()
            .signInWithEmailAndPassword(email, senha)
            .then(function (result) {
                console.log(result)
                localStorage.setItem('insert:login', 'ok')
                ctx.props.history.replace('/inscricoes')
            })
    }

    autenticacao = () => {
        if (localStorage.getItem('insert:login')) {
            this.props.history.replace('/inscricoes')
        }
    }

    componentDidMount() {
        this.autenticacao()
    }

    render() {
        const theme = createMuiTheme({
            palette: {
                primary: {
                    main: '#1e1e1e'
                }
            },
        })

        return (
            <div id='content-login'>
                <div id='main-login'>
                    <MuiThemeProvider theme={theme}>
                        <div className='login'>
                            <FormLabel id='titulo-login'>Login insert</FormLabel>
                        </div>
                        <div className='login'>
                            <TextField variant="outlined" name="email" color="primary" label="Usuário"
                                       placeholder="Usuário" fullWidth={true} onChange={this.handleInputs}/>
                        </div>
                        <div className='login'>
                            <TextField variant="outlined" name="senha" color="primary" label="Senha" placeholder="Senha"
                                       fullWidth={true} onChange={this.handleInputs}/>
                        </div>
                        <div className='login'>
                            <Button onClick={this.entrar}>Entrar</Button>
                        </div>
                    </MuiThemeProvider>
                </div>
            </div>
        )
    }
}

export default withRouter(Login)