import React from 'react'
import {withRouter} from 'react-router-dom'
import {BottomNavigation, BottomNavigationAction} from '@material-ui/core'
import {isMobile} from "react-device-detect"
import {HomeRounded, ContactlessRounded, Book, ImportContactsRounded, Subscriptions, Dvr} from '@material-ui/icons'
import '../styles/menuInferior.css'

class MenuInferior extends React.Component {

    handleChange = (event, index) => {
        let pagina = this.props.history
        switch (index) {
            case 0:
                pagina.push('/podcasts')
                break
            case 1:
                pagina.push('/devocionais')
                break
            case 2:
                pagina.push('/inscricoes')
                break
            case 3:
                pagina.push('/')
                break
            case 4:
                pagina.push('/')
                break
            case 5:
                pagina.push('/')
                break
            default:
                break
        }
    }

    render() {
        let {pagina} = this.props
        return (
            <div>
                <BottomNavigation id="menu-footer" showLabels={true} onChange={this.handleChange}>
                    <BottomNavigationAction
                        label="Podcasts"
                        style={pagina === 'podcasts' ? {color: '#82af69'} : {color: 'white'}}
                        icon={<ContactlessRounded id="icons"
                                                  style={pagina === 'podcasts' ? {color: '#82af69'} : {color: 'white'}}/>}/>
                    <BottomNavigationAction
                        label="Devocionais"
                        style={pagina === 'devocionais' ? {color: '#009688'} : {color: 'white'}}
                        icon={<Book id="icons"
                                    style={pagina === 'devocionais' ? {color: '#009688'} : {color: 'white'}}/>}/>
                    <BottomNavigationAction
                        label="Inscrições"
                        style={pagina === 'inscricoes' ? {color: '#c6ff00'} : {color: 'white'}}
                        icon={<Dvr id="icons"
                                   style={pagina === 'inscricoes' ? {color: '#c6ff00'} : {color: 'white'}}/>}/>
                </BottomNavigation>
            </div>
        )
    }
}

export default withRouter(MenuInferior)