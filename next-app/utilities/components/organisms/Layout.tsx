import React from 'react'
import Header from 'utilities/components/molecules/Header'
import Navbar from 'utilities/components/molecules/Navbar'
import Phone from 'utilities/components/atoms/Phone'
import Content from 'utilities/components/organisms/Content'

const Layout = ({children}) => {
    return (
        <Phone>
            <Header />
            <Navbar />
            <Content>
                {children}
            </Content>
        </Phone>
    )
}

export default Layout
