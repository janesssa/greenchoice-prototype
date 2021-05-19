import React from 'react'

type CardType = {
    type?: string
}

const Card = ({type}: CardType) => {
    if(type === 'tab') {
        return (
            <div>
                
            </div>
        )
    }

    if(type === 'title') {
        return (
            <div>
                
            </div>
        )
    }

    return (
        <div>
            
        </div>
    )
}

export default Card
